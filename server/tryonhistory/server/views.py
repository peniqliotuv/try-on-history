from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import NotFound
from rest_framework import viewsets, status
from rest_framework.decorators import detail_route
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.serializers import ValidationError
from rest_framework_jwt.settings import api_settings
from .models import Item, UserProfile, Offer, TryOnHistory
from .serializers import (
    UserProfileSerializer,
    TryOnHistorySerializer,
    OfferSerializer,
    UserSerializer,
    ItemSerializer,
)
from datetime import datetime, timezone
import requests
import logging


# Instantiate a Logger object
logger = logging.getLogger('views')
UPC_DB_URL = 'https://api.upcitemdb.com/prod/trial/lookup'


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = (IsAuthenticated,)

    '''
    We want to override this functionality because we want to perform a
    lookup in the database before we actually make a call to the UPC API.
    '''
    def retrieve(self, request, pk=None):
        try:
            item = Item.objects.get(pk=pk)
        except ObjectDoesNotExist:
            params = {'upc': pk}
            r = requests.get(UPC_DB_URL, params=params)
            json_response = r.json()
            if json_response['code'] == 'INVALID_UPC' or not json_response['items']:
                raise NotFound(detail='Data for upc %s not found' % pk, code=404)
            else:
                # Retrieve the item from the json response
                items = json_response['items'][0]

                product_name = items['title']
                product_description = items['description']
                lowest_price = items['lowest_recorded_price']
                highest_price = items['highest_recorded_price']
                brand = items['brand']
                image_urls = items['images']

                # Create the actual object
                item = Item.objects.create(
                    upc=pk,
                    product_name=product_name,
                    product_description=product_description,
                    lowest_price=lowest_price,
                    highest_price=highest_price,
                    brand=brand,
                    image_urls=image_urls
                )

                # First delete all of the previously existing offers in the database
                Offer.objects.filter(item=item).delete()

                # Create the Offer objects and associate them with the Item
                offers = items['offers']
                for offer in offers:
                    merchant = offer['merchant']
                    # Cast the string to a bool since reuslt comes back as an empty string
                    # if not available
                    available = bool(offer['availability'])
                    # Convert ms into python datetime object
                    updated_at = datetime.fromtimestamp(offer['updated_t'], timezone.utc)
                    link = offer['link']
                    price = offer['price']
                    shipping = float(offer['shipping']) if offer['shipping'] else 0
                    # Pass in the item that we just created
                    offer, created = Offer.objects.update_or_create(
                        merchant=merchant,
                        available=available,
                        price=price,
                        shipping=shipping,
                        link=link,
                        updated_at=updated_at,
                        item=item
                    )

        # Create the intermediary TryOnHistory object regardless
        obj, created = TryOnHistory.objects.get_or_create(
            user_profile=request.user.userprofile,
            item=item
        )

        # If it already exists, update the timestamp.
        if not created:
            obj.date_tried_on = datetime.now()
            obj.save()

        serializer = ItemSerializer(item)
        return Response(serializer.data)

    '''
    Overriding PUT because we want to only update the fit fields
    '''
    def update(self, request, pk=None):
        item = get_object_or_404(Item, pk=pk)
        # If incorrect parameters passed to PUT request
        if 'fit' not in request.data:
            response = {'detail': 'Fit attribute must be provided'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)
        elif type(request.data['fit']) is not float:
            response = {'detail': 'Fit attribute must be a float'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)
        else:
            data = request.data
            prev_total_score = item.fit * item.num_reviews
            data['num_reviews'] = item.num_reviews + 1
            data['fit'] = (prev_total_score + data['fit']) / data['num_reviews']
            serializer = ItemSerializer(item, data=data, partial=True)
            try:
                serializer.is_valid(raise_exception=True)
                serializer.save()
            except ValidationError:
                logger.error(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response(serializer.data, status=status.HTTP_200_OK)

    '''
    Retrieve all of the offers for a certain item
    '''
    @detail_route(methods=['GET'])
    def offers(self, request, pk=None):
        offers = Offer.objects.filter(item__upc=pk)
        if not offers:
            raise NotFound(detail='UPC %s not found' % pk, code=404)
        serializer = OfferSerializer(offers, many=True)
        return Response(serializer.data)


class HistoryViewSet(viewsets.ModelViewSet):
    queryset = TryOnHistory.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = TryOnHistorySerializer

    # Helper function
    def get_object(self, user_profile, pk):
        try:
            histories = TryOnHistory.objects.filter(user_profile=user_profile)
            return histories.get(item__upc=pk)
        except TryOnHistory.DoesNotExist:
            raise NotFound(detail='History for upc %s not found' % pk, code=404)

    '''
    Retrieve a list of all of a user's tried on histories
    '''
    def list(self, request):
        user_profile = request.user.userprofile
        histories = TryOnHistory.objects.filter(user_profile=user_profile)
        serializer = TryOnHistorySerializer(histories, many=True)
        return Response(serializer.data)

    '''
    Retrieve information about a user's tried on history of a specific item
    '''
    def retrieve(self, request, pk=None):
        history = self.get_object(request.user.userprofile, pk)
        serializer = TryOnHistorySerializer(history)
        return Response(serializer.data)

    '''
    Delete something from a user's tried on history
    '''
    def destroy(self, request, pk=None):
        history = self.get_object(request.user.userprofile, pk)
        history.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    '''
    Update the purchased status of the try-on-history
    '''
    def update(self, request, pk=None):
        if 'purchased' not in request.data:
            response = {'detail': '"purchased" field must be set'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)
        history = self.get_object(request.user.userprofile, pk)
        purchased = request.data['purchased']
        data = {
            'purchased': purchased,
            'date_purchased': datetime.now() if purchased else None
        }
        serializer = TryOnHistorySerializer(history, data=data, partial=True)
        try:
            serializer.is_valid()
            serializer.save()
        except ValidationError:
            logger.error(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.data, status=status.HTTP_200_OK)


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = (AllowAny,)

    '''
    Custom create_profile route to hit the post_save hook in the UserProfile model
    Only requires a username or password. Email can be set later.
    '''
    def create_profile(self, request):
        try:
            username = request.data['username']
            password = request.data['password']
        except KeyError:
            response = {'detail': 'Must provide username and password'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)
        # Check for duplicate users
        if User.objects.filter(username=username).exists():
            response = {'detail': 'User with such username already exists'}
            return Response(response, status=status.HTTP_409_CONFLICT)
        user = User.objects.create_user(
            username,
            None,
            password,
        )
        user.save()

        # Manually return the JWT token to be decoded client-side
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(user)
        token = jwt_encode_handler(payload)
        return Response({'token': token}, status=status.HTTP_201_CREATED)

    '''
    Override update because we want partial = True
    and we need to access the actual Django User object itself.
    '''

    def update(self, request, pk=None):
        user_profile = get_object_or_404(UserProfile, pk=pk)
        user = user_profile.user

        serializer = UserSerializer(user, data=request.data, partial=True)

        try:
            serializer.is_valid()
            serializer.save()
        except ValidationError:
            logger.error(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.data, status=status.HTTP_200_OK)

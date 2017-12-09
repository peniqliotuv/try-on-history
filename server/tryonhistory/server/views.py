from django.contrib.auth import authenticate
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.exceptions import NotFound
from rest_framework import generics, viewsets
from rest_framework.decorators import detail_route, list_route
from rest_framework.response import Response
from rest_framework.status import HTTP_401_UNAUTHORIZED
from rest_framework.permissions import IsAuthenticated
from .models import Item, UserProfile, Offer, TryOnHistory
from .serializers import ItemSerializer, UserProfileSerializer, TryOnHistorySerializer
from django.http import HttpResponseBadRequest
import requests
import logging
from datetime import datetime, timezone

# Instantiate a Logger object
logger = logging.getLogger('TryOnHistory')


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = (IsAuthenticated,)

    UPC_DB_URL = 'https://api.upcitemdb.com/prod/trial/lookup'

    '''
    We want to override this functionality because we want to perform a
    lookup in the database before we actually make a call to the UPC API.
    '''
    def retrieve(self, request, pk=None):
        try:
            item = Item.objects.get(pk=pk)
        except ObjectDoesNotExist:
            params = {'upc': pk}
            r = requests.get(self.UPC_DB_URL, params=params)
            json_response= r.json()
            if json_response['code'] == 'INVALID_UPC' or not json_response['items']:
            #     payload = json.dumps({'detail': 'Invalid upc %s' % pk})
            #     return HttpResponseBadRequest(payload, content_type='application/json')
            # elif not json_response['items']:
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

                # Create the intermediary object
                TryOnHistory.objects.create(user_profile=request.user.userprofile, item=item)

        # Retrieve from the database
        serializer = ItemSerializer(item)
        return Response(serializer.data)


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = (IsAuthenticated,)


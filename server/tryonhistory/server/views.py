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
import datetime
import requests


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
            r = requests.get('https://api.upcitemdb.com/prod/trial/lookup', params=params)
            json = r.json()
            if json['code'] == 'INVALID_UPC':
                return HttpResponseBadRequest('Invalid upc %s' % pk, content_type='application/json')
            elif not json['items']:
                raise NotFound(detail='Data for upc %s not found' % pk, code=404)
            return Response(json)

        serializer = ItemSerializer(item)
        return Response(serializer.data)


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = (IsAuthenticated,)


from django.shortcuts import render
from .models import Item, UserProfile, Offer, TryOnHistory
from .serializers import ItemSerializer, UserProfileSerializer
from rest_framework import status
from rest_framework import mixins
from rest_framework import generics


class ItemDetail(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView):

    queryset = Item.objects.all()
    serializer_class = ItemSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class ItemList(mixins.ListModelMixin, generics.GenericAPIView):

    queryset = Item.objects.all()
    serializer_class = ItemSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

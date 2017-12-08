from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework import status, mixins, generics, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_401_UNAUTHORIZED
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from .models import Item, UserProfile, Offer, TryOnHistory
from .serializers import ItemSerializer, UserProfileSerializer, TryOnHistorySerializer

import datetime


@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if not user:
        return Response({'error': 'Login Failed'}, status=HTTP_401_UNAUTHORIZED)
    # Return the appropriate token for the user
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key})


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = (IsAuthenticated,)

class UserProfileList(generics.ListAPIView):

    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer


class UserProfileDetail(generics.RetrieveAPIView):

    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

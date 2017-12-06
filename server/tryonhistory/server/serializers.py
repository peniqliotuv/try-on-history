from rest_framework import serializers
from .models import Item, UserProfile, Offer, TryOnHistory

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        # serialize all of the fields
        fields = '__all__'
        read_only_fields = ('id',)


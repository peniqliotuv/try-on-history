from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Item, UserProfile, Offer, TryOnHistory

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        # serialize all of the fields
        fields = '__all__'
        read_only_fields = ('id',)


class TryOnHistorySerializer(serializers.ModelSerializer):

    product_name = serializers.ReadOnlyField(source='item.product_name')
    id = serializers.ReadOnlyField(source='item.id')

    class Meta:
        model = TryOnHistory
        fields = ('product_name', 'id', 'date_tried_on', 'purchased',)

class UserProfileSerializer(serializers.ModelSerializer):

    id = serializers.IntegerField(source='pk', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    try_on_histories = TryOnHistorySerializer(
        source='tryonhistory_set', many=True, read_only=True
    )


    class Meta:
        model = UserProfile
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name',
            'created_at', 'updated_at', 'try_on_histories',
        )
        read_only_fields = ('created_at', 'updated_at',)

    def create(self, validated_data):

        user_data = validated_data.pop('user')

        try:
            User.objects.get(username=user_data['username'])
            raise serializers.ValidationError({'detail': 'Username already exists'})
        except User.DoesNotExist:
            # Create the user because it doesn't exist
            user = User.objects.create_user(**user_data)
            profile = UserProfile.objects.create(user=user, **validated_data)
            return profile

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        try:
            User.objects.get(username=user_data['username'])
            # First update User
            for attr, value in user_data.items():
                    setattr(instance.user, attr, value)
            # Then, update UserProfile
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()
            return instance
        except User.DoesNotExist:
            raise serializers.ValidationError({'detail': 'User does not exist'})
        except:
            raise serializers.ValidationError({'detail': 'Unknown error'})


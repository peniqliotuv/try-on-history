from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
import datetime
import logging


logger = logging.getLogger('models')


class Item(models.Model):
    upc = models.CharField(max_length=13, null=False, primary_key=True)
    product_name = models.CharField(max_length=200, null=False)
    brand = models.CharField(max_length=200)
    lowest_price = models.PositiveIntegerField(null=True, blank=True)
    highest_price = models.PositiveIntegerField(null=True, blank=True)
    # We want to be able to store multiple image URLS
    image_urls = ArrayField(models.URLField(null=True, blank=True), null=True, blank=True)
    product_description = models.TextField(blank=True)
    fit = models.FloatField(default=0.0)
    # negative means runs small, positive means runs big, 0 is just right
    num_reviews = models.PositiveIntegerField(blank=True, default=0)
    # divide fit by num reviews to get average fit

    def __str__(self):
        return "%s %s" % (self.brand, self.product_name)


# Just have a one-to-one on the Django User model
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    try_on_histories = models.ManyToManyField(Item, through='TryOnHistory')
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    def __str__(self):
        return "Username: %s " % self.user.username

    # Hook this method onto the save event of a user
    @receiver(post_save, sender=User)
    def create_user_profile(sender, instance=None, created=False, **kwargs):
        if created:
            UserProfile.objects.get_or_create(user=instance)

    # Hook this method onto the save event of the user
    @receiver(post_save, sender=User)
    def save_user_profile(sender, instance, **kwargs):
        instance.userprofile.save()


class Offer(models.Model):
    merchant = models.CharField(blank=True, max_length=200)
    available = models.NullBooleanField(default=None)
    price = models.IntegerField()
    shipping = models.FloatField(default=0)
    link = models.URLField(blank=True, null=True)
    updated_at = models.DateTimeField()
    item = models.ForeignKey(Item, on_delete=models.CASCADE)

    def __str__(self):
        return 'Product name: %s Merchant: %s' % (self.item.product_name, self.merchant)


class TryOnHistory(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    date_tried_on = models.DateTimeField(default=datetime.datetime.now)
    date_purchased = models.DateTimeField(null=True, blank=True)
    purchased = models.BooleanField(default=False)

    def __str__(self):
        username = self.user_profile.user.username
        product_name = self.item.product_name
        return 'Username: %s \n Product Name: %s \n' % (username, product_name)

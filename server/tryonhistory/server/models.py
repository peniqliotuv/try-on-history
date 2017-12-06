from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Item(models.Model):
    upc = models.CharField(max_length=12, null=False)
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
        return "%s %S" % (self.brand, self.product_name)

# Just have a one-to-one on the Django User model
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    try_on_histories = models.ManyToManyField(Item, through='TryOnHistory')
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    def __str__(self):
        return self.name

    # Hook this method onto the save event of a user
    @receiver(post_save, sender=User)
    def create_user_profile(sender, instance=None, created=False, **kwargs):
        if created:
            UserProfile.objects.get_or_create(user=instance)

    # Hook this method onto the save event of the user
    @receiver(post_save, sender=User)
    def save_user_profile(sender, instance, **kwargs):
        instance.UserProfile.save()

class Offer(models.Model):
    merchant = models.CharField(blank=True, max_length=200)
    available = models.NullBooleanField(default=None)
    price = models.IntegerField()
    link = models.URLField(blank=True, null=True)
    updated_at = models.DateField()
    item = models.ForeignKey(Item, on_delete=models.CASCADE)

class TryOnHistory(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    date_tried_on = models.DateField()
    purchased = models.BooleanField(default=False)

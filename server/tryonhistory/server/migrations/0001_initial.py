# Generated by Django 2.0 on 2017-12-06 08:18

from django.conf import settings
import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('upc', models.CharField(max_length=12)),
                ('product_name', models.CharField(max_length=200)),
                ('brand', models.CharField(max_length=200)),
                ('lowest_price', models.PositiveIntegerField(blank=True, null=True)),
                ('highest_price', models.PositiveIntegerField(blank=True, null=True)),
                ('image_urls', django.contrib.postgres.fields.ArrayField(base_field=models.URLField(blank=True, null=True), size=None)),
                ('product_description', models.TextField(blank=True)),
                ('fit', models.FloatField(default=0.0)),
                ('num_reviews', models.PositiveIntegerField(blank=True, default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Offer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('merchant', models.CharField(blank=True, max_length=200)),
                ('available', models.NullBooleanField(default=None)),
                ('price', models.IntegerField()),
                ('link', models.URLField(blank=True, null=True)),
                ('updated_at', models.DateField()),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='server.Item')),
            ],
        ),
        migrations.CreateModel(
            name='TryOnHistory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_tried_on', models.DateField()),
                ('purchased', models.BooleanField(default=False)),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='server.Item')),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(blank=True, max_length=254)),
                ('name', models.CharField(blank=True, max_length=50)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('try_on_histories', models.ManyToManyField(through='server.TryOnHistory', to='server.Item')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='tryonhistory',
            name='user_profile',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='server.UserProfile'),
        ),
    ]

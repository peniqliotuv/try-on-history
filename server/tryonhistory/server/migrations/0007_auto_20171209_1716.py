# Generated by Django 2.0 on 2017-12-09 17:16

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0006_offer_shipping'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tryonhistory',
            name='date_tried_on',
            field=models.DateTimeField(default=datetime.datetime.now),
        ),
    ]

# Generated by Django 2.0 on 2017-12-06 09:03

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0002_auto_20171206_0857'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='image_urls',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.URLField(blank=True, null=True), blank=True, null=True, size=None),
        ),
    ]

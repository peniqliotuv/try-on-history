# Generated by Django 2.0 on 2017-12-09 17:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0007_auto_20171209_1716'),
    ]

    operations = [
        migrations.AlterField(
            model_name='offer',
            name='shipping',
            field=models.FloatField(default=0),
        ),
    ]

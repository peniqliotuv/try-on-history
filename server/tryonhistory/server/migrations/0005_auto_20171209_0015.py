# Generated by Django 2.0 on 2017-12-09 00:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0004_auto_20171207_1819'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='item',
            name='id',
        ),
        migrations.AlterField(
            model_name='item',
            name='upc',
            field=models.CharField(max_length=12, primary_key=True, serialize=False),
        ),
    ]

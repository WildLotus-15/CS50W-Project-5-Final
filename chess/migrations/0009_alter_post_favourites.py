# Generated by Django 4.0.2 on 2022-02-24 08:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chess', '0008_post_favourites'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='favourites',
            field=models.ManyToManyField(related_name='favourites', to='chess.UserProfile'),
        ),
    ]

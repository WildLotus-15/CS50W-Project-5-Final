# Generated by Django 4.0.2 on 2022-02-18 06:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chess', '0009_post_likes'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
    ]
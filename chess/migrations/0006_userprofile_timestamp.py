# Generated by Django 4.0.2 on 2022-02-23 09:17

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('chess', '0005_alter_userprofile_picture'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='timestamp',
            field=models.DateTimeField(default=django.utils.timezone.now, null=True),
        ),
    ]
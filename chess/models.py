from sqlite3 import Timestamp
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.dispatch import receiver
from django.db.models.signals import post_save

# Create your models here.
class User(AbstractUser):
    pass

class UserProfile(models.Model):
    user = models.OneToOneField(User, primary_key=True, related_name="profile", on_delete=models.CASCADE)
    points = models.IntegerField(null=True)

    def serialize(self):
        return {
            "profile_id": self.user.id,
            "profile_username": self.user.username,
            "points": self.points
        }

class Post(models.Model):
    author = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    image = models.ImageField(null=True)
    description = models.CharField(max_length=64)
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.id,
            "author_username": self.author.user.username,
            "description": self.description,
            "image": self.image,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
        }
        
class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    author = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    comment = models.CharField(max_length=64)
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "author_username": self.author.user.username,
            "comment": self.comment,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p")
        }

@receiver(post_save, sender=User)
def create_user_profile(created, sender, instance, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
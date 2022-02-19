from django.conf import settings
from django.conf.urls.static import static
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.dispatch import receiver
from django.db.models.signals import post_save

# Create your models here.
class User(AbstractUser):
    pass

class UserProfile(models.Model):
    user = models.OneToOneField(User, primary_key=True, related_name="profile", on_delete=models.CASCADE)
    rating = models.IntegerField(null=True)

    def serialize(self):
        return {
            "profile_id": self.user.id,
            "profile_username": self.user.username,
            "profile_rating": self.rating
        }

class Post(models.Model):
    author = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    image = models.ImageField(null=True, blank=True)
    description = models.CharField(max_length=64)
    timestamp = models.DateTimeField(default=timezone.now)
    likes = models.ManyToManyField(UserProfile, blank=True, related_name="likes")

    def serialize(self, user):
        return {
            "id": self.id,
            "author_username": self.author.user.username,
            "author_id": self.author.user.id,
            "image": self.image.url,
            "description": self.description,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "comments": Comment.objects.filter(post=self).count(),
            "likes": self.likes.count(),
            "liked": not user.is_anonymous and self in UserProfile.objects.get(user=user).likes.all(),
            "editable": self.author.user == user
        }
        
class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    author = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    comment = models.CharField(max_length=64)
    timestamp = models.DateTimeField(default=timezone.now)
    likes = models.ManyToManyField(UserProfile, blank=True, related_name="comment_likes")

    def serialize(self, user):
        return {
            "id": self.id,
            "author_username": self.author.user.username,
            "comment": self.comment,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "likes": self.likes.count(),
            "liked": not user.is_anonymous and self in UserProfile.objects.get(user=user).comment_likes.all(),
            "editable": self.author.user == user,
            "removable": self.author.user == user
        }

@receiver(post_save, sender=User)
def create_user_profile(created, sender, instance, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
import json
from django.utils import timezone
from django.db import IntegrityError
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth import login, logout, authenticate

from chess.models import Post, User, UserProfile, Comment

# Create your views here.
def index(request):
    return render(request, "chess/index.html")


def load_posts(request):
    profile = request.GET.get("profile")
    if (profile):
        posts = Post.objects.filter(author=profile)
    else:
        posts = Post.objects.order_by('-timestamp')
    return JsonResponse({
        "posts": [post.serialize(request.user) for post in posts]
    }, safe=False)


def update_like(request, post_id):
    post = Post.objects.get(pk=post_id)
    if request.user.profile in post.likes.all():
        post.likes.remove(request.user.profile)
        newStatus = False
    else:
        post.likes.add(request.user.profile)
        newStatus = True
    return JsonResponse({"newLike": newStatus, "newAmount": post.likes.count()}, status=200)


def update_comment_like(request, comment_id):
    comment = Comment.objects.get(pk=comment_id)
    if request.user.profile in comment.likes.all():
        comment.likes.remove(request.user.profile)
        newStatus = False
    else:
        comment.likes.add(request.user.profile)        
        newStatus = True
    return JsonResponse({"newLike": newStatus, "newAmount": comment.likes.count()}, status=200)


def show_profile(request, profile_id):
    profile = UserProfile.objects.get(pk=profile_id)
    return JsonResponse(profile.serialize(), safe=False)


def add_comment(request, post_id):
    if request.method == "POST":
        data = json.loads(request.body)
        comment = data.get("comment")
        post_id = data.get("post_id")
        post = Post.objects.get(pk=post_id)
        newComment = Comment(author=request.user.profile, comment=comment, post=post)
        newComment.save()
        return JsonResponse({"success": True, "author": request.user.username, "timestamp": newComment.timestamp.strftime("%b %d %Y, %I:%M %p"), "newAmount": Comment.objects.filter(post=post).count(), "comment_id": newComment.id}, status=200)
    elif request.method == "PUT":
        data = json.loads(request.body)
        action = data.get("action")

        if action == "edit":
            new_comment = data.get("new_comment")
            comment_id = data.get("comment_id")
            comment = Comment.objects.get(pk=comment_id)
            comment.comment = new_comment
            comment.save()
            return JsonResponse({"success": True})
        elif action == "remove":
            comment_id = data.get("comment_id")
            post_id = data.get("post_id")
            post = Post.objects.get(pk=post_id)
            comment = Comment.objects.get(pk=comment_id)
            comment.delete()
            return JsonResponse({"success": True, "newAmount": Comment.objects.filter(post=post).count()})


def comments(request, post_id):
    post = Post.objects.get(pk=post_id)
    comments = Comment.objects.filter(post=post)
    return JsonResponse({
        "post": post.serialize(request.user),
        "comments": [comment.serialize(request.user) for comment in comments],
        "comments_amount": comments.count(),
    }, safe=False)


def create_post(request):
    if request.method == "POST":
        image = request.FILES.get("image")
        description = request.POST.get("description")
        if (image):    
            post = Post(author=request.user.profile, image=image, description=description)
        else:
            post = Post(author=request.user.profile, description=description)            
        post.save()
        return JsonResponse({"message": "Post was created successfully."}, status=200)
    elif request.method == "PUT":
        new_image = request.FILES.get("new_image")
        new_description = request.POST.get("new_description")
        post_id = int(request.POST.get("post_id"))
        post = Post.objects.get(pk=post_id)
        post.description = new_description
        post.image = new_image
        post.save()
        return JsonResponse({"message": "Post was updated successfully."})


def profile(request, profile_id):
    profile = UserProfile.objects.get(pk=profile_id)
    return JsonResponse(profile.serialize(), safe=False)


def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "chess/login.html", {
                "message": "Invalid username and/or password."
            })

    else:
        return render(request, "chess/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "chess/register.html", {
                "message": "Passwords must match."
            })
        
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "chess/register.html", {
                "message": "This username is already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "chess/register.html") 

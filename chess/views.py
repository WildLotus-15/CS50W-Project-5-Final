import json
from telnetlib import STATUS
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
    posts = Post.objects.order_by('-timestamp')
    return JsonResponse({
        "posts": [post.serialize() for post in posts]
    }, safe=False)


def add_comment(request, post_id):
    if request.method == "POST":
        data = json.loads(request.body)
        comment = data.get("comment")
        post_id = data.get("post_id")
        post = Post.objects.get(pk=post_id)
        newComment = Comment(author=request.user.profile, comment=comment, post=post)
        newComment.save()
        return JsonResponse({"success": True}, status=200)


def comments(request, post_id):
    post = Post.objects.get(pk=post_id)
    comments = Comment.objects.filter(post=post)
    return JsonResponse({
        "post": post.serialize(),
        "comments": [comment.serialize() for comment in comments]
    }, safe=False)


def create_post(request):
    if request.method == "POST":
        data = json.loads(request.body)
        description = data.get("description")
        post = Post(author=request.user.profile, description=description)
        post.save()
        return JsonResponse({"message": "Post was created successfully."}, status=200)


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

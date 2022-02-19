from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("load_posts", views.load_posts, name="load_posts"),
    path("profile/<int:profile_id>", views.profile, name="profile"),
    path("create_post", views.create_post, name="create_post"),
    path("post/<int:post_id>/comment", views.add_comment, name="add_comment"),
    path("post/<int:post_id>/comments", views.comments, name="comments"),
    path("profile/<int:profile_id>", views.show_profile, name="show_profile"),
    path("post/<int:post_id>/update_like", views.update_like, name="update_like"),
    path("comment/<int:comment_id>/update_like", views.update_comment_like, name="update_comment_like"),
    path("post/<int:post_id>/remove", views.remove_post, name="remove_post")
]
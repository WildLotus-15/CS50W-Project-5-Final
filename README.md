# CS50W-Project-5-Final

# Distinctiveness

# Complexity

# Models
In the models.py file I have defined User table, which handles the creation of registered users. There are also UserProfile, Post and Comment classes, which has its own serialize functions. UserProfile has OneToOneField relationship to User (only one user can link to only one profile). Post model stores created posts, it has Author with OneToMany relationship linked to UserProfile, ImageField atribute, Text based description, Timestamp with modified format, Likes atribute with ManyToManyField to UserProfile (many user can like many posts), and favourites attribute having many to many relationship to users.(many user can add many posts into their individual "favourite" section of a web page).

Comment class is used to store specific comments related to the post, to make that happen Foreign key relationship comes in handy, of course comment is having an Author, Timestamp and Text based comment itself, I have also included Likes field, so user will have the ability to leave a like on comment.

In the end there is usage of Django signal which is being triggered after user registration. First I'm creating an user profile and then saving it in the database.

# settings.py
Besides of the default configuration of the project I added app name in installed apps, AUTH_USER_MODEL (Django uses is it in order to authenticate an user), MEDIA_URL (Which is a way of accessing media files by their url) and MEDIA_ROOT (To store all media files).

# Root urls.py
In the project's root urls.py file I included app urls in default route. With the use of re_path and specified path User can download Image Files, following code on line 29 (extending urlpatterns) gives an ability to access an actual image with its url so then I can access them and then display it on the index page.

# views.py
index function just returns index template

## load posts function returns JSON response. By setting safe parameter's value to True I am allowing non dictionary objects to be serialized from Post model class.

create post function handles post creation logic. After checking request method I'm getting all data which has been sent via JS FormData(), after processing it, post is being saved and success message is being returned.  

edit post function allows post author to update its contents, after getting all data that was submitted via JS FormData() old post values
are being replaced be with new ones. After updating post, new image url is being returned so I can display updated content without requiring of refreshing entire page.

remove post function simply removes post. 

add comment function handles comment adding, editing and removing. If intension was to create a comment it is being saved after getting all required data: comment content and post_id (to set relationship between), after this process JSON response is being returned populated with comment itself so it will be added automatically to the page. if comment edit is being called, after getting all required data comment content is replaced with a new one. Else if desire was to remove comment simply logic will execute comment removing by getting comment id

update comment like function updates specific comment like (adds it or removes after passing if statement) then it returns JSON response with the newStatus and newAmount
to modify existing comment details so refreshing page and getting new data wouldn't be required.

update like function updates post like (adds it or removes it after running if else conditions). Then it returns JSON resonse just as like update comment like in order to modify existing post details dynamically.

comments function returns all the comments in relation to specific post using serializer by first getting post id and then using it to filter existing comments also i am returning amount of it just for visualising.

favourites function returns all favourite posts in relation of requested user by serializing them

update favourites function updates requested users web page's favourites section, by adding an post item or removing it, after passing some if else statements. It also returns newFavourite variable so the user will know if post is in their favourites or not.
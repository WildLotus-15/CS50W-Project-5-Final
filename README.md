# CS50W-Project-5-Final

# Distinctiveness
TODO

# Complexity
TODO

# models.py
In the models.py file I have defined User table, which handles the creation of registered users. There are also UserProfile, Post and Comment classes, which has its own serialize functions. UserProfile has OneToOneField relationship to User (only one user can link to only one profile). Post model stores created posts, it has Author with OneToMany relationship linked to UserProfile, ImageField atribute, Text based description, Timestamp with modified format, Likes atribute with ManyToManyField to UserProfile (many user can like many posts), and favourites attribute having many to many relationship to users. (many user can add many posts into their individual "favourite" section of a web page).

Comment class is used to create and store specific comments related to the post, to make that happen Foreign key relationship comes in handy, of course comment is having an Author, Timestamp and Text based comment itself, I have also included Likes field, so user will have the ability to leave a like on comment.

In the end there is usage of Django signal which is being triggered after user registration. First I'm creating a profile based on user instance and then saving it in the database. (In result when user is being registered its profile is created automatically).

# settings.py
Besides of the default configuration of the project I added app name in installed apps, AUTH_USER_MODEL (Django uses is it in order to authenticate an user), MEDIA_URL (Which is a way of accessing media files by their url) and MEDIA_ROOT (To store all media files).

# root urls.py
In the project's root urls.py file I included app urls in default route. With the use of re_path and specified path User can download Image Files, following code on line 29 (extending urlpatterns) gives an ability to access an actual image with its url so then I can access them and then display it on the index page.

# views.py
index function just returns index template

load posts function returns JSON response. By setting safe parameter's value to True I am allowing non dictionary objects to be serialized from Post model class.

create post function handles post creation logic. After checking request method I'm getting all data which has been sent via JS FormData(), after processing it, post is being saved and success message is being returned.  

edit post function allows post author to update its contents, after getting all data that was submitted via JS FormData() old post values
are being replaced be with new ones. After updating post, new image url is being returned so I can display updated content without requiring of refreshing entire page.

remove post function simply removes post. 

add comment function handles comment adding, editing and removing. If intension was to create a comment it is being saved after getting all required data: comment content and post_id (to set relationship between), after this process JSON response is being returned populated with comment itself so it will be added automatically to the page. if comment edit is being called, after getting all required data comment content is getting replaced with a new one. Else if desire was to remove comment simply logic will execute comment removing after getting required comment id.

update comment like function updates specific comment like (adds it or removes after passing if statement) then it returns JSON response with the newStatus and newAmount
to modify existing comment details so refreshing page and getting new data wouldn't be required.

update like function updates post like (adds it or removes it after running if else conditions). Then it returns JSON resonse just as like update comment like in order to modify existing post details dynamically.

comments function returns all the comments in relation to specific post using serializer by first getting post id and then using it to filter existing comments also i am returning amount of it just for visualising.

favourites function returns all favourite posts in relation of requested user by serializing them

update favourites function updates requested users individual favourites section, by adding a post item to it or removing it, after passing some if else statements. It also returns newFavourite variable so the user will know if post is in their favourites or not.

profile function returns specific serialized profile in relation to what pk value of it was sent from client side

login view handles user signing in functionality. First it is getting all required values to make that happen, username and password that was been sent via post request form. If user with that inputted creadintials exists in database user is being authenticaded and redirected to index page. Else if there was sent invalid credintials, message is being returned idenficating that state. If user just visits login page template is being rendered.

logout view simply logs out currently signed in user and then redirecting it on index page.

register function handles user registration. First it is getting all data that was being sent via post request form: username, email, password, confimation. Then it is making sure that password and confirmation values mathces (If not, message is being returned informing that). Then it creates user with gathered information and redirects it to index page, after making sure that user doesn't exists with same cradentials in the database (If so message is being returned to notify user). If the intension was to just visit registration page, template is being retured.

# app urls.py
there are stored urlpatterns for an application which are related to functionality like:
1. viewing: index, login, logout, register, profile, favourites pages. 
2. creating: posts, comments.
3. updating: favourites section, comment, post, comment like, post like.
4. deleting: post, comment, item from favourites section.
5. accessing: comments related to specific posts. 

# templates
layout.html is the base html file which is being extended by all other markup files in django block tags. There is being used bootstrap CSS and JS (jQuery, Popper.js) links in order to make web site more interactive and responsive. Besides that there is included navigation bar to make things more comforable to user by allowing visiting any section quickly.

index.html is extending layout file by its title, body containing: newPost div which has form responsible of making new posts, profile div which by default is not displaying and contains information about profile, posts div place where are posts displayed, and script linking to JS file. 

login.html is extending layout file by its title and body containing header, sign in form and register link. 

register.html is extending layout file by its title and body containing header, register form and sign in link. 

# static
In static folder there is sub directory called "meme/images/", this is the place where are media files are being saved after successfully creating or updating post.

Also there are svg files that I am using called "heart-fill.svg" and "heart.svg" for better like icon styling purposes.

styles.css is used for only styling page body. Its declaration is directed to font-family and font-size properties who's values are "sans-serif" and "x-large".

index.js is used to make happen all that functionality I have discribed upwards so full load goes on one file

everything starts after using DOMContentLoaded event listener, first I'm loading all posts which uses fetch call to the url that returns JSON response of all objects from Post class, so then I can use forEach command to build every post from its serialized values returned from array. build post function itself takes post as an input and then accesses its values using dot operator and key name specified after.

I used bootstrap cards for container because it has responsive behavior. when post image is created I'm setting its src attribute to post.image (in model seriaze function post.image is equal to image url so image will display by its source). drop down menu helped me to have simpler design It stores four links which are responsible for post editing and deleting (Those are feasible if request user matches with post author), image downloading (to make that happen I set its download and href attribute equal to post.image itself and also used re_path with download path in projects root urls.py), adding post into favourites.

To make user access their favorite section where all favourite posts are stored first I am checking if user is signed in if not when he tries to create new post is forced to log in.

To add an post item to user favourites section, update favourite function is being run. It fetches into specified url and in dependence of result of an if statement, post is being added to favourites or removed from it. 

After making sure that post author matches with requested user post can be edited or deleted. one uses PUT request method and second one DELETE. To update post, post id is required with new description and new image provided. I tried to populate new image file field value with existing image but I only could set it equal to an emtpy string.
After making changes post content is updated so page refreshing isn't required. delete post simply sends post id which is used to get that post instance which we want to delete, after that back end data manipulation on the front end post card is being deleted so changes are applied on client side automatically.  
 
After adding all contents of the post to the card, post liking functionality kicks in first of all I designed it in a such way that like amount identificator and like logo are on the same line and if like amount is equal to zero it isn't displaying at all. Then using click event listener on like logo with update like function post like is being updated, its response returns new amount and new status so with the use of that resources page reloading isn't required.

In the end every post is having its own comments section, which is populated with comments after clicking on it. To make that happen post id is being sent via fetch call. After getting post instance comments are being filtered based on that post, after recieving that response in JS, comments are appended to post at the bottom. also comment input is being displayed where user can type new comment and then save it. all this proccess runs without requirement of refreshing page. When comment is created its dropdown is being added where are located comment edit and remove links. only its author can use this functionality. also comment has like icon where users can leave their reactions.

create post function first gets all the data that is required to add new post entry to the database and then sends it using fetch call

For post liking defined update like function is being run. After successfull fetch like is added or removed in dependence of resulting if statement and all data that was being returend from response is used to update post state so there will be no requirment for page to refresh. 
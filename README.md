# CS50 Final Project - Meme app
- [CS50 Final Project - Meme app](#cs50-final-project---meme-app)
  - [Overview](#overview)
  - [Distinctiveness and Complexity](#distinctiveness-and-complexity)
  - [Settings](#settings)
  - [Root URLs](#root-urls)
  - [Models](#models)
  - [Routes](#routes)
    - [Index `/`](#index-)
    - [Load posts `/load_posts`](#load-posts-load_posts)
    - [Create post `/create_post`](#create-post-create_post)
    - [Edit post `/post/<int_post_id:>/edit`](#edit-post-postint_post_idedit)
    - [Remove post `/post/<int:post_id>/remove`](#remove-post-postintpost_idremove)
    - [Comment `/post/<int:comment_id>`](#comment-postintcomment_id)
    - [Update Comment Like `/comment/<int:comment_id>/update_like`](#update-comment-like-commentintcomment_idupdate_like)
    - [Update Post Like `/post/<int:post_id/update_like>`](#update-post-like-postintpost_idupdate_like)
    - [Comments `/post/<int:post_id>/comments`](#comments-postintpost_idcomments)
    - [Favorites `/load_posts/favorite`](#favorites-load_postsfavorite)
    - [Update Favorites `/post/<int:post_id>/update_favorites`](#update-favorites-postintpost_idupdate_favorites)
    - [Profile `/profile/<int:profile_id>`](#profile-profileintprofile_id)
    - [Login `/login`](#login-login)
    - [Logout `/logout`](#logout-logout)
    - [Register `/register`](#register-register)
  - [templates](#templates)
    - [Layout `/meme/templates/meme/layout.html`](#layout-memetemplatesmemelayouthtml)
    - [Index `/meme/templates/meme/index.html`](#index-memetemplatesmemeindexhtml)
    - [Login `/meme/templates/meme/login.html`](#login-memetemplatesmemeloginhtml)
    - [Register `/meme/templates/meme/register.html`](#register-memetemplatesmemeregisterhtml)
  - [Index.js `/meme/static/meme/index.js`](#indexjs-memestaticmemeindexjs)
    - [Create post](#create-post)
    - [Pagination](#pagination)
    - [Loading posts](#loading-posts)
    - [Building posts](#building-posts)
    - [Updating post](#updating-post)
    - [Updating post like](#updating-post-like)
    - [Post comments](#post-comments)
    - [Updating comment](#updating-comment)
    - [Comment likes](#comment-likes)
    - [Favorites](#favorites)
    - [Updating favorites](#updating-favorites)
    - [Profile](#profile)
  - [Files and directories](#files-and-directories)
  - [How to run the application](#how-to-run-the-application)
## Overview
I have built a meme uploading platform, where everyone can create meme posts and comments. The website has lots of different features, which is summarised below
[Routes](#routes))

The web application was built using Django, JavaScript, and Bootstrap.

[Back to Top](#cs50-final-project---meme-app)

## Distinctiveness and Complexity
According to the specification, my project must adhere to the following guidelines:
> Your web application must be sufficiently distinct from the other projects in this course (and, in addition, may not be based on the old CS50W Pizza project), and more complex than those.

I think my project meets these requirements for the following reasons:
1. the website is entirely feasible and functional with a designed `API`.
2. Implemented functionalities that other modern-day websites are having such as creating posts and modifying their state, leaving the comments with like reactions on them, and updating their status. Also having the ability to add the post into the individual "favorite" section`.
3. Also the key function of my app is image uploading & downloading.

> Your web application must utilize Django (including at least one model) on the back-end and JavaScript on the front-end.
 
My application was built using Django, including 4 models, and uses 1 JavaScript script to make dynamic updates. All generated information is saved in the default project generated sqlite3 database.

> Your web application must be mobile-responsive

Every page and feature of the web application is mobile-responsive and this is achieved using Bootstrap CSS.

As for Complexity, I tried to have `user experience` on the highest level this is manifested in the fact that in most actions, page reloading isn't required. But in some places like the `user favorite section` when a post is being removed, functionality is being chosen over comfort level. Also when a `post is created` page is reloaded to not make things more difficult.

[Back to Top](#cs50-final-project---meme-app)

## Settings
Besides the default configuration of the project, I added the included app name `meme` in `installed_apps`, `AUTH_USER_MODEL` (Django uses is it to authenticate a user), `MEDIA_URL` (Which is a way of accessing media files by their URL), and `MEDIA_ROOT` (To store all media files).

[Back to Top](#cs50-final-project---meme-app)

## Root URLs
I included the app URL in the project's default root. With the use of `re_path` and specified path, the `User` can download `Image`, following code on line 29 (extending URL patterns) gives an ability to access an actual image with its URL so then I can access them and then display it on the index page.

[Back to Top](#cs50-final-project---meme-app)
## Models
There are 4 models for the memes app database:
1. `User` - Stores and handles the creation of registered users.
2. `UserProfile` - Creates `OneToOne` relationship with `User`, has `timestamp` to identicate the creation date.
3. `Post` - Stores created posts, it has an `author` with `Foreign key` relationship linked to `UserProfile`, `ImageField` attribute, text-based `description`, `timestamp` with the modified format, `likes` attribute with `ManyToManyField` to `UserProfile` (many users can like many posts), and `favorites` attribute having `ManyToMany` relationship to users (many users can add many posts into their individual `"favorite"` section of a web page).
4. `Comment` - Stores created comments related to the `Post`, to make that happen `Foreign key` relationship comes in handy, of course, the comment is having an `author`, `timestamp` and text-based `comment` itself. I have also included the `likes` field, so the user will have the ability to leave a like on the comment.

The last two classes `Post` and `Comment` are having their own `serialize` functions.  

In the end, there is the usage of the `Django signal` which is being triggered after user registration. First, the profile is being created based on the user instance and then saved in the database. (As a result, when the user is registered, its profile is created automatically).

[Back to Top](#cs50-final-project---meme-app)
## Routes

### Index `/`
index function just returns index template

### Load posts `/load_posts`
load posts function returns a JSON response. By setting the safe parameter's value to True I am allowing non-dictionary objects to be serialized from the Post model class. Also, I'm using the Djangos Paginator class to split the queryset into page objects and then using JS to implement pagination functionality.

### Create post `/create_post`
create post function handles post creation logic. After checking the request method I'm getting all data that has been sent via JS FormData(). After processing it, the post is being saved and a success message is being returned.  

### Edit post `/post/<int_post_id:>/edit`
edit post function allows post author to update its contents, after getting all data that was submitted via JS FormData() old post values
are being replaced be with new ones. After updating the post, a new image URL is being returned so I can display updated content without requiring refreshing the page.

### Remove post `/post/<int:post_id>/remove`
remove post function simply removes the post. 

### Comment `/post/<int:comment_id>`  
comment function handles comment adding, editing and removing. If the intention was to create a comment it is being saved after getting all required data: comment content and post id (to set relationship between), after this process JSON response is being returned populated with the comment itself so it will be added automatically to the page. if comment edit is being called, after getting all required data comment content is getting replaced with a new one. Else if the desire was to remove the comment simply logic will execute comment removing after getting the required comment id.

### Update Comment Like `/comment/<int:comment_id>/update_like`
update comment like function updates specific comment like (adds it or removes after passing if statement) then it returns a JSON response with the new status and new amount
to modify existing comment details so refreshing the page and getting new data wouldn't be required.

### Update Post Like `/post/<int:post_id/update_like>`
update like function updates post like (adds it or removes it after running if-else conditions). Then it returns a JSON response just as an update comment like to modify existing post details dynamically.

### Comments `/post/<int:post_id>/comments`
comments function returns all the comments in relation to a specific post using serializer function by first getting post id and then using it to filter existing comments also I am returning the amount of it just for visualizing.

### Favorites `/load_posts/favorite`
The favorites function returns all favorite posts in relation to the requested user by serializing paginated page objects.

### Update Favorites `/post/<int:post_id>/update_favorites`
update favorites function updates requested user’s individual favorites section, by adding a post item to it or removing it, after passing some if-else statements. It also returns a new favorite variable so the user will know if the post is in their favorites or not.

### Profile `/profile/<int:profile_id>`
profile function returns a specific serialized profile in relation to what pk value of it was sent from client-side

### Login `/login`
login view handles user sign-in functionality. First, it is getting all required values to make that happen, username, and password that was been sent via the post request form. If a user with that inputted credentials exists in the database user is being authenticated and redirected to the index page. Else if there were sent invalid credentials, the message is being returned indicating that state. If the user just visits the login page template is being rendered.

### Logout `/logout`
logout view simply logs out the currently signed-in user and then redirects it to the index page.

### Register `/register`
register function handles user registration. First, it is getting all data that was being sent via the post request form: username, email, password, confirmation. Then it is making sure that password and confirmation values match (If not, the message is being returned informing that). Then it creates a user with gathered information and redirects it to the index page, after making sure that the user doesn't exist with the same credentials in the database (If so message is being returned to notify the user). If the intention was to just visit the registration page, the template is being returned.

[Back to Top](#cs50-final-project---meme-app)
## templates
### Layout `/meme/templates/meme/layout.html`
layout.html is the base HTML file that is being extended by all other markup files in Django block tags. There is being used bootstrap CSS and JS (jQuery, Popper.js) links to make the website more interactive and responsive. Besides that, there is included navigation bar to make things more comfortable to the user by allowing visiting any section quickly.

### Index `/meme/templates/meme/index.html`
index.html is extending layout file by its title, a body containing: new post div which has form responsible for making new posts, profile div which by default is not displaying and contains the profile information, posts div place where are posts displayed, and script linking to JS file. 

### Login `/meme/templates/meme/login.html`
login.html is extending the layout file by its title and body containing a header, sign-in form, and register link. 

### Register `/meme/templates/meme/register.html` 
register.html is extending the layout file by its title and body containing a header, register form, and sign-in link.

[Back to Top](#cs50-final-project---meme-app)
## Index.js `/meme/static/meme/index.js`
index.js is used to make happen all that functionality I have described upwards so full load goes on one file.

### Create post
create post function first gets all the data that is required to add a new post entry to the database and then sends it using fetch call

### Pagination
pagination function is responsible for changing the page we want to access, so if the user will click on the "previous" button previous page will be loaded and vice versa if the user clicks on the "next" button next page will be displayed. besides these two buttons the user can click on any page he wants if it is possible.

### Loading posts
everything starts after using DOMContentLoaded event listener, first I'm loading all posts which uses fetch call to the URL that returns JSON response of all objects from Post-class (by default first page of paginator is displayed), so then I can use JS for each command to build every post from its serialized values returned from the array. build post function itself takes a post as an input and then accesses its values using dot operator and key name specified after.

### Building posts
I used bootstrap cards for the container because it has responsive behavior. when a post image is created I'm setting its src attribute to post.image (in model serialize function post.image is equal to image URL so the image will display by its source). The drop-down menu helped me to have a simpler design. It stores four links which are responsible for post-editing and deleting (Those are feasible if request user matches with post author), image downloading (to make that happen I set its download and href attribute equal to post.image itself and also used re_path with download path in projects root urls.py), adding post into favorites.

### Updating post
After making sure that the post author matches with the requested user post can be edited or deleted. one uses the PUT request method and the second one DELETE. To update the post, a post id is required with a new description and a new image provided. I tried to populate a new image file field value with the existing image but I only could set it equal to an empty string.
After making changes post content is updated so page refreshing isn't required. delete post simply sends post id which is used to get that post instance which we want to delete, after that back end data manipulation on the front end postcard is being deleted so changes are applied on client-side automatically.

### Updating post like 
After adding all contents of the post to the card, post liking functionality kicks in. First of all, I designed it in a such way that like amount identificator and like logo are on the same line and if the like amount is equal to zero it isn't displaying at all. Then using click event listener on the like logo with an update like function post like is being updated, its response returns new amount and new status so with the use of that resources page reloading isn't required.

### Post comments
In the end, every post is having its own comments section, which is populated with comments after clicking on it. To make that happen post id is being sent via fetch call. After getting post instance comments are being filtered based on that post, after receiving that response in JS, comments are appended to post at the bottom. Also, comment input is being displayed where the user can type a new comment and then save it. all this process runs without the requirement of refreshing the page. When a comment is created its dropdown is being added where are located comment edit and remove links. only its author can use this functionality. Also, comment has like icon where users can leave their reactions.

### Updating comment
I also added a dropdown menu for comments. If the comment author matches with the requested user they will have the ability to click on the dropdown button and then edit or delete a comment by sending comment id into URL and committing actions which were defined in python function.

### Comment likes
For comment liking defined update comment like function is being run. After successful fetch like is added or removed in dependence of resulting if statement and all data that was being returned from the response is used to update comment-state so there will be no requirement for the page to refresh. if a comment likes amount is equal to zero it will not be displayed.

### Favorites
To make user access their favorite section where all favorite posts are stored first I’m checking if a user is signed in if not when he tries to create a new post is forced to log in.

### Updating favorites
To add a post item to the user favorites section, the update favorite function is being run. It fetches into specified URL and in dependence of result of an if statement, post is being added to favorites or removed from it. 

### Profile
The user profile is being shown when clicking on post author username (by default first page of paginator is displayed), this process is feasible by fetching into profile URL with specified profile id. When unhiding profile with including data from response new post form disappears. In contrast to all posts page profile page only shows posts related to the profile which is being displayed.

[Back to Top](#cs50-final-project---meme-app)

## Files and directories
Summary of created files:
- `meme` - main application directory.
  - `static/meme` contains all static content.
    - `/images/` place where all media files are being saved.
    - `heart-fill.svg` & `heart.svg` for better like icon styling purposes.
    - `styles.css` styles.css is used for only styling page body. Its declaration is directed to font-family and font-size properties whose values are "sans-serif" and "x-large".
    - `index.js` - single JavaScript file used in project [Index.js](#indexjs-memestaticmemeindexjs).
  - `templates/meme` contains all application templates.
    - `index.html` - template for [Index](#index-) (homepage) which displays all posts.
    - `layout.html` - base template. All other templates extend it.
    - `login.html` - template for [Login](#login-login) page.
    - `register.html` - template for [Login](#register-register) page.
  - `__init__.py` - generated by Django.
  - `admin.py` - used to determine models which will be used in the Django Admin Interface.
  - `apps.py` - generated by Django.
  - `models.py` defines the models used to add to and update the database using Django.
  - `tests.py` - generated by Django.
  - `urls.py` - defines all application URLs.
  - `views.py` - contains all application views.
- `project5` - project directory
  - `__init__.py`
  - `asgi.py` - generated by Django
  - `settings.py` - generated by Django, also contains logic for messages.
  - `urls.py` - contains project URLs.
  - `wsgi.py` - generated by Django.
- `db.sqlite3` - database.
- `manage.py` - generated by Django.
- `requirements.txt` - packages required for the application to run successfully.

[Back to Top](#cs50-final-project---meme-app)

## How to run the application
1. Clone the repository.
2. In your terminal `cd` into project5 directory.
3. Check the `requirements.txt` file to download the required Python packages.
4. run command `python manage.py runserver` in your terminal to start the development server.

[Back to Top](#cs50-final-project---meme-app)
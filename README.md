# CS50W-Project-5-Final

# Distinctiveness
TODO

# Complexity
As for Complexity, I tried to have user experience on the highest level, this is manifested in the fact that in most actions page reloading isn't required. But in some places like (user favorite section) when a post is being removed, functionality is being chosen over comfort level so the page is reloaded. Also when a post is created page is reloaded to not to make things more difficult. 

# models.py
In the models.py file, I have defined a User table, which handles the creation of registered users. There are also UserProfile, Post, and Comment classes, which have their own serialize functions. UserProfile has an OneToOneField relationship to User (only one user can link to only one profile). Post model stores created posts, it has an Author with OneToMany relationship linked to UserProfile, ImageField attribute, Text-based description, Timestamp with the modified format, Likes attribute with ManyToManyField to UserProfile (many users can like many posts), and favorites attribute having many to many relationship to users. (many users can add many posts into their individual "favorite" section of a web page).

Comment class is used to store created comments related to the post, to make that happen Foreign key relationship comes in handy, of course, the comment is having an Author, Timestamp and Text-based comment itself, I have also included Likes field, so the user will have the ability to leave a like on the comment.

In the end, there is the usage of the Django signal which is being triggered after user registration. First, I create a profile based on the user instance and then save it in the database. (As a result, when the user is registered, its profile is created automatically).

# settings.py
Besides the default configuration of the project, I added the app name in installed apps, AUTH_USER_MODEL (Django uses is it to authenticate a user), MEDIA_URL (Which is a way of accessing media files by their URL), and MEDIA_ROOT (To store all media files).

# root urls.py
I included app URLs in the project's root urls.py file in the default route. With the use of re_path and specified path, the User can download Image Files, following code on line 29 (extending URL patterns) gives an ability to access an actual image with its URL so then I can access them and then display it on the index page.

# views.py
index function just returns index template

load posts function returns a JSON response. By setting the safe parameter's value to True I am allowing non-dictionary objects to be serialized from the Post model class. Also, I'm using the Djangos Paginator class to split the queryset into page objects and then using JS to implement pagination functionality.

create post function handles post creation logic. After checking the request method I'm getting all data that has been sent via JS FormData(). After processing it, the post is being saved and a success message is being returned.  

edit post function allows post author to update its contents, after getting all data that was submitted via JS FormData() old post values
are being replaced be with new ones. After updating the post, a new image URL is being returned so I can display updated content without requiring refreshing the page.

remove post function simply removes the post. 

add comment function handles comment adding, editing, and removing. If the intention was to create a comment it is being saved after getting all required data: comment content and post id (to set relationship between), after this process JSON response is being returned populated with the comment itself so it will be added automatically to the page. if comment edit is being called, after getting all required data comment content is getting replaced with a new one. Else if the desire was to remove the comment simply logic will execute comment removing after getting the required comment id.

update comment like function updates specific comment like (adds it or removes after passing if statement) then it returns a JSON response with the new status and new amount
to modify existing comment details so refreshing the page and getting new data wouldn't be required.

update like function updates post like (adds it or removes it after running if-else conditions). Then it returns a JSON response just as an update comment like to modify existing post details dynamically.

comments function returns all the comments in relation to a specific post using serializer function by first getting post id and then using it to filter existing comments also I am returning the amount of it just for visualizing.

The favorites function returns all favorite posts in relation to the requested user by serializing paginated page objects.

update favorites function updates requested user’s individual favorites section, by adding a post item to it or removing it, after passing some if-else statements. It also returns a new favorite variable so the user will know if the post is in their favorites or not.

profile function returns a specific serialized profile in relation to what pk value of it was sent from client-side

login view handles user sign-in functionality. First, it is getting all required values to make that happen, username, and password that was been sent via the post request form. If a user with that inputted credentials exists in the database user is being authenticated and redirected to the index page. Else if there were sent invalid credentials, the message is being returned indicating that state. If the user just visits the login page template is being rendered.

logout view simply logs out the currently signed-in user and then redirects it to the index page.

register function handles user registration. First, it is getting all data that was being sent via the post request form: username, email, password, confirmation. Then it is making sure that password and confirmation values match (If not, the message is being returned informing that). Then it creates a user with gathered information and redirects it to the index page, after making sure that the user doesn't exist with the same credentials in the database (If so message is being returned to notify the user). If the intention was to just visit the registration page, the template is being returned.

# app urls.py
there are stored URL patterns for an application that are related to functionality like:
1. viewing: index, login, logout, register, profile, favorites pages. 
2. creating: posts, and comments.
3. updating: favorites section, comment, post, comment like, and post like.
4. deleting: post, comment, the item from favorites section.
5. accessing: comments related to specific posts. 

# templates
layout.html is the base HTML file that is being extended by all other markup files in Django block tags. There is being used bootstrap CSS and JS (jQuery, Popper.js) links to make the website more interactive and responsive. Besides that, there is included navigation bar to make things more comfortable to the user by allowing visiting any section quickly.

index.html is extending layout file by its title, a body containing: new post div which has form responsible for making new posts, profile div which by default is not displaying and contains the profile information, posts div place where are posts displayed, and script linking to JS file. 

login.html is extending the layout file by its title and body containing a header, sign-in form, and register link. 

register.html is extending the layout file by its title and body containing a header, register form, and sign-in link. 

# static
In the static folder, there is a subdirectory called "meme/images/", this is the place where are media files are being saved after successfully creating or updating a post.

Also, there are SVG files that I am using called "heart-fill.svg" and "heart.svg" for better like icon styling purposes.

styles.css is used for only styling page body. Its declaration is directed to font-family and font-size properties whose values are "sans-serif" and "x-large".

index.js is used to make happen all that functionality I have described upwards so full load goes on one file

everything starts after using DOMContentLoaded event listener, first I'm loading all posts which uses fetch call to the URL that returns JSON response of all objects from Post-class (by default first page of paginator is displayed), so then I can use JS for each command to build every post from its serialized values returned from the array. build post function itself takes a post as an input and then accesses its values using dot operator and key name specified after.

I used bootstrap cards for the container because it has responsive behavior. when a post image is created I'm setting its src attribute to post.image (in model serialize function post.image is equal to image URL so the image will display by its source). The drop-down menu helped me to have a simpler design. It stores four links which are responsible for post-editing and deleting (Those are feasible if request user matches with post author), image downloading (to make that happen I set its download and href attribute equal to post.image itself and also used re_path with download path in projects root urls.py), adding post into favorites.

To make user access their favorite section where all favorite posts are stored first I’m checking if a user is signed in if not when he tries to create a new post is forced to log in.

To add a post item to the user favorites section, the update favorite function is being run. It fetches into specified URL and in dependence of result of an if statement, post is being added to favorites or removed from it. 

After making sure that the post author matches with the requested user post can be edited or deleted. one uses the PUT request method and the second one DELETE. To update the post, a post id is required with a new description and a new image provided. I tried to populate a new image file field value with the existing image but I only could set it equal to an empty string.
After making changes post content is updated so page refreshing isn't required. delete post simply sends post id which is used to get that post instance which we want to delete, after that back end data manipulation on the front end postcard is being deleted so changes are applied on client-side automatically.

I also added a dropdown menu for comments. If the comment author matches with the requested user they will have the ability to click on the dropdown button and then edit or delete a comment by sending comment id into URL and committing actions which were defined in python function.
 
After adding all contents of the post to the card, post liking functionality kicks in. First of all, I designed it in a such way that like amount identificator and like logo are on the same line and if the like amount is equal to zero it isn't displaying at all. Then using click event listener on the like logo with an update like function post like is being updated, its response returns new amount and new status so with the use of that resources page reloading isn't required.

In the end, every post is having its own comments section, which is populated with comments after clicking on it. To make that happen post id is being sent via fetch call. After getting post instance comments are being filtered based on that post, after receiving that response in JS, comments are appended to post at the bottom. Also, comment input is being displayed where the user can type a new comment and then save it. all this process runs without the requirement of refreshing the page. When a comment is created its dropdown is being added where are located comment edit and remove links. only its author can use this functionality. Also, comment has like icon where users can leave their reactions.

create post function first gets all the data that is required to add a new post entry to the database and then sends it using fetch call

For post liking defined update like function is being run. After successful fetch like is added or removed in dependence of resulting if statement and all data that was being returned from the response is used to update post-state so there will be no requirement for the page to refresh. if a post likes amount is equal to zero it will not be displayed

The user profile is being shown when clicking on post author username, this process is feasible by fetching into profile URL with specified profile id. When unhiding profile with including data from response new post form disappears. In contrast to all posts page profile page only shows posts related to the profile which is being displayed.

pagination function is responsible for changing the page we want to access, so if the user will click on the "previous" button previous page will be loaded and vice versa if the user clicks on the "next" button next page will be displayed. besides these two buttons the user can click on any page he wants if it is possible.
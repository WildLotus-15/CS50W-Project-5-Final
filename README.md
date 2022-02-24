# CS50W-Project-5-Final

# Distinctiveness

# Complexity

# Models
In the models.py file (the place where are stored Python class based database tables) I have defined User table, which handles creation of registered users, UserProfile, Post and Comment classes, they have their own serialize function, with the use of that concept like RESTFULapi kicks in, developers use that to design API's and creat fetch calls using JS. UserProfile has OneToOneField to User (only one user can link to only one profile). Post model stores created posts, it has Author with OneToMany relationship linked to UserProfile, ImageField atribute, Text based description, Timestamp with modified format, Likes atribute with ManyToManyField to UserProfile (many user can like many posts), and favourites having many to many relationship.(many user can add many posts into their individual "favourite" section of a web page).

Comment class is used to store specific comments related to the post, to make that happen Foreign key relationship comes in handy, of course comment will have Author, own Timestamp and Text based comment itself, I have also included Likes field, so user will have the ability to leave a like reaction on comment.

Last but not least I have defined Django signal in the end (It is like triggerer which runs when some state of event happens, in this example I am listening to the creation of an user so I can create its profile automatically.) first of all I am creating an user profile and then saving it in the database.

# Settings
Besides of the default configuration of the project I have added MEDIA_URL variable (To access media files by their url) and MEDIA_ROOT (To store all media files)

# Root urls.py
In the root urls.py I have extended the urlpatterns with the use of re_path and specified path User can download Image Files, following code on line 29 gives an ability to access an actual image with the use of url so then I can display it on the index page


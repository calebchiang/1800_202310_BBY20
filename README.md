# Project Title

## 1. Project Description
State your app in a nutshell, or one-sentence pitch. Give some elaboration on what the core features are.  
This browser based web application to ...
* We are aiming to build an app that allows users to post hazards that they come accross on sidewalks to let fellow pedestrians know about them before they embark on their commute or journey.
## 2. Names of Contributors
List team members and/or short bio's here... 
* Hi my name is Josh and sidewalks are essential to people everywhere and I am excited to implement this idea with my team to help improve everyones experience when commuting or using sidewalks in any way.  
* Hi my name is Sarah. I'm excited about this project because I can experience working in a team.
* HI my name is Caleb. I am excited to improve my programming skills.
	
## 3. Technologies and Resources Used
List technologies (with version numbers), API's, icons, fonts, images, media or data sources, and other resources that were used.
* HTML, CSS, JavaScript
* Bootstrap 5.0 (Frontend library)
* Firebase 8.0 (BAAS - Backend as a Service)
* Google maps API

## 4. Complete setup/installion/usage
State what a user needs to do when they come to your project.  How do others start using your code or application?
Here are the steps ...
* 1. This project contains a user authentication service from firebase which requires an api activation which is not included. For this to work properly you must add your own.
* 2. This project also uses google maps api. While there is a key at the bottom of the map.html, it is restricted to certain websites. For it to function properly you will have to add a personal key.
* 3. Once those are in place, you can run this project using a live serving program, like visual studio code or similar

## 5. Known Bugs and Limitations
Here are some known bugs:
* No known bugs currently. Please inform us if any arise.
* ...
* ...

## 6. Features for Future
What we'd like to build in the future:
* 1. Comments or similar section where users can update or comment on posts that are not their own. Maybe a user is unaware of a certain hazard being resolved that they posted earlier so another user can 'comment' and possibly prompt the posts owner to delete it.
* 2. Currently the posts page sorts by recency. We wanted to sort it by a range around a users' location or specified 'home' address so that the posts are more relevent to them.
* ...
	
## 7. Contents of Folder
Content of the project folder:

```
 Top level of project folder: 
├── .firebaserc                 # Firebase default project config
├── .gitignore                  # Git ignore file
├── 404.html                    # Page when any page cannot be accessed
├── bookmarks.html              # html file displaying all saved bookmarks for a signed in user
├── firebase.json               # Firebase settings config
├── firestore.indexes.json      # Firestore database indexes
├── firestore.rules             # Firestore security rules
├── index.html                  # Landing page when accessed by URL
├── login.html                  # html file that allows users to login or sign up
├── map.html                    # Map page displaying hazard markers
├── package-lock.json           # Ensures consistent dependency installation in Node.js
├── package.json                # Node.js dependency config
├── posts-before-login.html     # Posts page before a user is logged in
├── posts.html                  # Posts page viewing of hazards  
├── profile.html                # User profile page, allows deletion of own posts
├── storage.rules               # Security rules for Google Cloud Storage buckets
├── template.html               # Template HTML page file
├── upload.html                 # Hazard upload page
└── README.md

It has the following subfolders and files:
├── .git                        # Folder for git repo

├── .firebase                   # Folder for Firebase CLI project-specific configuration and data
    /hosting..cache             # Used by Firebase Hosting to cache content and optimize performance

├── images                      # Folder for images
    /favicon.ico                # Favicon.io
    /logo.webp                  # Side Guide logo
    /pedestrian.png             # flaticon.com
    /profile-user.png           # flaticon.com

├── scripts                     # Folder for scripts
    /authentication.js          # Login authentication using firebase
    /bookmark.js                # Updates firestore when a user bookmarks a post
    /map.js                     # Generates the map and adds hazard markers   
    /posts-before-login.js      # Loads posts from firestore before login
    /posts.js                   # Loads posts from firestore
    /skeleton.js                # Loads the navbar and footer for each page
    /upload.js                  # Allows users to upload posts

├── styles                      # Folder for styles
    /bootstrap.css              # Bootstrap CSS Library
    /colorpallette.css          # Side Guide colour palette
    /index.css                  # Styles for index page
    /map.css                    # Styles for map page
    /posts.css                  # Styles for posts page
    /style.css                  # Global styles
    /upload.css                 # Style for upload page

├── text                        # Folder for page skeletons
    /footer.html                # Footer HTML structure
    /navbar-after-login.html    # Navbar HTML structure after login
    /navbar-before-login.html   # Navbar HTML structure before login


```

## Hotel ##

* Add Landing Page
* Add Hotels Page and list all Hotels

## Each Hotel has ##

* Name
* Image

## Layout and Basic Styling ##
* Create header and footer partials
* Add in Bootstrap

## Creating New Hotel ##
* Setup new hotel POST route
* Add in body-parser
* Setup Route to show form
* Add basic unstyled form

## Style the hotels Page ##
* Add a header/title
* Make hotels display in a grid

## Style Navbar and Form ##
* Add a Navbar to all the templates
* Style the new hotels form

## Add Mongoose ##
* Install mongoose
* Setup Hotel Model
* Use campground model inside of routes

## Show Page ##
* Add description to our campground model
* add show route/template 

## Rafactor Mongoose Code ##
* Create a models directory
* Use module.exports
* Require every thing in app.js correctly

## Add Seeds File and the comments model ##
* Add seeds.js file
* Run the seeds file every time the server starts
* Make our error go away, by adding comment.js
* Referencing data between hotel and comment model
* display comments on show page

## Comment Create/New ##
* Nest Routes
* Add comment new and create route
* Add new fomment form

## Style SHOW Page ##
* Use Bootstrap Grid System
* Add sidebar using above
* Display Comments nicely
  
## Add User Model ##
* Install all packages that we need for Local Auth
* Define User Model

## Auth - Register ##
* Configure Passport
* Add register routes
* Add register template

## Auth - Login ##
* Add Login Routes
* Add Login template

## Logout logic and Navbar improvement ##
* Add logout route
* Prevent user to post comment without being logged in
* Add links to navbar
* Show/hide auth links correctly in navbar

## Refactor the routes ##
* Use express router and dry up app.js code

## Users + Comments ##
* Associate users and comments model
* Save creator's name to comment automatically

## Users + Hotels ##
* Prevent an unauthenticated user from creating a hotel
* Save username+id to newly created hotel

## Editing Hotels ##
* Add method-override
* Add edit route(s) for hotel
* Add the link to page (render them)
* Add update route

## DELETE HOTELS ##
* Add delete route
* Add delte button

## Authorization - Hotel ##
* User can only edit his/her hotel ONLY
* User can delete his/her hotel ONLY
* Hide/Show EDIT and DELETE buttons to all other users.
  
## Authorization - Comments ##
* User can edit only his/her comments
* User can delete only his/her comments
* Hide/Show edit and delete button for all other users

## Adding Flash Messages ##
* Install and configure connect-flash
* Add bootstrap alerts to header
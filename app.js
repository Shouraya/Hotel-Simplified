require('dotenv').config();
const express = require ("express"),
      app = express(),
      bodyParser = require("body-parser"), //To get data from form
      mongoose = require("mongoose"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      Hotel = require("./models/hotel"),
      Comment = require("./models/comment"),
      User = require("./models/user"),
      seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/hotel_app", {
    useNewUrlParser: true,   //these are written to remove deprecations warning
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true    
});
//SCHEMA REQUIRING :
// var 
//SEED File
// var  ;


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));  //PUBLIC --> static files (css)
// console.log(__dirname);
seedDB();

// HTTP Logging
const morgan = require('morgan');
app.use(morgan('[:date[web]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms'));
//HTTP Logging Code END

///PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Landing Route
app.get("/", (req, res) => {
    res.render("landing");
});

//Display all Hotels that we have (INDEX ROUTE)
app.get("/hotels", function(req, res){
    // get all hotels from db
    Hotel.find({}, function(err, allHotels){
        if(err){
            console.log(err);
        } else {
            res.render("hotels/index", {hotels:allHotels});
        }
    })
});

//Create New Hotel Post (CREATE Route)
app.post("/hotels", function(req, res){
    //get data from form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    //add to hotels db
    var newHotel = {name:name, image:image, description:desc}
    // Create a new hotel and save it to db
    Hotel.create(newHotel, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect to hotels page (get)
        res.redirect("/hotels");
        }
    });
});

//Display form (NEW Route)
app.get("/hotels/new", function(req, res){
    res.render("hotels/new");
});

//Display Information about a particular Hotel (SHOW Route)
app.get("/hotels/:id", function(req, res){
    //find the campground with the given ID
    Hotel.findById(req.params.id).populate("comments").exec(function(err, foundHotel){
        if(err) {
            console.log(err);
        } else {
            console.log(foundHotel);
            //render SHOW template
            res.render("hotels/show", {hotel:foundHotel});
        }
    });
});

// ================
// COMMENTS ROUTES
// ================

app.get("/hotels/:id/comments/new", function(req, res){
    // find campground by id
    Hotel.findById(req.params.id, function(err, hotel){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {hotel: hotel});
        }
    })
});

app.post("/hotels/:id/comments", function(req, res){
   //lookup campground using ID
   Hotel.findById(req.params.id, function(err, hotel){
       if(err){
           console.log(err);
           res.redirect("/hotels");
       } else {
            //create new comment
            Comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
            } else {
                //connect new comment to campground
                hotel.comments.push(comment);
                hotel.save();
                //redirect campground show page
                res.redirect('/hotels/' + hotel._id);
            }
            });
         }
   });
});

// =================
//    AUTH ROUTES
// =================
app.get("/register",function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            console.log(err);
            return res.render("register");
        } 
        passport.authenticate("local")(req, res, function(){
            res.redirect("/hotels")
        })
    });
});

//Server 
var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("Hotel App server has started !");
});
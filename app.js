const express = require ("express");
const app = express();
const bodyParser = require("body-parser"); //To get data from form
const mongoose = require("mongoose");

//SCHEMA REQUIRING :
var Hotel = require("./models/hotel");
var Comment = require("./models/comment");
//SEED File
var seedDB = require("./seeds") ;
seedDB();

mongoose.connect("mongodb://localhost/hotel_app", {
	useNewUrlParser: true,   //these are written to remove deprecations warning
    useUnifiedTopology: true,
    useFindAndModify: false,
	useCreateIndex: true    
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// HTTP Logging
const morgan = require('morgan');
app.use(morgan('[:date[web]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms'));
//HTTP Logging Code END

app.use(express.static("public"));  //PUBLIC --> static files (css)

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


//Server 
var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("Hotel App server has started !");
});
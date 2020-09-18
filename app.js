const express = require ("express");
const app = express();
const bodyParser = require("body-parser"); //To get data from form
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/hotel_app", {
	useNewUrlParser: true,   //these two written two remove deprecations
    useUnifiedTopology: true,
    useFindAndModify: false
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//SCHEMA Setup
var hotelSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Hotel = mongoose.model("Hotel", hotelSchema);
// Hotel.create({
//     name: "Granite Hill", 
//     image: "https://images.unsplash.com/photo-1600199712217-812672421f0e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=60",
//     description: "This is a huge hotel, but no swimming pool !!"
// },function(err,hotel){
//     if(err){
//         console.log(err);
//     } else {
//         console.log("Newly Created Hotel");
//         console.log(hotel);
//     }
// });

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
            res.render("index", {hotels:allHotels});
        }
    })
});

//Create New Hotel Post (CREATE Route)
app.post("/hotels", function(req, res){
    //get data from form
    var name = req.body.name
    var image = req.body.image
    //add to hotels arra
    var newHotel = {name:name, image:image}
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
    res.render("new");
});

//Display Information about a particular Hotel (SHOW Route)
app.get("/hotels/:id", function(req, res){
    //find the campground with the given ID
    Hotel.findById(req.params.id, function(err, foundHotel){
        if(err) {
            console.log(err);
        } else {
            //render SHOW template
            res.render("show", {hotel:foundHotel});
        }
    });
});

// HTTP Logging
const morgan = require('morgan');
app.use(morgan('[:date[web]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms'));
//HTTP Logging Code END

//Server 
var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("Hotel App server has started !");
});
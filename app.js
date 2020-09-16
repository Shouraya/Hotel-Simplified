const express = require ("express");
const app = express();
const bodyParser = require("body-parser"); //To get data from form

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use(express.static("public"));  //PUBLIC --> static files (css)
// HTTP Logging
const morgan = require('morgan');
app.use(morgan('[:date[web]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms'));
//HTTP Logging Code END

var hotels = [
    {name: "Salmon Creek", image: "https://images.unsplash.com/photo-1600189020840-e9918c25269d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=60"},
    {name: "Granite Hill", image: "https://images.unsplash.com/photo-1600199712217-812672421f0e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=60"},
    {name: "Mountain Goat", image: "https://images.unsplash.com/photo-1600223922079-314143a47b89?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=60"}
]

//Landing Route
app.get("/", (req, res) => {
    res.render("landing");
});

//Display all Hotels that we have
app.get("/hotels", function(req, res){
    res.render("hotels", {hotels:hotels});
});

//Create New Hotel Post
app.post("/hotels", function(req, res){
    //get data from form
    var name = req.body.name
    var image = req.body.image
    //add to hotels arra
    var newHotel = {name:name, image:image}
    hotels.push(newHotel);
    //redirect to hotels page (get)
    res.redirect("/hotels");
});

//Display form
app.get("/hotels/new", function(req, res){
    res.render("new");
});

//Server 
var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("Hotel App server has started !");
});
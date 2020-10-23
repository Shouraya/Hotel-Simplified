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

// IMPORTING ROUTERS
const commentRoutes = require("./routes/comments"),
      hotelRoutes = require("./routes/hotels"),
      indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/hotel_app", {
    useNewUrlParser: true,   //these are written to remove deprecations warning
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true    
});

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

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use(indexRoutes);
app.use("/hotels", hotelRoutes);
app.use("/hotels/:id/comments", commentRoutes);


//Server 
var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("Hotel App server has started !");
});
require('dotenv').config({path: ".env"});
const express = require ("express"),
      app = express(),
      bodyParser = require("body-parser"), //To get data from form
      mongoose = require("mongoose"),
      flash = require("connect-flash"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      methodOverride = require("method-override"),
      Hotel = require("./models/hotel"),
      Comment = require("./models/comment"),
      User = require("./models/user"),
      seedDB = require("./seeds"),
      expressSanitizer = require("express-sanitizer");

// IMPORTING ROUTES
const reviewRoutes     = require("./routes/review"),
      commentRoutes = require("./routes/comments"),      
      hotelRoutes = require("./routes/hotels"),
      indexRoutes = require("./routes/index");
mongoose.connect(process.env.DATABASEURL, {
    useNewUrlParser: true,   //these are written to remove deprecations warning
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true    
});

app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); 
app.use(methodOverride("_method"));
app.use(flash());
app.use(expressSanitizer());

// seedDB();    //seed the database
 
// HTTP Logging
const morgan = require('morgan');
app.use(morgan('[:date[web]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms'));
//HTTP Logging Code END
// MOMENT CODE FOR TIME
app.locals.moment = require('moment');
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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/hotels", hotelRoutes);
app.use("/hotels/:id/comments", commentRoutes);
app.use("/hotels/:id/reviews", reviewRoutes);

app.get("*", function(req, res){
    res.render('error');
});

//Server 
var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("Hotel App server has started !");
});
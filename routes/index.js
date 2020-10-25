const express = require("express"),
      router = express.Router(),
      passport = require("passport"),
      User = require("../models/user");

//Landing Route
router.get("/", (req, res) => {
    res.render("landing");
});

// =================
//    AUTH ROUTES
// =================

// SHOW register form
router.get("/register",function(req, res){
    res.render("register");
});

//Handles Sign Up Logic
router.post("/register", function(req, res){
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

//SHOW LOGIN FORM 
router.get("/login", function(req, res){
    res.render("login", {message: req.flash("error")});
});

//Handle Login Logic
router.post("/login", passport.authenticate("local", {
        successRedirect: "/hotels",
        failureRedirect: "/login"
    }), function(req, res){  
});

// Logout
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/hotels");
});

//Middleware
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
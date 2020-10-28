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
    res.render("register", {page: 'register'});
});

//Handles Sign Up Logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    // eval(require('locus')); //stop the code for a few seconds and look at it
    if(req.body.adminCode === process.env.SECRETCODE) {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            // req.flash("error", err.message);
            return res.render("register", {"error": err.message});
        } 
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Hotel Simplified " + user.username);
            res.redirect("/hotels");
        })
    });
});

//SHOW LOGIN FORM 
router.get("/login", function(req, res){
    res.render("login", {page: 'login'});
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
    req.flash("success", "Logged You Out !");
    res.redirect("/hotels");
});

module.exports = router;
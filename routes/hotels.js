const express = require("express"),
      router = express.Router(),
      Hotel = require("../models/hotel"),
      middleware = require("../middleware/index");

//Display all Hotels that we have (INDEX ROUTE)
router.get("/", function(req, res){
    // get all hotels from db
    Hotel.find({}, function(err, allHotels){
        if(err){
            console.log(err);
        } else {
            res.render("hotels/index", {hotels:allHotels, page: 'campgrounds'});
                //req.user //contain username and id of currently logged in user
        }
    })
});

//Create New Hotel Post (CREATE Route)
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    //add to hotels db
    var newHotel = {name:name, image:image, description:desc, author:author, price:price}
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
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("hotels/new");
});

//Display Information about a particular Hotel (SHOW Route)
router.get("/:id", function(req, res){
    //find the campground with the given ID
    Hotel.findById(req.params.id).populate("comments").exec(function(err, foundHotel){
        if(err || !foundHotel) {
            req.flash("error", "Hotel not found");
            res.redirect("back");
        } else {
            console.log(foundHotel);
            //render SHOW template
            res.render("hotels/show", {hotel:foundHotel});
        }
    });
});

//Edit Hotel Route
router.get("/:id/edit", middleware.checkHotelOwnership, function(req, res){
    Hotel.findById(req.params.id, function(err, foundHotel){
         res.render("hotels/edit", {hotel:foundHotel});
        }); 
});

//Update Campground Route
router.put("/:id", middleware.checkHotelOwnership, function(req, res){
    //find and update the correct hotel
    Hotel.findByIdAndUpdate(req.params.id, req.body.hotel, function(err, updatedHotel){
        if(err){
            res.redirect("/hotels");
        } else {
            res.redirect("/hotels/" + req.params.id);
        }
    });
});

// DESTROY/DELETE HOTEL ROUTE
router.delete("/:id", middleware.checkHotelOwnership, function(req, res){
    Hotel.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect("/hotels");
        } else {
            res.redirect("/hotels");
        }
    });
}); 


module.exports = router;
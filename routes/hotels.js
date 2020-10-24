const hotel = require("../models/hotel");

const express = require("express"),
      router = express.Router(),
      Hotel = require("../models/hotel");

//Display all Hotels that we have (INDEX ROUTE)
router.get("/", function(req, res){
    // get all hotels from db
    Hotel.find({}, function(err, allHotels){
        if(err){
            console.log(err);
        } else {
            res.render("hotels/index", {hotels:allHotels});
                //req.user //contain username and id of currently logged in user
        }
    })
});

//Create New Hotel Post (CREATE Route)
router.post("/", isLoggedIn, function(req, res){
    //get data from form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    //add to hotels db
    var newHotel = {name:name, image:image, description:desc, author:author}
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
router.get("/new", isLoggedIn, function(req, res){
    res.render("hotels/new");
});

//Display Information about a particular Hotel (SHOW Route)
router.get("/:id", function(req, res){
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

//Edit Hotel Route
router.get("/:id/edit", checkHotelOwnership, function(req, res){
    Hotel.findById(req.params.id, function(err, foundHotel){
         res.render("hotels/edit", {hotel:foundHotel});
        }); 
});

//Update Campground Route
router.put("/:id", checkHotelOwnership, function(req, res){
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
router.delete("/:id", checkHotelOwnership, function(req, res){
    Hotel.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect("/hotels");
        } else {
            res.redirect("/hotels");
        }
    });
}); 

//MIDDLEWARE
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkHotelOwnership(req, res, next){
    if(req.isAuthenticated()){
        Hotel.findById(req.params.id, function(err, foundHotel){
            if(err){
                res.redirect("back");
            } else {
                //does user own hotel?
                if(foundHotel.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        }); 
    } else {
       res.redirect("back"); //redirect back to from the place user has come from
    }
}

module.exports = router;
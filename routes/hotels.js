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
router.post("/", function(req, res){
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
router.get("/new", function(req, res){
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

module.exports = router;
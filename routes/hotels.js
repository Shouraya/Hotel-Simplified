const express = require("express"),
      router = express.Router(),
      Hotel = require("../models/hotel"),
      Comment = require("../models/comment"),
      Review = require("../models/review"),
      middleware = require("../middleware/index"),
      mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding"),
      mapBoxToken = process.env.MAPBOX_TOKEN,
      geocoder = mbxGeocoding({accessToken: mapBoxToken});

//Display all Hotels that we have (INDEX ROUTE)
router.get("/", function(req, res){
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Hotel.find({name: regex}, function(err, allHotels){
            if(err){
                console.log(err);
            } else {
                res.render("hotels/index", {hotels:allHotels, page: 'hotels'});
            }
        });
    } else {
        // get all hotels from db
        Hotel.find({}, function(err, allHotels){
            if(err){
                console.log(err);
            } else {
                res.render("hotels/index", {hotels:allHotels, page: 'hotels'});
                    //req.user //contain username and id of currently logged in user
            }
        });
    }
});

//Create New Hotel Post (CREATE Route)
router.post("/", middleware.isLoggedIn, function(req, res){
    var geoData = geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send();
    geoData.then(function(data) {
        var geometry = data.body.features[0].geometry;
        // EDITING
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
        var newHotel = {name:name, image:image, description:desc, author:author, price:price, geometry:geometry};
        // Create a new hotel and save it to db
        Hotel.create(newHotel, function(err, newlyCreated){
            if(err){
                console.log(err);
            } else {
                //redirect to hotels page (get)
            res.redirect("/hotels");
            }
        });
        // EDITING ENDS
    });
});

//Display form (NEW Route)
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("hotels/new");
});

//Display Information about a particular Hotel (SHOW Route)
router.get("/:id", function(req, res){
    //find the Hotel with the given ID
    Hotel.findById(req.params.id).populate("comments").populate({
        path: "reviews",
        options: {sort: {createdAt: -1}}
    }).exec(function(err, foundHotel){
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

//Update Hotel Route
router.put("/:id", middleware.checkHotelOwnership, function(req, res){
    delete req.body.hotel.rating;
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
router.delete("/:id", middleware.checkHotelOwnership, function (req, res) {
    Hotel.findById(req.params.id, function (err, hotel) {
        if (err) {
            res.redirect("/hotels");
        } else {
            // deletes all comments associated with the hotel
            Comment.deleteMany({"_id": {$in: hotel.comments}}, function (err) {
                if (err) {
                    console.log(err);
                    return res.redirect("/hotels");
                }
                // deletes all reviews associated with the hotel
                Review.deleteMany({"_id": {$in: hotel.reviews}}, function (err) {
                    if (err) {
                        console.log(err);
                        return res.redirect("/hotels");
                    }
                    //  delete the hotel
                    hotel.remove();
                    req.flash("success", "Hotel deleted successfully!");
                    res.redirect("/hotels");
                });
            });
        }
    });
});
// router.delete("/:id", middleware.checkHotelOwnership, function(req, res){
//     Hotel.findByIdAndRemove(req.params.id, function(err){
//         if(err) {
//             res.redirect("/hotels");
//         } else {
//             res.redirect("/hotels");
//         }
//     });
// }); 

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
module.exports = router;
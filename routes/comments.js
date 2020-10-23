const express = require("express"),
      router = express.Router({mergeParams:true}),
      Hotel = require("../models/hotel"),
      Comment = require("../models/comment");

//COMMENTS - new
router.get("/new", isLoggedIn, function(req, res){
    // find campground by id
    Hotel.findById(req.params.id, function(err, hotel){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {hotel: hotel});
        }
    })
});

//COMMENTS - create
router.post("/", isLoggedIn, function(req, res){
   //lookup campground using ID
   Hotel.findById(req.params.id, function(err, hotel){
       if(err){
           console.log(err);
           res.redirect("/hotels");
       } else {
            //create new comment
            Comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
            } else {
                //add username and id to comments
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                //save comment
                comment.save();
                //connect new comment to campground
                hotel.comments.push(comment);
                hotel.save();
                //redirect campground show page
                res.redirect('/hotels/' + hotel._id);
            }
            });
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

module.exports = router;
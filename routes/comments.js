const express = require("express"),
      router = express.Router({mergeParams:true}),
      Hotel = require("../models/hotel"),
      Comment = require("../models/comment"),
      middleware = require("../middleware/index");

//COMMENTS - new
router.get("/new", middleware.isLoggedIn, function(req, res){
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
router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup campground using ID
   Hotel.findById(req.params.id, function(err, hotel){
       if(err){
           console.log(err);
           res.redirect("/hotels");
       } else {
            //create new comment
            Comment.create(req.body.comment, function(err, comment){
            if(err){
                req.flash("error", "Something went wrong");
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
                req.flash("success", "Successfully added comment");
                //redirect campground show page
                res.redirect('/hotels/' + hotel._id);
            }
            });
         }
   });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Hotel.findById(req.params.id, function(err, foundHotel) {
        if(err || !foundHotel) {
            req.flash("error", "No Hotel found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
              res.render("comments/edit", {hotel_id: req.params.id, comment: foundComment});
            }
         });
    });

 });
 
 // COMMENT UPDATE
 router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/hotels/" + req.params.id );
       }
    });
 });
 
 // COMMENT DESTROY ROUTE
 router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
     //findByIdAndRemove
     Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted");
            res.redirect("/hotels/" + req.params.id);
        }
     });
 });
 
module.exports = router;
// all the middleware comes here
const Hotel = require("../models/hotel");
const Comment = require("../models/comment");
const Review = require("../models/review");
const middlewareObj = {};
middlewareObj.checkHotelOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Hotel.findById(req.params.id, function(err, foundHotel){
            if(err || !foundHotel){
                req.flash("error", "Hotel not found");
                res.redirect("back");
            } else {
                //does user own hotel?
                if(foundHotel.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        }); 
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back"); //redirect back to from the place user has come from
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err || !foundComment){
                req.flash("error", "Comment not Found");
                res.redirect("back");
            } else {
                //does the user own the comment ?
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

// REVIEW
middlewareObj.checkReviewExistence = function (req, res, next) {
    if (req.isAuthenticated()) {
        Hotel.findById(req.params.id).populate("reviews").exec(function (err, foundHotel) {
            if (err || !foundHotel) {
                req.flash("error", "Hotel not found.");
                res.redirect("back");
            } else {
                // check if req.user._id exists in foundHotel.reviews
                var foundUserReview = foundHotel.reviews.some(function (review) {
                    return review.author.id.equals(req.user._id);
                });
                if (foundUserReview) {
                    req.flash("error", "You already wrote a review.");
                    return res.redirect("/hotels/" + foundHotel._id);
                }
                // if the review was not found, go to the next middleware
                next();
            }
        });
    } else {
        req.flash("error", "You need to login first.");
        res.redirect("back");
    }
};

module.exports = middlewareObj;
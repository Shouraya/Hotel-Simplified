// all the middleware comes here
const Hotel = require("../models/hotel");
const Comment = require("../models/comment");
const middlewareObj = {};
middlewareObj.checkHotelOwnership = function(req, res, next){
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

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err){
                res.redirect("back");
            } else {
                //does the user own the comment ?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First !");
    res.redirect("/login");
}

module.exports = middlewareObj;
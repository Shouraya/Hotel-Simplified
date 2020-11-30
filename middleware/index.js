// all the middleware comes here
const Hotel = require("../models/hotel");
const Comment = require("../models/comment");
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

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    if(req['headers']['content-type'] === 'application/json') {
        return res.send({ error: 'Login required' });
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

middlewareObj.isPaid = function(req, res, next){
    if (req.user.isPaid) return next();
    req.flash("error", "Please pay registration fee before continuing");
    res.redirect("/checkout");
}

module.exports = middlewareObj;
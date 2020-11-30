var express = require("express"),
    router = express.Router({mergeParams: true}),
    Hotel = require("../models/hotel"),
    Review = require("../models/review"),
    middleware = require("../middleware");

// Reviews Index
router.get("/", function (req, res) {
    Hotel.findById(req.params.id).populate({
        path: "reviews",
        options: {sort: {createdAt: -1}} // sorting the populated reviews array to show the latest first
    }).exec(function (err, hotel) {
        if (err || !hotel) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviews/index", {hotel: hotel});
    });
});

// Reviews New
router.get("/new", middleware.isLoggedIn, middleware.checkReviewExistence, function (req, res) {
    // middleware.checkReviewExistence checks if a user already reviewed the hotel, only one review per user is allowed
    Hotel.findById(req.params.id, function (err, hotel) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviews/new", {hotel: hotel});

    });
});

// Reviews Create
router.post("/", middleware.isLoggedIn, middleware.checkReviewExistence, function (req, res) {
    //lookup hotel using ID
    Hotel.findById(req.params.id).populate("reviews").exec(function (err, hotel) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Review.create(req.body.review, function (err, review) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            //add author username/id and associated hotel to the review
            review.author.id = req.user._id;
            review.author.username = req.user.username;
            review.hotel = hotel;
            //save review
            review.save();
            hotel.reviews.push(review);
            // calculate the new average review for the hotel
            hotel.rating = calculateAverage(hotel.reviews);
            //save hotel
            hotel.save();
            req.flash("success", "Your review has been successfully added.");
            res.redirect('/hotels/' + hotel._id);
        });
    });
});

// Reviews Edit
router.get("/:review_id/edit", function (req, res) {
    Review.findById(req.params.review_id, function (err, foundReview) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviews/edit", {hotel_id: req.params.id, review: foundReview});
    });
});

// Reviews Update
router.put("/:review_id", function (req, res) {
    Review.findByIdAndUpdate(req.params.review_id, req.body.review, {new: true}, function (err, updatedReview) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Hotel.findById(req.params.id).populate("reviews").exec(function (err, hotel) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            // recalculate hotel average
            hotel.rating = calculateAverage(hotel.reviews);
            //save changes
            hotel.save();
            req.flash("success", "Your review was successfully edited.");
            res.redirect('/hotels/' + hotel._id);
        });
    });
});

// Reviews Delete
router.delete("/:review_id", function (req, res) {
    Review.findByIdAndRemove(req.params.review_id, function (err) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Hotel.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.review_id}}, {new: true}).populate("reviews").exec(function (err, hotel) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            // recalculate hotel average
            hotel.rating = calculateAverage(hotel.reviews);
            //save changes
            hotel.save();
            req.flash("success", "Your review was deleted successfully.");
            res.redirect("/hotels/" + req.params.id);
        });
    });
});

function calculateAverage(reviews) {
    if (reviews.length === 0) {
        return 0;
    }
    var sum = 0;
    reviews.forEach(function (element) {
        sum += element.rating;
    });
    return sum / reviews.length;
}

module.exports = router;
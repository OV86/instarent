var Car = require("../models/car");
var Comment = require("../models/comment");

// all the middleware goes here

var middlewareObj = {};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    // check if user is logged in
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err) {
                res.redirect("back");
            } else {
                // check if user own the campground comment
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Permission denied!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

middlewareObj.checkCarOwnership = function(req, res, next) {
    // check if user is logged in
    if(req.isAuthenticated()) {
        Car.findById(req.params.id, function(err, car) {
            if(err) {
                res.redirect("back");
            } else {
                // check if user own the campground
                if(car.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Permission denied!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please login first!");
    res.redirect("/login");
};

module.exports = middlewareObj;
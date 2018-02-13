var express = require("express");
var router = express.Router({mergeParams: true});
var Comment = require("../models/comment");
var Car = require("../models/car");
var middleware = require("../middleware");

router.get("/cars/:id/comments/new", middleware.isLoggedIn, function(req, res) {
    // find car by id
    Car.findById(req.params.id, function(err, car) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {car: car});
        }
    });
});

router.post("/cars/:id/comments", middleware.isLoggedIn, function(req, res) {
    // lookup car by id
    console.log(req.body);

    Car.findById(req.params.id, function(err, car) {
        if(err) {
            console.log(err);
        } else {
            // create comment
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                    res.redirect("/cars");
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    // connect new comment to campground
                    car.comments.push(comment);
                    car.save();
                    // redirect to campground show page
                    // req.flash("success", "Comment added.");
                    res.redirect("/cars/" + req.params.id);
                }
            }
        )};
    });
});

// get edit page route
router.get("/cars/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            console.log("error");
        } else {
            res.render("comments/edit", {car_id: req.params.id, comment: foundComment});
        }
    });
});

// update route
router.put("/cars/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment) {
        if(err) {
            console.log("error");
        } else {
            res.redirect("/cars/" + req.params.id);
        }
    });
});

// destroy route
router.delete("/cars/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err, success) {
        if(err) {
            res.redirect("back");
        } else {
            console.log("Success");
            // req.flash("success", "Comment deleted.");
            res.redirect("/cars/" + req.params.id);
        }
    });
});

module.exports = router;
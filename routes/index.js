var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

// routes setup
router.get("/", function(req, res) {
    res.render("landing");
});

// auth routes
router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Thank you for registering " + user.username + "!");
            res.redirect("/");
        });
    });
});

// login and logout routes
router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/",
        failureRedirect: "/login"
    }), function(req, res) {
});

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You are now logged out!");
    res.redirect("/");
});


module.exports = router;
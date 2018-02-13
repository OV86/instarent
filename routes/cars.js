var express = require("express");
var router = express.Router();
var Car = require("../models/car");
var middleware = require("../middleware");

// route to display car search page
router.get("/cars", middleware.isLoggedIn, function(req, res) {

    res.render("cars/search");
    
    // Car.find({}, function(err, cars) {
    //     if(err) {
    //         console.log("There was an error");
    //         console.log(err);
    //     } else {
    //         console.log("Success.");
    //         res.render("cars/index", {cars: cars});
    //     }
    // });

});

// create new car listing route
router.post("/cars", middleware.isLoggedIn, function(req, res) {
    var carMake = req.body.carMake,
    carModel = req.body.carModel,
    carYear = req.body.carYear,
    carPrice = req.body.carPrice,
    carImage = req.body.carImage,
    carDescription = req.body.carDesc,
    author = {
        id: req.user._id,
        username: req.user.username
    },
    // create object for a new car to pass to the create function
    newCar = {
        make: carMake,
        model: carModel,
        year: carYear,
        price: carPrice,
        image: carImage,
        description: carDescription,
        author: author
    };

    // pass new car object to the create function
    Car.create(newCar, function(err, car) {
        if(err) {
            console.log(err);
        } else {
            // console.log("New car created.");
            res.redirect("/");
        }
    });
});

// route for searching cars
router.get("/cars/search", function(req, res) {
    // console.log(req.query);

    // save the query parameters for easy access
    var dateFrom = req.query.dateFrom;
    var dateTo = req.query.dateTo;

    Car.find({
        booked: {
 
            //Check if any of the dates the car has been reserved for overlap with the requsted dates
            $not: {
                $elemMatch: {from: {$lt: dateTo.substring(0,10)}, to: {$gt: dateFrom.substring(0,10)}}
            }
 
        }
    }, function(err, cars){
        if(err){
            res.send(err);
        } else {
            res.render("cars/searchResults", 
            {
                cars: cars,
                dateFrom: dateFrom,
                dateTo: dateTo
            }); 
        }
    });
});

// route for booking cars
router.post("/cars/:id/book/", function(req, res) {
    
    Car.findByIdAndUpdate(req.params.id, {
        $push: {"booked": {from: req.body.dateFrom, to: req.body.dateTo}}
    }, {
        safe: true,
        new: true
    }, function(err, car){
        if(err){
            res.send(err);
        } else {
            res.redirect("/booked");
        }
    });
});

router.get("/booked", function(req, res) {
    res.render("cars/booked");
});

// render create new car view
router.get("/cars/new", middleware.isLoggedIn, function(req, res) {
    res.render("cars/new");
});

// get specific car by car id
router.get("/cars/:id", function(req, res) {
    console.log(req.query);

    Car.findById(req.params.id).populate("comments").exec(function(err, car) {
        if(err) {
            console.log("There was an error.");
            console.log(err);
        } else {
            res.render("cars/show", 
            {
                car: car,
                dateFrom: req.query.dateFrom,
                dateTo: req.query.dateTo
            });
        }
    });
});

// edit car route
router.get("/cars/:id/edit", middleware.checkCarOwnership, function(req, res) {
    Car.findById(req.params.id, function(err, car) {
        res.render("cars/edit", {car: car});
    });
});

// update car route
router.put("/cars/:id", middleware.checkCarOwnership, function(req, res) {

    Car.findByIdAndUpdate(req.params.id, req.body.car, function(err, success) {
        if(err) {
            console.log(err);
        } else {
            console.log("Success");
            res.redirect("/cars/" + req.params.id);
        }
    });
});

// delete a car route
router.delete("/cars/:id", middleware.checkCarOwnership, function(req, res) {
    
    Car.findByIdAndRemove(req.params.id, function(err, success) {
        if(err) {
            console.log(err);
        } else {
            console.log("Success");
            res.redirect("/cars/");
        }
    });
});

module.exports = router;
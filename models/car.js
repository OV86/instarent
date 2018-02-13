var mongoose = require("mongoose");

var carSchema = new mongoose.Schema({
	make: String,
	model: String,
	year: String,
	price: String,
	image: String,
	description: String,
	comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    booked: [
        {
            from: String,
            to: String
        }
    ]
});

module.exports = mongoose.model("Car", carSchema);


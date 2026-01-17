const newLocal = require('mongoose');
var mongoose = newLocal;


module.exports.connect = function () {
	mongoose.connect('mongodb://' + process.env.MONGODB_URI + '/rails');
	var db = mongoose.connection;
	db.on("error", console.error.bind(console, "connection error"));
	db.once("open", function (callback) {
		console.log("Connection Succeeded");
        console.log("RLDS 3.0.8");
		return db;
	})
}

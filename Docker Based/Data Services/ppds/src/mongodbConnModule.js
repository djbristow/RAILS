const newLocal = require('mongoose');
var mongoose = newLocal;

const options = {
	useNewUrlParser: true,
	useUnifiedTopology:true
  }

module.exports.connect = function () {
	console.log('mongodb://' + process.env.MONGODB_URI + '/rails');
	mongoose.connect('mongodb://' + process.env.MONGODB_URI + '/rails', options);
	var db = mongoose.connection;
	db.on("error", console.error.bind(console, "connection error"));
	db.once("open", function (callback) {
		console.log("Connection Succeeded");
        console.log("PPDS v2.3.9");
		return db;
	})
}

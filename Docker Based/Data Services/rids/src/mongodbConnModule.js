const newLocal = require('mongoose');
var mongoose = newLocal;

const options = {
	useNewUrlParser: true,
    useUnifiedTopology: true
  }

module.exports.connect = function () {
	mongoose.connect('mongodb://' + process.env.MONGODB_URI + '/rails', options);
	var db = mongoose.connection;
	db.on("error", console.error.bind(console, "connection error"));
	db.once("open", function (callback) {
		console.log("Connection Succeeded");
        console.log("RIDS v2.1.18");
		return db;
	})
}

const newLocal = require('mongoose');
var mongoose = newLocal;

const options = {
	useNewUrlParser: true
  }

module.exports.connect = function () {
	mongoose.connect('mongodb://' + '127.0.0.1' + ':' + process.env.MONGODB_PORT_27017_TCP_PORT + '/rails', options);
	var db = mongoose.connection;
	db.on("error", console.error.bind(console, "connection error"));
	db.once("open", function (callback) {
		console.log("Connection Succeeded");
		return db;
	})
}

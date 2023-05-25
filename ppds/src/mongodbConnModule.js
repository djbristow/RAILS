const newLocal = require('mongoose');
var mongoose = newLocal;

const options = {
	useNewUrlParser: true,
	useUnifiedTopology:true
  }

module.exports.connect = function () {
	mongoose.connect('mongodb://' + process.env.MONGODB_PORT_27017_TCP_ADDR + ':' + process.env.MONGODB_PORT_27017_TCP_PORT + '/rails', options);
	var db = mongoose.connection;
	db.on("error", console.error.bind(console, "connection error"));
	db.once("open", function (callback) {
		console.log("Connection Succeeded");
        console.log("PPDS v2.1.3");
		return db;
	})
}

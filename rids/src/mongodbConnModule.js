var mongoose = require('mongoose');

const options = {
  useNewUrlParser: true
}

module.exports.connect = function() {
	mongoose.connect('mongodb://localhost:27017/rails', options);
	var db = mongoose.connection;
	db.on("error", console.error.bind(console, "connection error"));
	db.once("open", function(callback){
	  console.log("Connection Succeeded");
	});
	return db;
}


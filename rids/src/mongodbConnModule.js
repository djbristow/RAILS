var mongoose = require('mongoose');

const options = {
  useNewUrlParser: true
}

module.exports.connect = function() {
	mongoose.connect('mongodb://' + process.env.MONGODB_PORT_27017_TCP_ADDR + ':' + process.env.MONGODB_PORT_27017_TCP_PORT + '/rails', options);
	var db = mongoose.connection;
	db.on("error", console.error.bind(console, "connection error"));
	db.once("open", function(callback){
	  console.log("Connection Succeeded");
	});
	return db;
}


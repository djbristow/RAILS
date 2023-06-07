var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MicroSchema = new Schema({
  microID: {
    type: String,
    required: true,
    minlength: 2,
    trim: true
  },
  microIP: {
    type: String,
    required: true
  },
  et: {
    type: String
  },
  purpose: {
    type: String
  },
  status: {
    type: String
  },
  sensorLoc: {
    type: String
  },
  });

  module.exports = mongoose.model('Micros', MicroSchema);

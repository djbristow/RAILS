
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AarSchema = new Schema({
  aarCode: {
    type: String,
    required: true,
    minlength: 2,
    trim: true
  },
  rollingstockType: {
    type: String
  },
  description: {
    type: String
  }
});

module.exports = mongoose.model('AarCode', AarSchema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TurnoutSchema = new Schema({
  toID: {
    type: String,
    required: true,
    minlength: 2,
    trim: true
  },
  controller: {
    type: String,
    required: true
  },
  direction: {
    type: String,
    required: true
  },
  type: {
    type: String
  },
  notes: {
    type: String
  }
  });

  module.exports = mongoose.model('Turnout', TurnoutSchema);

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TurnoutSchema = new Schema({
  toID: {
    type: String,
    required: true,
    trim: true
  },
  toNum: {
    type: String,
    required: true
  },
  controller: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  type: {
    type: String
  },
  lock: {
    type: String
  },
  notes: {
    type: String
  },
  lastUpdate: {
    type: String
  }
  });

  module.exports = mongoose.model('Turnout', TurnoutSchema);

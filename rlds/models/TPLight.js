var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Turnout = require('./Turnout');
var TPLightSchema = new Schema({
  to_id: {
    type: Schema.Types.ObjectId,
    ref: Turnout,
    required: true
  },
  tplNum: {
    type: String,
    required: true
  },
  controller: {
    type: String,
    required: true
  },   
  panelName: {
    type: String,
    required: true
  },
  panelNum: {
    type: String,
    required: true
  }
  });

  module.exports = mongoose.model('TPLight', TPLightSchema);

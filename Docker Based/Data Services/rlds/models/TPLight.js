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
    required: true,
    Unqiue: true
  },
  controller: {
    type: String,
    required: true
  },   
  panelName: {
    type: String
  },
  panelNum: {
    type: String
  }
  });

  module.exports = mongoose.model('TPLight', TPLightSchema);

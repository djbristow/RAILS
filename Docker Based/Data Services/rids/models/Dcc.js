var mongoose = require('mongoose');
const Rollingstock = require('./Rollingstock');
var Schema = mongoose.Schema;

var DccSchema = new Schema({
    locomotiveID: {
        type: Schema.Types.ObjectId,
        ref: Rollingstock,
        required: true
    },
    mfg: {
        type: String
    },
    family: {
        type: String
    },
    model: {
        type: String
    },
    address: {
        type: String,
        unique : true,
        dropDups: true
    }
});

module.exports = mongoose.model('Dcc', DccSchema);

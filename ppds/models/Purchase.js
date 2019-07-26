var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Purchase = new Schema({
    store: {
        type: String,
        required: true,
        trim: true
    },
    item: {
        type: String,
        trim: true
    },
    desciption: {
        type: String,
        required: true,
        trim: true
    },
    manufacturer: {
        type: String,
        trim: true
    },
    unitcost: {
        type: Number,
        required: true,
    },
    qty: {
        type: Number,
        required: true
    },
    project: {
        type: String
    },
    notes: {
        type: String
    }
});

module.exports = mongoose.model('Purchase', Purchase);

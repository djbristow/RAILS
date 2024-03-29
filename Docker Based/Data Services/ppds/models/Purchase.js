// The Purchase model represent an item purchased from a store
// where a single unit price is captured
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Purchase = new Schema({
    num: {
        type: Number,
        unqiue: true
    },
    date: {
        type: Date,
        required: true
    },
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
    roadname: {
        type: String,
        trim: true
    },
    roadnumbers: {
        type: String
    },
    notes: {
        type: String
    }
});

module.exports = mongoose.model('Purchase', Purchase);

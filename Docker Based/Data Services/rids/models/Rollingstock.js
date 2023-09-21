var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RollingstockSchema = new Schema({
    roadName: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    roadNumber: {
        type: String,
        required: true,
        trim: true
    },
    color: {
        type: String
    },
    aarCode: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    description: {
        type: String
    },
    numberBlt: {
        type: String
    },
    inSvcDate: {
        type: Date
    },
    insideLength: {
        type: String
    },
    insideHeight: {
        type: String
    },
    insideWidth: {
        type: String
    },
    loadTypes: {
        type: String
    },
    capacity: {
        type: String
    },
    bldr: {
        type: String
    },
    bltDate: {
        type: Date
    },
    notes: {
        type: String
    },
    ltWeight: {
        type: String
    },
    loadLimit: {
        type: String
    },
    lastMaintDate: {
        type: Date
    },
    locationNow: {
        type: String
    },
    homeLocation: {
        type: String
    },
    // operational elements
    rsStatus: {
        type: String
    },
    issue: {
        type: String
    },
    duration: {
        type: Number
    },
    severity: {
        type: String
    },
    // model elements
    imageID: {
        type: String
    },
    modelWeight: {
        type: String
    },
    modelLength: {
        type: String
    },
    rfid: {
        type: String
    }
});

module.exports = mongoose.model('Rollingstock', RollingstockSchema);

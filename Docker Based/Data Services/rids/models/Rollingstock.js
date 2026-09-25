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
        type: Number
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
        type: Number
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
        type: Number
    },
    loadLimit: {
        type: Number
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
        type: Number
    },
    modelLength: {
        type: Number
    },
    rfid: {
        type: String
    },
    rfidLocation: {
        type: Number
    },
    numAxles: {
        type: Number
    }
});

module.exports = mongoose.model('Rollingstock', RollingstockSchema);

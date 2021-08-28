// The Project model represents th elements capture about a 
// single project
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    startdate: {
        type: Date,
        required: true
    },
    enddate: {
        type: Date
    },
    roadname: {
        type: String,
        trim: true
    },
    roadnumbers: {
        type: String
    },
    notes: {
        type: String,
        trim: true
    }
});

module.exports = mongoose.model('Project', ProjectSchema);

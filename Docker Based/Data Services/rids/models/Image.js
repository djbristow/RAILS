var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImageSchema = new Schema({
    fileName: {
        type: String,
        required: true,
        trim: true,
        unique : true,
        dropDups: true
    },
    title: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        trim: true
    }
});

module.exports = mongoose.model('Image', ImageSchema);

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IndustrySchema = new Schema({
    shortName: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    longName: {
        type: String,
        trim: true
    },
    industryType: {
        type: String,
        required: true,
        trim: true
    },
    industryLocation: {
        type: String,
        trim: true
    }
});

module.exports = mongoose.model('Industry', IndustrySchema);

// The Company model capture details about both the retailer 
// or store where items are purchased and the manufacturer of
// model components
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompanySchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    street: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        trim: true
    },
    zip: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    }
});

module.exports = mongoose.model('Company', CompanySchema);


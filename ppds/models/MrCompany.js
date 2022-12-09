// The Company model capture details about both the retailer 
// or store where items are purchased and the manufacturer of
// model components
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MrCompanySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
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
    email: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    }
});

module.exports = mongoose.model('MrCompany', MrCompanySchema);


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IstructureSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    structureUse: {
        required: true,
        type: String
    },
    description: {
        type: String
    },
    owner: {
        type: String
    },
    location: {
        type: String
    },
    construction: {
        type: String
    },
    builtDate: {
        type: String
    },
    size: {
        type: String
    },
    image: {
        type: String
    },
    type: {
        type: String
    },
    rawMaterials: {
        type: String
    },
    rMCapacity: {
        type: String
    },
    conRate: {
        type: String
    },
    priority: {
        type: String
    },
    aarCodeIn: {
        type: String
    },
    product: {
        type: String
    },
    productCap: {
        type: String
    },
    prodRate: {
        type: String
    },
    aarCodeOut: {
        type: String
    },
    unloadDuration: {
        type: String
    },
    loadDuration: {
        type: String
    },
    sidingCap: {
        type: String
    },
    notes: {
        type: String
    }
});

module.exports = mongoose.model('Istructure', IstructureSchema);
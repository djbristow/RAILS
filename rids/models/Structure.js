var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StructureSchema = new Schema({
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
    }
});

module.exports = mongoose.model('Structure', StructureSchema);
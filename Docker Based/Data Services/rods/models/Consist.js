const mongoose = require('mongoose');

// Sub-schema for individual cars within a consist
const ConsistCarSchema = new mongoose.Schema({
  rollingStockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RollingStock', // References your existing rolling stock collection
    required: true
  },
  facing: {
    type: String,
    enum: ['A', 'B'], // Ensures direction is explicitly 'A' or 'B'
    required: true,
    default: 'A'
  }
}, { _id: false }); // Disable automatic _id for sub-documents to keep it light

// Main Consist Schema
const ConsistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  trainNumber: {
    type: String,
    trim: true
  },
  notes: String,
  // The ordered list of cars - array index determines sequence
  cars: [ConsistCarSchema]
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

const Consist = mongoose.model('Consist', ConsistSchema);
module.exports = Consist;

const mongoose = require('mongoose');

// Define the discount schema
const taxSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    percentage: Number,
    description: String,
});

// Create a model using the schema
const Tax = mongoose.model('Tax', taxSchema);

module.exports = Tax;
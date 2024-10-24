const mongoose = require('mongoose');

// Define the customization schema
const customizationSchema = new mongoose.Schema({
    invoice_prefix: String,
    invoice_separator: String,
    estimate_prefix: String,
    estimate_separator: String,
    items_per_page: Number,
});

// Create a model using the schema
const Customization = mongoose.model('Customization', customizationSchema);

module.exports = Customization;
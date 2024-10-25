const mongoose = require('mongoose');

// Define the shipping_company schema
const shippingCompanySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: String,
});

// Create a model using the schema
const ShippingCompany = mongoose.model('ShippingCompany', shippingCompanySchema);

module.exports = ShippingCompany;
const mongoose = require('mongoose');

// Define the discount schema
const discountSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    code: String,
    amount: {
        total: {
            type: Number,
            default: 0,
        },
        percentage: {
            type: Number,
            default: 0,
        },
    },
    description: String,
});

// Create a model using the schema
const Discount = mongoose.model('Discount', discountSchema);

module.exports = Discount;
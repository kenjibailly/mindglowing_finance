const mongoose = require('mongoose');

// Define the payment method schema
const paymentMethodSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: String,
});

// Create a model using the schema
const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);

module.exports = PaymentMethod;
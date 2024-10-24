const mongoose = require('mongoose');

// Define the invoice schema
const invoiceSchema = new mongoose.Schema({
    number: { type: Number, required: true, unique: true },
    customer_id: String,
    status: String,
    products: [{
        id: String,
        quantity: Number,
    }],
    discounts: [{
        id: String,
        total: Number,
        percentage: Number,
    }],
    tax: {
        id: String,
        total: Number,
        percentage: Number,
    },
    shipping: {
        id: String,
        amount: Number,
    },
    created_on: {
        type: Date,
        default: Date.now,
    },
    paid: [{
        paid_on: {
            type: Date,
            default: Date.now,
        },
        paid_amount: Number,
        payment_method_id: String,
        paid: Boolean,
    }],
    amount_total: Number,
    amount_due: Number,
    description: String,
    project_billed: {
        id: String,
        name: String,
        description: String,
        timeTracking: [{
            name: String,
            time: Number,
            start: Date,
            stop: Date,
            timePassed: String,
        }],
        total_time: String,
        hour_rate: Number,
    },
    due_date: Date,
});

// Create a model using the schema
const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
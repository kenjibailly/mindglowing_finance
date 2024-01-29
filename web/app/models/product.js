const mongoose = require('mongoose');

// Define the products schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    price: Number,
    description: String,
    picture: String,
});

// Create a model using the schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
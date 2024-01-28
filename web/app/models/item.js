const mongoose = require('mongoose');

// Define the items schema
const itemSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    price: Number,
    description: String,
    picture: String,
});

// Create a model using the schema
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
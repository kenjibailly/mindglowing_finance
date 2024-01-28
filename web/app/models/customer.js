const mongoose = require('mongoose');

// Define the customer schema
const customerSchema = new mongoose.Schema({
  personal_information: {
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true,
        required: true,
    },
    company: String,
    currency_name: String,
    currency_symbol: String,
  },
  shipping_details: {
    street: String,
    street2: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  billing_details: {
    street: String,
    street2: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  contact_information: {
    preferred_contact_medium: {
      type: String,
      enum: ['Email', 'Discord', 'Telegram', 'Instagram', 'Twitter', 'Other'],
    },
    contact_medium_username: String,
    other_option_response: String,
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
});

// Create a model using the schema
const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
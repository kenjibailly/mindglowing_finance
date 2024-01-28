const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  setup: { type: Boolean, required: true, default: false },
  date_format: String,
  time_zone: String,
  currency_name: String,
  currency_symbol: String,
  picture: String,
  personal_information: {
    first_name: String,
    last_name: String,
    email: String,
    company_name: String,
  },
  address_information: {
    street: String,
    street2: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
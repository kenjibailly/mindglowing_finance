import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the Customer document
interface ICustomer extends Document {
  personal_information: {
    first_name: string;
    last_name: string;
    email: string;
    company?: string;
    currency_name?: string;
    currency_symbol?: string;
  };
  billing_details?: {
    street?: string;
    street2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  shipping_details?: {
    street?: string;
    street2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  contact_information?: {
    preferred_contact_medium?:
      | "Email"
      | "Discord"
      | "Telegram"
      | "Instagram"
      | "Twitter"
      | "Other";
    contact_medium_username?: string;
    other_option_response?: string;
  };
  created_on: Date;
}

// Define the customer schema
const customerSchema: Schema = new mongoose.Schema({
  personal_information: {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    company: { type: String },
    currency_name: { type: String },
    currency_symbol: { type: String },
  },
  billing_details: {
    street: { type: String },
    street2: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String },
  },
  shipping_details: {
    street: { type: String },
    street2: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String },
  },
  contact_information: {
    preferred_contact_medium: {
      type: String,
      enum: ["Email", "Discord", "Telegram", "Instagram", "Twitter", "Other"],
    },
    contact_medium_username: { type: String },
    other_option_response: { type: String },
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
});

// Create a model using the schema
const Customer = mongoose.model<ICustomer>("Customer", customerSchema);

export default Customer;

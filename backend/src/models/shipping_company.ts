import mongoose, { Document, Schema } from "mongoose";

interface IShippingCompany extends Document {
  name: string;
  description: string;
}

// Define the shipping_company schema
const shippingCompanySchema: Schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
});

// Create a model using the schema
const ShippingCompany = mongoose.model<IShippingCompany>(
  "ShippingCompany",
  shippingCompanySchema
);

export default ShippingCompany;

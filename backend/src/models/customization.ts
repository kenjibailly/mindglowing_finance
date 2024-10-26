import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the Customization document
interface ICustomization extends Document {
  invoice_prefix?: string;
  invoice_separator?: string;
  estimate_prefix?: string;
  estimate_separator?: string;
  items_per_page?: number;
}

// Define the customization schema
const customizationSchema: Schema = new mongoose.Schema({
  invoice_prefix: { type: String },
  invoice_separator: { type: String },
  estimate_prefix: { type: String },
  estimate_separator: { type: String },
  items_per_page: { type: Number },
});

// Create a model using the schema
const Customization = mongoose.model<ICustomization>(
  "Customization",
  customizationSchema
);

export default Customization;

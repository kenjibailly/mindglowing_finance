import mongoose, { Document, Schema } from "mongoose";

interface ITax extends Document {
  name: string;
  percentage: number;
  default: boolean;
  description: string;
}

// Define the discount schema
const taxSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  percentage: Number,
  default: { type: Boolean, required: true },
  description: String,
});

// Create a partial index to enforce unique 'true' values for 'default'
taxSchema.index(
  { default: 1 },
  { unique: true, partialFilterExpression: { default: true } }
);

// Create a model using the schema
const Tax = mongoose.model<ITax>("Tax", taxSchema);

export default Tax;

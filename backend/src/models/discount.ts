import mongoose, { Document, Schema } from "mongoose";

interface IDiscount extends Document {
  name: string;
  code?: string;
  amount: {
    total?: number;
    percentage?: number;
  };
  description?: string;
}

// Define the discount schema
const discountSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: String,
  amount: {
    total: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
  },
  description: String,
});

// Create a model using the schema
const Discount = mongoose.model<IDiscount>("Discount", discountSchema);

export default Discount;

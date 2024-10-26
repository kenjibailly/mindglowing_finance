import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the Product document
interface IProduct extends Document {
  name: string;
  price?: number;
  description?: string;
  picture?: string;
}

// Define the product schema
const productSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number },
  description: { type: String },
  picture: { type: String },
});

// Create a model using the schema
const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;

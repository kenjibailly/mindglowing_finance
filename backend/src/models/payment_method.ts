import mongoose, { Document, Schema } from "mongoose";

interface IPaymentMethod extends Document {
  name: string;
  description: string;
}

// Define the payment method schema
const paymentMethodSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
});

// Create a model using the schema
const PaymentMethod = mongoose.model<IPaymentMethod>(
  "PaymentMethod",
  paymentMethodSchema
);

export default PaymentMethod;

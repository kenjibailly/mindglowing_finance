import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the Invoice document
interface IInvoice extends Document {
  number: number;
  customer_id: string;
  status: string;
  products: {
    id: string;
    quantity: number;
  }[];
  discounts: {
    id: string;
    total: number;
    percentage: number;
  }[];
  tax: {
    id: string;
    total: number;
    percentage: number;
  };
  shipping: {
    id: string;
    amount: number;
  };
  created_on: Date;
  paid: {
    paid_on: Date;
    paid_amount: number;
    payment_method_id: string;
    paid: boolean;
  }[];
  amount_total: number;
  amount_due: number;
  description?: string;
  project_billed?: {
    id: string;
    name: string;
    description?: string;
    timeTracking: {
      name: string;
      time: number;
      start: Date;
      stop: Date;
      timePassed: string;
    }[];
    total_time: string;
    hour_rate: number;
  };
  due_date?: Date;
}

// Define the invoice schema
const invoiceSchema: Schema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true },
  customer_id: { type: String, required: true },
  status: { type: String, required: true },
  products: [
    {
      id: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  discounts: [
    {
      id: { type: String, required: true },
      total: { type: Number, required: true },
      percentage: { type: Number, required: true },
    },
  ],
  tax: {
    id: { type: String, required: true },
    total: { type: Number, required: true },
    percentage: { type: Number, required: true },
  },
  shipping: {
    id: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
  paid: [
    {
      paid_on: { type: Date, default: Date.now },
      paid_amount: { type: Number, required: true },
      payment_method_id: { type: String, required: true },
      paid: { type: Boolean, required: true },
    },
  ],
  amount_total: { type: Number, required: true },
  amount_due: { type: Number, required: true },
  description: { type: String },
  project_billed: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    timeTracking: [
      {
        name: { type: String, required: true },
        time: { type: Number, required: true },
        start: { type: Date, required: true },
        stop: { type: Date, required: true },
        timePassed: { type: String, required: true },
      },
    ],
    total_time: { type: String, required: true },
    hour_rate: { type: Number, required: true },
  },
  due_date: { type: Date },
});

// Create a model using the schema
const Invoice = mongoose.model<IInvoice>("Invoice", invoiceSchema);

export default Invoice;

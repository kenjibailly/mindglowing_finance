import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the time tracking entries
interface ITimeTracking {
  name: string;
  time: number;
  start: Date;
  stop: Date;
}

// Define an interface for the Project document
interface IProject extends Document {
  name: string;
  customer_id?: string;
  description?: string;
  billed?: boolean;
  created_on?: Date;
}

// Define the project schema
const projectSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  customer_id: { type: String },
  description: { type: String },
  billed: { type: Boolean, default: false },
  created_on: { type: Date, default: Date.now },
});

// Create a model using the schema
const Project = mongoose.model<IProject>("Project", projectSchema);

export default Project;

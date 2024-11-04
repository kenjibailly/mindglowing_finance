import mongoose, { Schema } from "mongoose";

// Define an interface for the time tracking entries
interface ITimeTracking {
  project_id: string;
  name: string;
  time: number;
  start: Date;
  stop: Date;
}

// Define the project schema
const timeTrackingsSchema: Schema = new mongoose.Schema({
  project_id: { type: String, required: true },
  name: { type: String, required: true },
  time: { type: Number },
  start: { type: Date },
  stop: { type: Date },
});

// Create a unique compound index on project_id and name
timeTrackingsSchema.index({ project_id: 1, name: 1 }, { unique: true });

// Create a model using the schema
const TimeTracking = mongoose.model<ITimeTracking>(
  "TimeTracking",
  timeTrackingsSchema
);

export default TimeTracking;

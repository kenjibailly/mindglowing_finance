import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the user document
interface PersonalInformation {
  first_name?: string;
  last_name?: string;
  email?: string;
  company_name?: string;
}

interface AddressInformation {
  street?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface UserDocument extends Document {
  username: string;
  password: string;
  setup: boolean;
  date_format?: string;
  time_zone?: string;
  currency_name?: string;
  currency_symbol?: string;
  picture?: string;
  personal_information?: PersonalInformation;
  address_information?: AddressInformation;
}

// Define the user schema
const userSchema: Schema<UserDocument> = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  setup: { type: Boolean, required: true, default: false },
  date_format: { type: String, default: undefined },
  time_zone: { type: String, default: undefined },
  currency_name: { type: String, default: undefined },
  currency_symbol: { type: String, default: undefined },
  picture: { type: String, default: undefined },
  personal_information: {
    first_name: { type: String, default: undefined },
    last_name: { type: String, default: undefined },
    email: { type: String, default: undefined },
    company_name: { type: String, default: undefined },
  },
  address_information: {
    street: { type: String, default: undefined },
    street2: { type: String, default: undefined },
    city: { type: String, default: undefined },
    state: { type: String, default: undefined },
    zip: { type: String, default: undefined },
    country: { type: String, default: undefined },
  },
});

// Create the User model
const User = mongoose.model<UserDocument>("User", userSchema);

// Export the User model
export default User;

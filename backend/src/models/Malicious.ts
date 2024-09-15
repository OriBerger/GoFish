import mongoose, { Document, Schema } from "mongoose";

// Define the interface for the contact info
interface IMalicious extends Document {
  _id: mongoose.Types.ObjectId;
  sourceEmail: string;
  sourcePhone: string;
  message: string;
  maliciousLink: string;
}

// Create the Mongoose schema for contact info
const maliciousSchema: Schema<IMalicious> = new Schema({
  sourceEmail: { type: String, required: false },
  sourcePhone: { type: String, required: false },
  message: { type: String, required: false },
  maliciousLink: { type: String, required: false },
});

// Create the Mongoose model
const MaliciousModel = mongoose.model<IMalicious>("Malicious", maliciousSchema);

export default MaliciousModel;

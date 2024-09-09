import mongoose, { Document, Schema } from "mongoose";

// Define the interface for the contact info
interface IContact extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
}

// Create the Mongoose schema for contact info
const contactSchema: Schema<IContact> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: false },
  phone: { type: String, required: false },
  department: { type: String, required: false },
  role: {type: String, required: false},
});

// Create the Mongoose model
const ContactModel = mongoose.model<IContact>("Contact", contactSchema);

export default ContactModel;

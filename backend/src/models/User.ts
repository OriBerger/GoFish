import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

import { Document } from "mongoose";

// Define an interface for the User model
export interface IUser extends Document {
  email: string;
  password: string;
  contacts: mongoose.Types.ObjectId[];
  malicious: mongoose.Types.ObjectId[];
  matchPassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  contacts: [{ type: Schema.Types.ObjectId, ref: "Contact" }],
  malicious: [{ type: Schema.Types.ObjectId, ref: "Malicious" }],
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;

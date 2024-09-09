require('dotenv').config()
const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI;
  
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {});
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;

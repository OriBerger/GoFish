import mongoose from "mongoose";

const mongoURL =
  "mongodb+srv://ron101200:uN5yQVf80m9CCfZN@gofish.clviy.mongodb.net/?retryWrites=true&w=majority&appName=goFish";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;

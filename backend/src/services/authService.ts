import jwt from "jsonwebtoken";
import User from "../models/User";

const jwtSecret = process.env.JWT_SECRET || 'secretkey'; 

export const registerUser = async (email: string, password: string) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Create and save new user
    const newUser = new User({ email, password });
    await newUser.save();
    return { message: "User registered successfully!" };
  } catch (error) {
    throw new Error((error as Error).message || "An unexpected error occurred");
  }
};

export const authenticateUser = async (email: string, password: string) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const token = jwt.sign({ userId: user._id, email: user.email}, jwtSecret, {
      expiresIn: "1h", // Consider using refresh tokens for longer sessions
    });
    return { token };
  } catch (error) {
    throw new Error((error as Error).message || "An unexpected error occurred");
  }
};

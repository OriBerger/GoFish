import mongoose, { Types } from "mongoose";
import MaliciousModel from "../models/Malicious";
import User from "../models/User";

export const createMalicious = async (
  userId: string,
  maliciousData: {
    sourceEmail: string;
    sourcePhone: string;
    message: string;
    subject: string;
  }
) => {
  try {
    const malicious = new MaliciousModel(maliciousData);
    await malicious.save();

    const user = await User.findById(userId);
    if (user) {
      user.malicious.push(malicious._id);
      await user.save();
    }
    return malicious;
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      throw new Error(
        `Validation error: ${Object.values(error.errors)
          .map((err) => err.message)
          .join(", ")}`
      );
    }
    console.error(error);
    throw new Error("Could not add malicious format");
  }
};

export const fetchAllMalicious = async (userId: string) => {
  try {
    const user = await User.findById(userId).populate({
      path: "malicious",
    });

    const totalMalicious = await User.aggregate([
      { $match: { _id: user?._id } },
      { $project: { count: { $size: { $ifNull: ["$malicious", []] } } } },
    ]);

    return {
      malicious: user?.malicious || [],
      totalMalicious: totalMalicious[0]?.count || 0,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Could not fetch malicious formats");
  }
};

export const editMalicious = async (
  userId: string,
  maliciousId: string,
  updatedData: {
    sourceEmail?: string;
    sourcePhone?: string;
    message?: string;
    subject?: string;
  }
) => {
  try {
    const maliciousObjectId = new Types.ObjectId(maliciousId);
    const malicious = await MaliciousModel.findById(maliciousId);

    if (!malicious) {
      return null;
    }

    const user = await User.findById(userId);
    if (user && !user.malicious.includes(maliciousObjectId)) {
      throw new Error("malicious format does not belong to the user");
    }

    Object.assign(malicious, updatedData);
    await malicious.save();

    return malicious;
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      throw new Error(
        `Validation error: ${Object.values(error.errors)
          .map((err) => err.message)
          .join(", ")}`
      );
    }
    console.error(error);
    throw new Error("Could not edit malicious format");
  }
};

export const deleteMalicious = async (userId: string, maliciousId: string) => {
  try {
    const maliciousObjectId = new Types.ObjectId(maliciousId);
    const malicious = await MaliciousModel.findById(maliciousId);

    if (!malicious) {
      return null;
    }

    const user = await User.findById(userId);
    if (user && !user.malicious.includes(maliciousObjectId)) {
      throw new Error("malicious format does not belong to the user");
    }

    if (user) {
      user.malicious = user.malicious.filter(
        (id) => id.toString() !== maliciousId
      );
      await user.save();
    }

    await MaliciousModel.findByIdAndDelete(maliciousId);

    return { message: "malicious format successfully deleted" };
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      throw new Error(
        `Validation error: ${Object.values(error.errors)
          .map((err) => err.message)
          .join(", ")}`
      );
    }
    console.error(error);
    throw new Error("Could not delete malicious format");
  }
};

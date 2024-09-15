import { Response } from "express";
import {
  createMalicious,
  fetchAllMalicious,
  editMalicious,
  deleteMalicious,
} from "../services/maliciousFormatsService";
import { RequestWithUser } from "../types/types";

export const createMaliciousHandler = async (
  req: RequestWithUser,
  res: Response
) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const malicious = await createMalicious(userId, req.body);
    res.status(201).json(malicious);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith("Validation error:")
    ) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred." });
    }
  }
};

export const fetchMaliciousHandler = async (
  req: RequestWithUser,
  res: Response
) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { malicious, totalMalicious } = await fetchAllMalicious(userId);
    res.status(200).json({
      malicious,
      totalMalicious,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching malicious formates" });
  }
};

export const editMaliciousHandler = async (
  req: RequestWithUser,
  res: Response
) => {
  const userId = req.user?.userId;
  const maliciousId = req.params.maliciousId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const updatedContact = await editMalicious(userId, maliciousId, req.body);

    if (!updatedContact) {
      return res.status(404).json({ message: "Malicious formates not found" });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    console.error("Error editing malicious format:", error); // Log the error for debugging

    if (error instanceof Error) {
      // Handle known error types
      return res.status(400).json({ message: error.message });
    } else {
      // Handle unknown error types
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const deleteMaliciousHandler = async (
  req: RequestWithUser,
  res: Response
) => {
  const userId = req.user?.userId;
  const maliciousId = req.params.maliciousId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const result = await deleteMalicious(userId, maliciousId);

    if (!result) {
      // This handles cases where the malicious format wasn't found
      return res.status(404).json({ message: "malicious format not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error deleting malicious format:", error); // Log the error for debugging

    if (error instanceof Error) {
      // Check if it's an instance of Error and handle accordingly
      return res.status(400).json({ message: error.message });
    } else {
      // Handle unknown error types
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

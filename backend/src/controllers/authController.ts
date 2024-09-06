import { Request, Response } from "express";
import { registerUser, authenticateUser } from "../services/authService";

// Sign-Up Controller
export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await registerUser(email, password);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Login Controller
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await authenticateUser(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
};

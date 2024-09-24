import { Request, Response } from "express";
import { registerUser, authenticateUser } from "../services/authService";
import { body } from "express-validator"; 

// Email and Password Validation Middleware
export const validateSignup = [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6, max: 12 })
    .withMessage("Password must be between 6 and 12 characters")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter"),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
];


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

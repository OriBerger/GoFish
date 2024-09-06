// routes/authRoutes.ts
import express from "express";
import { signup, login } from "../controllers/authController";
import {
  createContactHandler,
  fetchContactsHandler,
} from "../controllers/contactController";
import authenticate from "../middlewares/authMiddleware";

const router = express.Router();

// Sign-Up Route
router.post("/signup", signup);

// Login Route
router.post("/login", login);

// Route to add a contact (protected)
router.post("/contacts", authenticate, createContactHandler);

// Route to get contacts with pagination (protected)
router.get("/contacts", authenticate, fetchContactsHandler);

export default router;

// routes/authRoutes.ts
import express from "express";
import { login, signup } from "../controllers/authController";
import {
  createContactHandler,
  deleteContactHandler,
  editContactHandler,
  fetchContactsHandler,
} from "../controllers/contactController";
import { sendEmailHandler } from '../controllers/emailController';
import { trackClick } from '../controllers/trackingController';
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

router.put("/contacts/:contactId", authenticate, editContactHandler);

router.delete("/contacts/:contactId", authenticate, deleteContactHandler);

router.get("/main", authenticate, fetchContactsHandler);

router.get("/statistics", authenticate, fetchContactsHandler);


// Route to send phishing emails
router.post('/send-phishing', authenticate, sendEmailHandler);

// Route to track clicks
router.get('/track/:trackingId/:contactId', trackClick);

export default router;

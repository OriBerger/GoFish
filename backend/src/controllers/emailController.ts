import sgMail from '@sendgrid/mail';
import { Request, Response } from 'express';
import { sendPhishingEmail } from '../services/emailService'; // Adjust the path if necessary


sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

interface RequestWithUser extends Request {
  user?: { userId: string; userEmail: string };
}

// Email sending handler


export const sendEmailHandler = async (req: RequestWithUser, res: Response) => {
  const { subject, body, contacts } = req.body; // `contacts` should be an array of contact IDs

  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "User not found" });
  }

  try {
    // Call the sendPhishingEmail service with necessary parameters
    const result = await sendPhishingEmail(userId, contacts, subject, body);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error sending phishing emails:', error);
    res.status(500).json({ message: 'Failed to send phishing emails', error: (error as Error).message });
  }
};
import { Request, Response } from 'express';
import { sendPhishingEmail } from '../services/emailService';

interface RequestWithUser extends Request {
  user?: { userId: string; userEmail: string };
}

export const sendEmailHandler = async (req: RequestWithUser, res: Response) => {
  const { contacts, choosenFormatId } = req.body;

  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ message: "User not found" });
  }

  try {
    const result = await sendPhishingEmail(userId, contacts, choosenFormatId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error sending phishing emails:', error);
    res.status(500).json({ message: 'Failed to send phishing emails', error: (error as Error).message });
  }
};

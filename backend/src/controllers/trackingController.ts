import { Request, Response } from 'express';
import ContactModel from '../models/Contact';

export const trackClick = async (req: Request, res: Response) => {
  const { trackingId, contactId } = req.params;
  try {
    const contact = await ContactModel.findById(contactId);
    if (!contact) {
      return res.status(400).json({ message: 'Invalid contact' });
    }
    contact.clicked = true;
    await contact.save();
    res.status(200).json({ clicked: contact.clicked });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error tracking click' });
  }
};
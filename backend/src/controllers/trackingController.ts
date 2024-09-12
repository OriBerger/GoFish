import { Request, Response } from 'express';
import ContactModel from '../models/Contact';
import User from '../models/User';

export const trackClick = async (req: Request, res: Response) => {
  const { trackingId, contactId } = req.params;

  try {
    const contact = await ContactModel.findById(contactId);
    if (!contact || contact.clicked) {
      return res.status(400).json({ message: 'Invalid or already tracked' });
    }

    contact.clicked = true;
    await contact.save();

    const user = await User.findOne({ contacts: contactId });
    if (user) {
      user.clicks += 1;
      await user.save();
    }

    res.status(200).json({ message: 'Click tracked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error tracking click' });
  }
};

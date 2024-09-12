import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import ContactModel from '../models/Contact';
import User from '../models/User';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPhishingEmail = async (userId: string, contacts: string[], emailContent: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const trackingId = uuidv4();

    for (const contactId of contacts) {
      const contact = await ContactModel.findById(contactId);
      if (!contact) continue;

      const trackingLink = `${process.env.CLIENT_URL}/track/${trackingId}/${contact._id}`;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: contact.email,
        subject: 'Phishing Test',
        text: `${emailContent}\nClick here: ${trackingLink}`,
      };

      await transporter.sendMail(mailOptions);
    }

    user.phishingEmailsSent += contacts.length;
    await user.save();

    return { message: 'Emails sent successfully' };
  } catch (error) {
    console.error(error);
    throw new Error('Error sending emails');
  }
};

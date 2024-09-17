import sgMail from '@sendgrid/mail';
import { v4 as uuidv4 } from 'uuid';
import ContactModel from '../models/Contact';
import User from '../models/User';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export const sendPhishingEmail = async (userId: string, contacts: string[], subject: string, emailContent: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const trackingId = uuidv4();
    const errors: string[] = [];

    for (const contactId of contacts) {
      try {
        const contact = await ContactModel.findById(contactId);
        if (!contact) {
          errors.push(`Contact not found: ${contactId}`);
          continue;
        }

        const trackingLink = `${process.env.CLIENT_URL}/track/${trackingId}/${contact._id}`;
        const msg = {
          to: contact.email,
          from: {
            email: process.env.GENERIC_EMAIL_ADDRESS as string, // Use  generic email that we created from .env
            name: "Microsoft Recruit@Microsoft.com", // Set the name you want recipients to see
          },
          subject: subject,
          text: `${emailContent}\nClick here: ${trackingLink}`,
          html: `<p>${emailContent}</p><p>Click here: <a href="${trackingLink}">${trackingLink}</a></p>`,
        };

        await sgMail.send(msg);
      } catch (error) {
        console.error(`Error sending to ${contactId}:`, error);
        errors.push(`Error sending to ${contactId}`);
      }
    }

    // Optionally update the user's record if needed
    await user.save();

    if (errors.length > 0) {
      return { message: 'Emails sent with errors', errors };
    } else {
      return { message: 'Emails sent successfully' };
    }
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Error sending emails');
  }
};

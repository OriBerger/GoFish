import { Request, Response } from 'express';
import ContactModel from '../models/Contact';
import User from '../models/User';

export const sendgridWebhookHandler = async (req: Request, res: Response) => {
  const events = req.body;

  try {
    // Loop through the events array sent by SendGrid
    for (const event of events) {
      if (event.event === 'click' || event.event === 'reply') {
        const contactId = event.contact_id; // Assuming you send contact ID as metadata
        const contact = await ContactModel.findById(contactId);

        if (contact && contact.emailStatus==="Sent") {
          contact.emailStatus = "Clicked";
          await contact.save();

          const user = await User.findOne({ contacts: contactId });
          if (user) {
            // You can update the user if necessary, e.g., increment click counters
            await user.save();
          }
        }
      }
    }
    res.status(200).json({ message: 'Webhook received and processed successfully' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ message: 'Failed to process webhook' });
  }
};

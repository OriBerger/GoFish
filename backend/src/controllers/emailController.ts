// import sgMail from '@sendgrid/mail';
import { Request, Response } from 'express';

// sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export const sendEmailHandler = async (req: Request, res: Response) => {
  const { subject, body, contacts } = req.body;
//   const userEmail = req.userEmail; // Email of the logged-in user

  try {
    // Prepare email options
    const mailOptions = {
    //   from: userEmail, // Use the logged-in user's email
      to: contacts.map((contact: { email: string }) => contact.email).join(','),
      subject,
      text: body,
    };

    // Send email using SendGrid
    // await sgMail.send(mailOptions);

    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
};

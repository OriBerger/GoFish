import { Response } from "express";
import {
  createContact,
  deleteContact,
  editContact,
  fetchAllContacts,
} from "../services/contactService";
import { RequestWithUser } from "../types/types";

export const createContactHandler = async (
  req: RequestWithUser,
  res: Response
) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const contact = await createContact(userId, req.body);
    res.status(201).json(contact);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Validation error:')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred.' });
    }
  }
};


export const fetchContactsHandler = async (
  req: RequestWithUser,
  res: Response
) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { contacts, totalContacts } = await fetchAllContacts(userId);
    res.status(200).json({
      contacts,
      totalContacts,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching contacts" });
  }
};

export const editContactHandler = async (
  req: RequestWithUser,
  res: Response
) => {
  const userId = req.user?.userId;
  const contactId = req.params.contactId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const updatedContact = await editContact(userId, contactId, req.body);

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    console.error("Error editing contact:", error); // Log the error for debugging

    if (error instanceof Error) {
      // Handle known error types
      return res.status(400).json({ message: error.message });
    } else {
      // Handle unknown error types
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

export const deleteContactHandler = async (
  req: RequestWithUser,
  res: Response
) => {
  const userId = req.user?.userId;
  const contactId = req.params.contactId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const result = await deleteContact(userId, contactId);

    if (!result) {
      // This handles cases where the contact wasn't found
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error deleting contact:", error); // Log the error for debugging

    if (error instanceof Error) {
      // Check if it's an instance of Error and handle accordingly
      return res.status(400).json({ message: error.message });
    } else {
      // Handle unknown error types
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};


import { Request, Response } from "express";
import {
  createContact,
  fetchContactsWithPagination,
  editContact,
  deleteContact,
} from "../services/contactService";
import { ContactData, RequestWithUser } from "../types/types";

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
    res.status(500).json({ error: (error as Error).message });
  }
};

export const fetchContactsHandler = async (
  req: RequestWithUser,
  res: Response
) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { contacts, totalContacts } = await fetchContactsWithPagination(
      userId,
      Number(limit),
      skip
    );
    res.status(200).json({
      contacts,
      currentPage: Number(page),
      totalPages: Math.ceil(totalContacts / Number(limit)),
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
    res.status(500).json({ error: (error as Error).message });
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
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

import ContactModel from "../models/Contact";
import User from "../models/User";
import { Types } from "mongoose";

export const createContact = async (
  userId: string,
  contactData: { name: string; email: string; phone: string }
) => {
  try {
    const contact = new ContactModel(contactData);
    await contact.save();

    const user = await User.findById(userId);
    if (user) {
      user.contacts.push(contact._id);
      await user.save();
    }
    return contact;
  } catch (error) {
    console.error(error);
    throw new Error("Could not add contact");
  }
};

export const fetchAllContacts = async (userId: string) => {
  try {
    const user = await User.findById(userId).populate({
      path: "contacts",
    });

    const totalContacts = await User.aggregate([
      { $match: { _id: user?._id } },
      { $project: { count: { $size: "$contacts" } } },
    ]);

    return {
      contacts: user?.contacts || [],
      totalContacts: totalContacts[0]?.count || 0,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Could not fetch contacts");
  }
};

export const editContact = async (
  userId: string,
  contactId: string,
  updatedData: { name?: string; email?: string; phone?: string }
) => {
  try {
    // Convert contactId to ObjectId
    const contactObjectId = new Types.ObjectId(contactId);

    // Find the contact by its ID
    const contact = await ContactModel.findById(contactId);

    // Check if the contact exists and belongs to the user
    if (!contact) {
      return null; // Contact not found
    }

    // Optionally verify that the contact belongs to the user
    const user = await User.findById(userId);
    if (user && !user.contacts.includes(contactObjectId)) {
      throw new Error("Contact does not belong to the user");
    }

    // Update the contact with the new data
    Object.assign(contact, updatedData);
    await contact.save();

    return contact;
  } catch (error) {
    console.error(error);
    throw new Error("Could not edit contact");
  }
};

export const deleteContact = async (userId: string, contactId: string) => {
  try {
    // Convert contactId to ObjectId
    const contactObjectId = new Types.ObjectId(contactId);

    // Find the contact by its ID
    const contact = await ContactModel.findById(contactId);

    // Check if the contact exists
    if (!contact) {
      return null; // Contact not found
    }

    // Optionally verify that the contact belongs to the user
    const user = await User.findById(userId);
    if (user && !user.contacts.includes(contactObjectId)) {
      throw new Error("Contact does not belong to the user");
    }

    // Remove the contact from the user's contacts list
    if (user) {
      user.contacts = user.contacts.filter((id) => id.toString() !== contactId);
      await user.save();
    }

    // Delete the contact
    await ContactModel.findByIdAndDelete(contactId);

    return { message: "Contact successfully deleted" };
  } catch (error) {
    console.error(error);
    throw new Error("Could not delete contact");
  }
};

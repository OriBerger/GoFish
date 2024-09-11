import mongoose, { Types } from "mongoose";
import ContactModel from "../models/Contact";
import User from "../models/User";


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
    if (error instanceof mongoose.Error.ValidationError) {
      throw new Error(`Validation error: ${Object.values(error.errors).map(err => err.message).join(', ')}`);
    }
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
    const contactObjectId = new Types.ObjectId(contactId);
    const contact = await ContactModel.findById(contactId);

    if (!contact) {
      return null;
    }

    const user = await User.findById(userId);
    if (user && !user.contacts.includes(contactObjectId)) {
      throw new Error("Contact does not belong to the user");
    }

    Object.assign(contact, updatedData);
    await contact.save();

    return contact;
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      throw new Error(`Validation error: ${Object.values(error.errors).map(err => err.message).join(', ')}`);
    }
    console.error(error);
    throw new Error("Could not edit contact");
  }
};

export const deleteContact = async (userId: string, contactId: string) => {
  try {
    const contactObjectId = new Types.ObjectId(contactId);
    const contact = await ContactModel.findById(contactId);

    if (!contact) {
      return null;
    }

    const user = await User.findById(userId);
    if (user && !user.contacts.includes(contactObjectId)) {
      throw new Error("Contact does not belong to the user");
    }

    if (user) {
      user.contacts = user.contacts.filter((id) => id.toString() !== contactId);
      await user.save();
    }

    await ContactModel.findByIdAndDelete(contactId);

    return { message: "Contact successfully deleted" };
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      throw new Error(`Validation error: ${Object.values(error.errors).map(err => err.message).join(', ')}`);
    }
    console.error(error);
    throw new Error("Could not delete contact");
  }
};
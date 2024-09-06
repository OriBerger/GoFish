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
    console.error(error);
    throw new Error("Could not add contact");
  }
};

export const fetchContactsWithPagination = async (
  userId: string,
  limit: number,
  skip: number
) => {
  try {
    const user = await User.findById(userId).populate({
      path: "contacts",
      options: { limit, skip },
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
    throw new Error("Could not fetch contacts with pagination");
  }
};

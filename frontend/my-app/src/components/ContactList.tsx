import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/ContactList.css"; // Import the CSS file
import { Contact } from "../types/appTypes"; // Import the shared Contact type
import AddContactForm from "./AddContactForm";
import ContactsTable from "./ContactsTable";


const ContactList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const fetchContacts = async () => {
    try {
      const response = await api.get(`/contacts`);
      setContacts(response.data.contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleEdit = (contact: Contact) => {
    console.log("Edit contact", contact);
    // Implement edit functionality here
  };

  const handleDelete = async (contactId: string) => {
    try {
      await api.delete(`/contacts/${contactId}`);
      setContacts(prevContacts => prevContacts.filter(c => c._id !== contactId));
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const handleAddContact = () => {
    setIsAdding(true);
  };

  const handleContactAdded = () => {
    setIsAdding(false);
    fetchContacts(); // Refresh contacts after adding
  };

  return (
    <div>
      <button onClick={handleAddContact} className="add-button">Add contact</button>
      {isAdding && <AddContactForm onContactAdded={handleContactAdded} />}
      <ContactsTable contacts={contacts} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default ContactList;

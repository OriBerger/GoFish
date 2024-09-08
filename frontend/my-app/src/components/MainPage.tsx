import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/MainPage.css"; // Import the CSS file
import { Contact } from "../types/appTypes"; // Import the shared Contact type
import AddContactForm from "./AddContactForm";
import ContactsTable from "./ContactsTable";
import LogOutButton from "./LogOutButton";
import StatisticsButton from "./StatisticsButton";

const MainPage: React.FC = () => {
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
    // Optionally open a form to add a contact
  };

  
  const handleContactAdded = () => {
    setIsAdding(false);
    fetchContacts(); // Refresh contacts after adding
  };
  
  return (
    <div className="mainpage-container">
      <h1>Welcome to the Main Page!</h1>
      <button onClick={handleAddContact} className="add-contact-button">Add Contact</button>
      {isAdding && <AddContactForm onContactAdded={handleContactAdded}/>}
      <ContactsTable contacts={contacts} onEdit={handleEdit} onDelete={handleDelete} />
      <LogOutButton />
      <StatisticsButton />
    </div>
  );
};

export default MainPage;

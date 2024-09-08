import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/ContactList.css"; // Import the CSS file
import { Contact } from "../types/appTypes"; // Import the shared Contact type
import AddContactForm from "./AddContactForm";
import ContactsTable from "./ContactsTable";


const ContactList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; // You can set this to any value
  const [isAdding, setIsAdding] = useState(false);

  const fetchContacts = async () => {
    try {
      const response = await api.get(`/contacts`, {
        params: {
          page,
          limit,
        },
      });

      setContacts(response.data.contacts);
      setTotalPages(
        response.data.totalPages > 0 ? response.data.totalPages : 1
      );
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [page]);

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleAddContact = () => {
    setIsAdding(true);
  };

  const handleContactAdded = () => {
    setIsAdding(false);
    fetchContacts(); // Refresh contacts after adding
  };


  const handleDelete = async (contactId: string) => {
    try {
      await api.delete(`/contacts/${contactId}`);
      setContacts(prevContacts => prevContacts.filter(c => c._id !== contactId));
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const handleEdit = (contact: Contact) => {
    console.log("Edit contact", contact);
    // Implement edit functionality here
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



// <div>
// <button onClick={handlePreviousPage} disabled={page === 1}>
//   Previous
// </button>
// <span>
//   {" "}
//   Page {page} of {totalPages}{" "}
// </span>
// <button onClick={handleNextPage} disabled={page === totalPages}>
//   Next
// </button>
// </div>
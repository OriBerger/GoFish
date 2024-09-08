import React from "react";
import api from "../services/api";
import "../styles/ContactsTable.css"; // Adjust the path to where your CSS file is located
import { Contact } from "../types/appTypes";

interface ContactsTableProps {
  contacts: Contact[];
  onChange: () => void;
}

const ContactsTable: React.FC<ContactsTableProps> = ({
  contacts,
  onChange,
}) => {
  const handleDelete = async (contactId: string) => {
    try {
      await api.delete(`/contacts/${contactId}`);
      onChange();
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  return (
    <div className="contacts-table-container">
      <table className="contacts-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact._id}>
              <td>{contact.name}</td>
              <td>{contact.email}</td>
              <td>{contact.phone}</td>
              <td>
                <button className="edit-button" onClick={() => {}}>
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(contact._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactsTable;

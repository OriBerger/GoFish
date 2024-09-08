import React from "react";
import "../styles/ContactsTable.css"; // Adjust the path to where your CSS file is located
import { Contact } from "../types/appTypes";

interface ContactsTableProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (contactId: string) => void;
}

const ContactsTable: React.FC<ContactsTableProps> = ({ contacts, onEdit, onDelete }) => {
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
          {contacts.map(contact => (
            <tr key={contact._id}>
              <td>{contact.name}</td>
              <td>{contact.email}</td>
              <td>{contact.phone}</td>
              <td>
                <button className="edit-button" onClick={() => onEdit(contact)}>Edit</button>
                <button className="delete-button" onClick={() => onDelete(contact._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactsTable;

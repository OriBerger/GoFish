import React, { useEffect, useState } from "react";
import api from "../services/api"; // Import your API service
import "../styles/AddContactForm.css"; // Adjust the path to your CSS file
import { Contact } from "../types/appTypes";

interface AddContactFormProps {
  onContactAdded: () => void;
  contact?: Contact | null;
}

const AddContactForm: React.FC<AddContactFormProps> = ({ onContactAdded, contact }) => {
  const [name, setName] = useState(contact?.name || "");
  const [email, setEmail] = useState(contact?.email || "");
  const [phone, setPhone] = useState(contact?.phone || "");

  // Reset form fields if contact prop changes
  useEffect(() => {
    if (contact) {
      setName(contact.name);
      setEmail(contact.email);
      setPhone(contact.phone);
    }
  }, [contact]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (contact) {
        // Edit existing contact
        await api.put(`/contacts/${contact._id}`, { name, email, phone });
      } else {
        // Add new contact
        await api.post(`/contacts`, { name, email, phone });
      }
      onContactAdded(); // Refresh contacts and close the form
    } catch (error) {
      console.error("Error adding/editing contact:", error);
    }
  };

  return (
    <div className="add-contact-form-container">
      <form onSubmit={handleSubmit} className="add-contact-form">
        <div className="form-field">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
        </div>
        <div className="form-buttons">
          <button type="submit">{contact ? 'Update' : 'Add'}</button>
          <button type="button" onClick={onContactAdded}>Close</button>
        </div>
      </form>
    </div>
  );
};

export default AddContactForm;

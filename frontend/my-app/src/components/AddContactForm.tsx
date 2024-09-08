import React, { useEffect, useState } from "react";
import api from "../services/api"; // Import your API service
import "../styles/AddContactForm.css"; // Adjust the path to your CSS file
import { Contact } from "../types/appTypes";

interface AddContactFormProps {
  onContactAdded: () => void;
}

const AddContactForm: React.FC<AddContactFormProps> = ({ onContactAdded }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Add new contact
      await api.post(`/contacts`, { name, email, phone });
      onContactAdded(); // Refresh contacts and close the form
      // Clear the form after adding
      setName("");
      setEmail("");
      setPhone("");
    } catch (error) {
      console.error("Error adding contact:", error);
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
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="form-buttons">
          <button type="submit">Add Contact</button>
          <button type="button" onClick={onContactAdded}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddContactForm;

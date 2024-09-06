import React, { useState } from "react";
import api from "../services/api";

interface ContactFormProps {
  onContactAdded: () => void; // Callback when a contact is successfully added
}

const AddContactForm: React.FC<ContactFormProps> = ({ onContactAdded }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post(`/contacts`, {
        name,
        email,
        phone,
      });

      if (response.status === 201) {
        alert("Contact added successfully!");
        onContactAdded(); // Refresh the contact list or update UI
        setName("");
        setEmail("");
        setPhone("");
      }
    } catch (err) {
      setError("Error adding contact");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAddContact}>
      <h3>Add New Contact</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Phone:</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Contact"}
      </button>
    </form>
  );
};

export default AddContactForm;

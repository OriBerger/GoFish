import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/CampaignPage.css"; // Import the CSS file
import { Contact } from "../types/appTypes";
import BackToMainpageButton from "./BackToMainpageButton";

const CampaignPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if state is undefined, otherwise extract contacts
  const contacts: Contact[] = (location.state && (location.state as any).contacts) || [];
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = async () => {
    if (!subject || !body) {
      alert("Subject and body are required.");
      return;
    }
    const contactIds = contacts.map(contact => contact.id);

    // Ensure there are selected contacts
    if (contactIds.length === 0) {
      alert("No contacts selected for the campaign.");
      return;
    }

    setIsSending(true); // Disable the button during sending process

    try {
      await api.post("/send-phishing", { contacts, subject, body });
      alert("Emails sent successfully");
      navigate("/main");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send emails. Please try again.");
    } finally {
      setIsSending(false); // Re-enable the button after sending
    }
  };

  return (
    <div>
      <BackToMainpageButton />
      <h1>Create Email Campaign</h1>
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        disabled={isSending}
      />
      <textarea
        placeholder="Email body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        disabled={isSending}
      />
      <button onClick={handleSendEmail} disabled={isSending}>
        {isSending ? "Sending..." : "Send"}
      </button>
    </div>
  );
};

export default CampaignPage;

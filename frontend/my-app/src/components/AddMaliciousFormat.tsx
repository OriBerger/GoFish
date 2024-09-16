import { useState } from "react";
import api from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import { Contact } from "../types/appTypes";
import "../styles/AddMaliciousFormat.css"; // Import the CSS

const AddMaliciousFormat = () => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const { state } = useLocation();
  const { contacts }: { contacts: Contact[] } = state;

  const navigate = useNavigate();
  const handleSendEmail = async () => {
    if (!subject || !body) {
      alert("Subject and body are required.");
      return;
    }
    try {
      await api.post("/campaign/send", { contacts, subject, body });
      alert("Emails sent successfully!");
      navigate("/main");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send emails. Please try again.");
    }
  };
  return (
    <div className="malicious-format">
      <h1>Create Email Campaign</h1>
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <textarea
        placeholder="Email body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button onClick={handleSendEmail}>Send</button>
    </div>
  );
};

export default AddMaliciousFormat;

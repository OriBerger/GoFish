import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/SendMessagesButton.css"; // Import the CSS
import { Contact } from "../types/appTypes";

type SendMessageProps = {
  choosenFormatId: string | null;
  contacts: Contact[];  // Add contacts as a prop
};

const SendMessagesButton: React.FC<SendMessageProps> = ({
  choosenFormatId,
  contacts,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSendEmail = async () => {
    console.log("Contacts: ", contacts);
    console.log("Chosen Format ID: ", choosenFormatId);
    if (!choosenFormatId || contacts.length === 0) {
      alert("Please select a format.");
      return;
    }
    try {
      setLoading(true);
      // Map contacts to only send contact IDs instead of full objects
      const contactIds = contacts.map(contact => contact.id);
      await api.post("/send-phishing", { contacts: contactIds, choosenFormatId });
      alert("Emails sent successfully!");
      navigate("/main");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send emails. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button className="send-messages-button" onClick={handleSendEmail} disabled={loading}>
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
};

export default SendMessagesButton;

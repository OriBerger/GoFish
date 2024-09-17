import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/CampaignPage.css"; // Import the CSS file
import { Contact } from "../types/appTypes";
import BackToMainpageButton from "./BackToMainpageButton";

const CampaignPage: React.FC = () => {
  // const [choosenFormatId, setChoosenFormatId] = useState<string | null>(null); //////this is ron
  const { state } = useLocation();
  const { contacts }: { contacts: Contact[] } = state;
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
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
    <div>
      <BackToMainpageButton />
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
      {/* <div className="malicious-options"> ///this is ron
        <MaliciousList
          choosenFormatId={choosenFormatId}
          setChoosenFormatId={setChoosenFormatId}
        />
        <AddNewFormat />
        <SendMessagesButton choosenFormatId={choosenFormatId} />
      </div> ///this is ron */}
    </div>
  );
};

export default CampaignPage;

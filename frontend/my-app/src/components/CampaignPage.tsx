import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/CampaignPage.css"; // Import the CSS file
import { Contact } from "../types/appTypes";
import AddNewFormat from "./AddNewFormat";
import BackToMainpageButton from "./BackToMainpageButton";
import MaliciousList from "./MaliciousList";
import SendMessagesButton from "./SendMessagesButton";

const CampaignPage: React.FC = () => {
  const [choosenFormatId, setChoosenFormatId] = useState<string | null>(null);
  const { state } = useLocation();
  const { contacts }: { contacts: Contact[] } = state;
  return (
    <div>
      <BackToMainpageButton />
      <h1>Create Email Campaign</h1>
      <div className="malicious-options">
        <MaliciousList
          choosenFormatId={choosenFormatId}
          setChoosenFormatId={setChoosenFormatId}
        />
        <AddNewFormat />
        <SendMessagesButton choosenFormatId={choosenFormatId} contacts = {contacts} />
      </div>
    </div>
  );
};

export default CampaignPage;

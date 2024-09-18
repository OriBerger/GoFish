import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/CampaignPage.css"; // Import the CSS file
import { Contact } from "../types/appTypes";
import AddNewFormat from "./AddNewFormat";
import BackToMainpageButton from "./BackToMainpageButton";
import MaliciousList from "./MaliciousList";
import SendMessagesButton from "./SendMessagesButton";
import { useMaliciousFormat } from "./MaliciousListHook";

const CampaignPage: React.FC = () => {
  const [choosenFormatId, setChoosenFormatId] = useState<string | null>(null);
  const { state } = useLocation();
  const { contacts }: { contacts: Contact[] } = state;
  const {
    maliciousFormats,
    handleEditApiCall,
    handleDeleteApiCall,
    handleCreateApiCall,
    loading,
  } = useMaliciousFormat();
  return (
    <div>
      <BackToMainpageButton />
      <h1>Create Email Campaign</h1>
      <div className="malicious-options">
        <MaliciousList
          maliciousFormats={maliciousFormats}
          handleEditApiCall={handleEditApiCall}
          handleDeleteApiCall={handleDeleteApiCall}
          loading={loading}
          choosenFormatId={choosenFormatId}
          setChoosenFormatId={setChoosenFormatId}
        />
        <AddNewFormat handleCreateApiCall={handleCreateApiCall} />
        <SendMessagesButton
          choosenFormatId={choosenFormatId}
          contacts={contacts}
        />
      </div>
    </div>
  );
};

export default CampaignPage;

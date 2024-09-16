import React, { useState } from "react";
import BackToMainpageButton from "./BackToMainpageButton";
import AddMaliciousFormat from "./AddMaliciousFormat";
import MaliciousList from "./MaliciousList";
import "./../styles/CampaignPage.css"; // Import the CSS
import AddNewFormat from "./AddNewFormat";
import SendMessagesButton from "./SendMessagesButton";

const CampaignPage: React.FC = () => {
  const [choosenFormatId, setChoosenFormatId] = useState<string | null>(null);
  return (
    <div>
      <BackToMainpageButton />
      <div className="malicious-options">
        <MaliciousList
          choosenFormatId={choosenFormatId}
          setChoosenFormatId={setChoosenFormatId}
        />
        <AddNewFormat />
        <SendMessagesButton choosenFormatId={choosenFormatId} />
      </div>
    </div>
  );
};

export default CampaignPage;

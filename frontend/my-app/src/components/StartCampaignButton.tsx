// StartCampaignButton.tsx
import { useNavigate } from "react-router-dom";
import "../styles/StartCampaignButton.css"; // Import the CSS file
import { Contact } from "../types/appTypes";

interface StartCampaignButtonProps {
  selectedContacts: Contact[];
}

const StartCampaignButton: React.FC<StartCampaignButtonProps> = ({
  selectedContacts,
}) => {
  const navigate = useNavigate();

  const handleStartCampaign = () => {
    if (selectedContacts.length === 0) {
      alert("Please select at least one contact.");
      return;
    }
    navigate("/campaign", { state: { contacts: selectedContacts } });
  };

  return (
    <button
      onClick={handleStartCampaign}
      className="start-campaign-button" // Apply the CSS class
    >
      Start Campaign
    </button>
  );
};

export default StartCampaignButton;

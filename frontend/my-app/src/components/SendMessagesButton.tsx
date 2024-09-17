import { useLocation, useNavigate } from "react-router-dom";
import { Contact } from "../types/appTypes";
import api from "../services/api";

type SendMessageProps = {
  choosenFormatId: string | null;
};

// next: fix this page, and add css

const SendMessagesButton: React.FC<SendMessageProps> = ({
  choosenFormatId,
}) => {
  const { state } = useLocation();
  const { contacts }: { contacts: Contact[] } = state;
  const navigate = useNavigate();

  const handleSendEmail = async () => {
    try {
      await api.post("/campaign/send", { contacts, choosenFormatId });
      alert("Emails sent successfully!");
      navigate("/main");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send emails. Please try again.");
    }
  };
  return <div></div>;
};
export default SendMessagesButton;

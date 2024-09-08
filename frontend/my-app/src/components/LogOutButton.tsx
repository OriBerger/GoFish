import { useNavigate } from "react-router-dom";
import "../styles/LogOutButton.css"; // Import the CSS file

const LogOutButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className="log-out-button" // Apply the CSS class
    >
      Log Out
    </button>
  );
};

export default LogOutButton;

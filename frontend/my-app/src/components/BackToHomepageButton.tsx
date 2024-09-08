import { useNavigate } from "react-router-dom";
import "../styles/BackToHomepageButton.css"; // Import the CSS file

const BackToHomepageButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className="back-to-homepage-button" // Apply the CSS class
    >
      Back to Homepage
    </button>
  );
};

export default BackToHomepageButton;

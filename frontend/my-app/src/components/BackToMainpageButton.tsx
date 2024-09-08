import { useNavigate } from "react-router-dom";
import "../styles/BackToMainpageButton.css"; // Import the CSS file

const BackToMainpageButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/main")}
      className="back-to-mainpage-button" // Apply the CSS class
    >
      Back to Mainpage
    </button>
  );
};

export default BackToMainpageButton;

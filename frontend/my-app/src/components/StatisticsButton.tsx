import { useNavigate } from "react-router-dom";
import "../styles/StatisticsButton.css"; // Import the CSS file

const StatisticsButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/statistics")}
      className="statistics-button" // Apply the CSS class
    >
      Statistics
    </button>
  );
};

export default StatisticsButton;

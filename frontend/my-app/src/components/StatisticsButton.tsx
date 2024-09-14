import { useNavigate } from "react-router-dom";
import "../styles/StatisticsButton.css";

const StatisticsButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/statistics")}
      className="statistics-button"
    >
      Statistics
    </button>
  );
};

export default StatisticsButton;

import React from "react";
import "../styles/StatisticsPage.css"; // Import the CSS file
import BackToMainpageButton from "./BackToMainpageButton";
import Statistics from "./Statistics";

const StatisticsPage: React.FC = () => {
  return (
    <div className="statistics-container">
      <h1>Statistics page</h1>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 3, border: "1px solid darkred" }}>
          <Statistics />
        </div>
      </div>
      <BackToMainpageButton />
    </div>
  );
};

export default StatisticsPage;

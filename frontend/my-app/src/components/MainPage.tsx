import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/MainPage.css"; // Import the CSS file
import { Contact } from "../types/appTypes"; // Import the shared Contact type
import LogOutButton from "./LogOutButton";
import FullFeaturedCrudGrid from "./MuiContactTable";
import StatisticsButton from "./StatisticsButton";

const MainPage: React.FC = () => {
  return (
    <div className="mainpage-container">
      <h1>Welcome to the Main Page!</h1>
      <FullFeaturedCrudGrid />
      <LogOutButton />
      <StatisticsButton />
    </div>
  );
};

export default MainPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Contact } from "../types/appTypes";
import LogOutButton from "./LogOutButton";
import FullFeaturedCrudGrid from "./MuiContactTable";
import StartCampaignButton from "./StartCampaignButton";
import StatisticsButton from "./StatisticsButton";

const MainPage: React.FC = () => {
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const navigate = useNavigate();

  return (
    <div className="mainpage-container">
      <h1>Welcome to the Main Page!</h1>
      <FullFeaturedCrudGrid setSelectedContacts={setSelectedContacts} />
      <StartCampaignButton selectedContacts={selectedContacts} />
      <LogOutButton />
      <StatisticsButton />
    </div>
  );
};

export default MainPage;

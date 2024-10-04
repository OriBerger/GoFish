import React, { useState } from "react";
import { Contact } from "../types/appTypes";
import LogOutButton from "./LogOutButton";
import FullFeaturedCrudGrid from "./MuiContactTable";
import StartCampaignButton from "./StartCampaignButton";
import StatisticsButton from "./StatisticsButton";

const MainPage: React.FC = () => {
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);

  return (
    <div className="mainpage-container">
      <h1>Main page</h1>
      <FullFeaturedCrudGrid setSelectedContacts={setSelectedContacts} />
      <StartCampaignButton selectedContacts={selectedContacts} />
      <LogOutButton />
      <StatisticsButton />
    </div>
  );
};

export default MainPage;

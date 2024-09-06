import React from "react";
import ContactList from "./ContactList";
import Statistics from "./Statistics";
import styled from "styled-components";

const StyledStatisticsWraper = styled.div`
  flex: 3;
  border: 1px solid darkred;
`;
const StyledContactListWraper = styled.div`
  flex: 2;
  border: 1px solid darkred;
`;

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Welcome to the Home Page!</h1>
      <div style={{ display: "flex" }}>
        <StyledStatisticsWraper>
          <Statistics />
        </StyledStatisticsWraper>
        <StyledContactListWraper>
          <ContactList />
        </StyledContactListWraper>
      </div>
    </div>
  );
};

export default HomePage;

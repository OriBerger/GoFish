import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CampaignPage from "./components/CampaignPage";
import HomePage from "./components/HomePage";
import MainPage from "./components/MainPage";
import PrivateRoute from "./components/PrivateRoute";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import StatisticsPage from "./components/StatisticsPage";

import MaliciousLinkPage from "./components/MaliciousLinkPage";
import TrackClick from "./components/TrackClick";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/main"
          element={
            <PrivateRoute>
              <MainPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/statistics"
          element={
            <PrivateRoute>
              <StatisticsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/track/:trackingId/:contactId"
          element={
            <TrackClick />
          }
        />
        <Route
          path="/campaign"
          element={
            <PrivateRoute>
              <CampaignPage />
            </PrivateRoute>
          }
        />
        <Route path="/linkMaster" element={<MaliciousLinkPage />} />
      </Routes>
    </Router>
  );
}

export default App;

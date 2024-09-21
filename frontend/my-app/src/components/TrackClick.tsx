import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
require("dotenv").config();

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const TrackClick = () => {
  const { trackingId, contactId } = useParams();
  const [clickStatus, setClickStatus] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchClickStatus = async () => {
      if (!trackingId || !contactId) {
        console.error("Missing parameters:", { trackingId, contactId });
        return;
      }
      try {
        const response = await axios.get(
          `${API_BASE_URL}/track/${trackingId}/${contactId}`
        );
        console.log("API response:", response.data);
        setClickStatus(response.data.clicked);
      } catch (error) {
        console.error("Failed to fetch click status:", error);
      }
    };

    fetchClickStatus();
  }, [trackingId, contactId]);

  return (
    <div>
      <h1>Phishing Test</h1>
      <p>Thank you for participating in this phishing awareness test.</p>
      {clickStatus === null ? (
        <p>Loading click status...</p>
      ) : clickStatus ? (
        <p>You have clicked the phishing link. Stay alert!</p>
      ) : (
        <p>You haven't clicked the phishing link yet. Stay vigilant!</p>
      )}
    </div>
  );
};

export default TrackClick;

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
    <>
     {clickStatus === null ? (
        <p>Loading click status...</p>
      ) : clickStatus ? (
        <p>You have clicked the phishing link. Stay alert!</p>
      ) : ("")}
      <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
        <h1>⚠️ You have made the phishing panda mad!</h1>
      </div>
      <p>
        You clicked a suspiciuos link that could have been dangerous to your or your
        company's sensitive data. Please apologize to the panda and click the
        next *safe .gov* link:{" "}
        <a
          href="https://www.occ.gov/topics/consumers-and-communities/consumer-protection/fraud-resources/phishing-attack-prevention.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Phishing Attack Prevention
        </a>
      </p>
      <iframe
        src="https://giphy.com/embed/o7OChVtT1oqmk"
        title="Apologize to the panda"
        style={{
          placeItems: "center",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          padding: "0px",
        }}
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </>
  );
};

export default TrackClick;

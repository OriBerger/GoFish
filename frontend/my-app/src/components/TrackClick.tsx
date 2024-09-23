import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/TrackClick.css"; // We'll move the styles to a CSS file

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
    <div className="track-click-container">
      <div className="warning-header">
        <h1>⚠️ Oh no! The Phishing Panda is Angry! ⚠️</h1>
      </div>
      <div className="message-box">
        <p>
          You clicked a suspicious link that could have compromised sensitive data
          for you or your company. The Phishing Panda is not happy! 😡
        </p>
        <p>
          To make it right, apologize to the panda and visit this trusted .gov site
          to learn how to protect yourself from phishing attacks:{" "}
          <a
            className="safe-link"
            href="https://www.occ.gov/topics/consumers-and-communities/consumer-protection/fraud-resources/phishing-attack-prevention.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Safe Click Here 🛡️
          </a>
        </p>
      </div>
      <div className="panda-gif">
        <iframe
          src="https://giphy.com/embed/o7OChVtT1oqmk"
          title="Apologize to the panda"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default TrackClick;

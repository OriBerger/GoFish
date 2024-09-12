import axios from 'axios';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const TrackClick = () => {
  const { trackingId, contactId } = useParams();

  useEffect(() => {
    const trackClick = async () => {
      try {
        await axios.get(`/api/track/${trackingId}/${contactId}`);
        alert('Click tracked successfully.');
      } catch (error) {
        alert('Failed to track click.');
      }
    };

    trackClick();
  }, [trackingId, contactId]);

  return (
    <div>
      <h1>Phishing Test</h1>
      <p>Thank you for participating in this phishing awareness test.</p>
    </div>
  );
};

export default TrackClick;

import { useNavigate } from "react-router-dom";
import "../styles/LogOutButton.css"; // Import the CSS file

const LogOutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    navigate("/"); // Redirect to the sign-in page
  };

  return (
    <button
      onClick={handleLogout}
      className="log-out-button" // Apply the CSS class
    >
      Log out
    </button>
  );
};

export default LogOutButton;

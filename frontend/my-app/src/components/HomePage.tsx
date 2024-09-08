import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css"; // Import the CSS file

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      <h1 className="homepage-title">My-App</h1>
      <div className="button-container">
        <button className="btn btn-signin" onClick={() => navigate("/signin")}>
          Sign In
        </button>
        <button className="btn btn-signup" onClick={() => navigate("/signup")}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default HomePage;

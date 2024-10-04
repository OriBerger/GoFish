import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css"; // Import the CSS file

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Go-Fish</h1>
      <div className="button-container">
        <button className="btn btn-signin" onClick={() => navigate("/signin")}>
          Sign in
        </button>
        <button className="btn btn-signup" onClick={() => navigate("/signup")}>
          Sign up
        </button>
      </div>
    </div>
  );
};

export default HomePage;

import { AxiosError } from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/SignIn.css"; // Import the CSS file
import { ErrorResponse } from "../types/appTypes";
import BackToHomepageButton from "./BackToHomepageButton";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/login", { email, password });
      console.log("Sign In successful:", response.data);
      localStorage.setItem("token", response.data.token);
      navigate("/main");
    } catch (error) {
      setError(
        (error as AxiosError<ErrorResponse>).response?.data?.error ||
          "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign-in-container">
      <h2>Sign in</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSignIn} className="sign-in-form">
        <div className="sign-in-form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="sign-in-form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <BackToHomepageButton />
      {/* Add the message at the end */}
      <div className="signup-message">
        <p>
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-primary ng-binding"
            style={{ cursor: "pointer" }}
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;

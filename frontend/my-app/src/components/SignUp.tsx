import { AxiosError } from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/SignUp.css"; // Import the CSS file
import { ErrorResponse } from "../types/appTypes";
import BackToHomepageButton from "./BackToHomepageButton";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  // Password validation rules
  const lowerCaseLetters = /[a-z]/;
  const upperCaseLetters = /[A-Z]/;
  const numbers = /[0-9]/;
  const minLength = 6;
  const maxLength = 12;

  // Validation checks
  const isValidLowerCase = lowerCaseLetters.test(password);
  const isValidUpperCase = upperCaseLetters.test(password);
  const isValidNumber = numbers.test(password);
  const isValidLength =
    password.length >= minLength && password.length <= maxLength;

  const isPasswordValid =
    isValidLowerCase && isValidUpperCase && isValidNumber && isValidLength;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/signup", { email, password });
      console.log("Sign Up successful:", response.data);
      localStorage.setItem("token", response.data.token); // Store the token in localStorage
      navigate("/main"); // Navigate to the main page after signup
      setMessage(response.data.message);
    } catch (error) {
      console.log("Sign-Up Error:", error); // Add this to inspect the error
      setMessage(
        (error as AxiosError<ErrorResponse>).response?.data?.error ||
          "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign-up-container">
      <h2>Sign up</h2>
      <div className="form-and-message">
        <form onSubmit={handleSignUp} className="sign-up-form">
          <div className="sign-up-form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="sign-up-form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="sign-up-form-group">
            <label>Confirm password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading || !isPasswordValid}>
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>

        {/* Password validation box */}
        <div id="message">
          <h3>Password Requirements:</h3>
          <p className={isValidLowerCase ? "valid" : "invalid"}>
            A <b>lowercase</b> letter
          </p>
          <p className={isValidUpperCase ? "valid" : "invalid"}>
            A <b>capital (uppercase)</b> letter
          </p>
          <p className={isValidNumber ? "valid" : "invalid"}>
            A <b>number</b>
          </p>
          <p className={isValidLength ? "valid" : "invalid"}>
            Between{" "}
            <b>
              {minLength} and {maxLength} characters
            </b>
          </p>
        </div>
      </div>

      <BackToHomepageButton />
      {message && <p className="error-message">{message}</p>}
      <div className="signin-message">
        <p>
          Already have an account?{" "}
          <a
            href="/signin"
            className="text-primary ng-binding"
            style={{ cursor: "pointer" }}
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

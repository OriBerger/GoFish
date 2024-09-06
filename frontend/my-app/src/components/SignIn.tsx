import React, { useState } from "react";
import api from "../services/api";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { ErrorResponse } from "../types/appTypes";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/login", {
        email,
        password,
      });
      console.log("Sign In successful:", response.data);
      localStorage.setItem("token", response.data.token);

      navigate("/home");
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
    <div>
      <h2>Sign In</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSignIn}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default SignIn;

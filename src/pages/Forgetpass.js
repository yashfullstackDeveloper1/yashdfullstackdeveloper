import React, { useState } from "react";
import "./account.css";
import { useNavigate } from "react-router-dom";

function Forgetpass() {
  const move = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleReset = () => {
    if (email === "y@gmail.com" && password === confirmPassword) {
      setError("");
      move("/Dashboard");
    } else {
      setError("Email wrong or passwords do not match");
    }
  };

  return (
    <div className="container">
      <div className="login-card">
        <h2 className="title">Reset Password</h2>

        <input
          type="text"
          placeholder="Username"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button className="btn" onClick={handleReset}>
          Continue
        </button>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default Forgetpass;
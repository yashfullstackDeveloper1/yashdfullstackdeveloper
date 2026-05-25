import React, { useState } from "react";
import "./sinup.css";
import { useNavigate } from "react-router-dom";

function Sinup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = () => {
    if (email === "y@gmail.com" && password === confirmPassword) {
      setError("");
      navigate("/Dashboard");
    } else {
      setError("Email wrong or passwords do not match");
    }
  };

  return (
    <div className="container">
      <div className="login-card">
        <h2 className="title">Sign-up</h2>

        <input
          type="text"
          placeholder="Name"
          className="input"
        />

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

        <div className="checkbox">
          <input type="checkbox" />
          <p className="fonts">
            I agree the following terms and conditions.
          </p>
        </div>

        <button className="btn" onClick={handleSignup}>
          Continue
        </button>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default Sinup;
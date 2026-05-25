import React, { useState } from "react";
import "./account.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const move = useNavigate();

  const [email, Email] = useState("");
  const [password, Password] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (email === "y@gmail.com" && password === "yash") {
      setError("");
      move("/Dashboard"); 
    } else {
      setError("Invalid email or password"); 
    }
  };

  return (
    <div className="container">
      <div className="login-card">
        <h2 className="title">Welcome Back</h2>
        <p className="subtitle">Login to continue</p>

        <input
          type="text"
          placeholder="Username"
          className="input"
          value={email}
          onChange={(e) => Email(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="input"
          value={password}
          onChange={(e) => Password(e.target.value)}
        />

        <div className="alignment">
          <span className="link" onClick={() => move("/forget")}>
            Forgot password
          </span>

          <span className="link" onClick={() => move("/signup")}>
            Create account
          </span>
        </div>

        <button className="btn" onClick={handleLogin}>
          Continue
        </button>

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default Login;
import React, { useState } from "react";
import "./Login.css";
import logo from "../assets/logo.png";

import {
  FiMoon,
  FiEye,
  FiSun,
  FiEyeOff,
  FiAlertTriangle,
} from "react-icons/fi";

import { TailSpin } from "react-loader-spinner";
import { login, getMyInstitutesRoles } from "../services/authService";

function Login({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      // Step 1 - Login and get pre_context_token
      const loginData = await login(email, password);

      if (!loginData.success) {
        setError(loginData.message);
        setLoading(false);
        return;
      }

      // Step 2 - Save pre_context_token in localStorage
      localStorage.setItem('pre_context_token', loginData.pre_context_token);
      localStorage.setItem('user', JSON.stringify(loginData.user));

      // Step 3 - Get institutes and roles
      const institutesData = await getMyInstitutesRoles();

      if (!institutesData.success) {
        setError("Not associated with any institute");
        setLoading(false);
        return;
      }

      const institutes = institutesData.data;

      // Save institutes data for next page
      localStorage.setItem('institutes', JSON.stringify(institutes));

      // Step 4 - Decide which page to go to
      if (institutes.length === 1 && institutes[0].roles.length === 1) {
        // Only 1 institute and 1 role → go directly to dashboard
        localStorage.setItem('selected_institute', JSON.stringify(institutes[0]));
        localStorage.setItem('selected_role', JSON.stringify(institutes[0].roles[0]));
        setPage("home");
      } else if (institutes.length === 1 && institutes[0].roles.length > 1) {
        // 1 institute but multiple roles → go to role selection
        localStorage.setItem('selected_institute', JSON.stringify(institutes[0]));
        setPage("rolea");
      } else {
        // Multiple institutes → go to institute selection
        setPage("instuteb");
      }

    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }

    setLoading(false);
  };

  return (
    <div className={`login-container ${isDark ? "dark-theme" : ""}`}>
      <div className="top-right-actions">
        <div className="icon-btn">
          <FiAlertTriangle />
        </div>

        <div className="icon-btn" onClick={() => setIsDark(!isDark)}>
          {isDark ? <FiSun /> : <FiMoon />}
        </div>
      </div>

      <div className="login-card">
        <div className="logo-section">
          <div className="brand-header">
            <img src={logo} alt="MentrixOS Logo" className="main-logo" />
            <h1 className="brand-name">
              Mentrix<span>OS</span>
            </h1>
          </div>

          <div className="tagline">
            <p className="brand-formula">
              <strong>MentrixOS</strong> =
              <span className="orange"> Mentor </span> +
              <strong> Matrix </strong> +
              <span className="blue"> Metrics</span>
            </p>

            <p className="sub-description">
              combined into one <strong>Operating System</strong> for your
              institute
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="form-content">
          <div className="input-wrapper">
            <input
              type="text"
              className="styled-input"
              placeholder="Enter phone or email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-wrapper password-container">
            <input
              type={showPassword ? "text" : "password"}
              className="styled-input"
              placeholder="..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEye /> : <FiEyeOff />}
            </div>
          </div>

          <div className="links-row">
            <a href="#" className="forgot-pw">
              Forgot Password
            </a>
          </div>

          {error && <div className="error-text">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <TailSpin
                height="22"
                width="22"
                color="#fff"
                ariaLabel="loading"
              />
            ) : (
              "Continue"
            )}
          </button>
        </form>
      </div>

      <div className="ts">
        By continuing, you agree to our
        <a href="#"> Terms & Privacy Policy</a>
      </div>
    </div>
  );
}

export default Login;
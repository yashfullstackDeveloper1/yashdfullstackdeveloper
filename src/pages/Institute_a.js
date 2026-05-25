import React from "react";
import "./Institute_a.css";
import logo from "../assets/logo.png";
import raisoni from "../assets/raisoni.png";
import gnite from "../assets/gnit.jpg";
import jd from "../assets/jd.png";
import { FiMapPin, FiChevronRight } from "react-icons/fi";

function Institute({ setPage }) {
  return (
    <div className="inst-main-container">
      {/* Top Navigation */}
      <header className="inst-header-nav">
        <div className="inst-brand">
          <img src={logo} alt="MentrixOS" className="inst-brand-logo" />
          <span className="inst-brand-name">MentrixOS</span>
        </div>
        <div className="inst-user-avatar">YD</div>
      </header>

      {/* Main Content */}
      <div className="inst-content-box">
        <div className="inst-header-text">
          <h2>Hi, Yash ! <span role="img" aria-label="wave">👋</span></h2>
          <p>Select your institute to access your personalized dashboard</p>
        </div>
        <div className="inst-card-list">
          <div className="inst-card" onClick={() => setPage("Mainrolea")}>
            <div className="inst-card-left">
              <div className="inst-card-logo">
                <img src={raisoni} alt="GH Raisoni College" />
              </div>
              <div className="inst-card-info">
                <h4>GH Raisoni College</h4>
                <p><FiMapPin className="inst-pin-icon" /> Nagpur</p>
              </div>
            </div>
            <div className="inst-card-right">
              <span>School</span>
              <button className="inst-chevron-btn">
                <FiChevronRight />
              </button>
            </div>
          </div>

          <div className="inst-card" onClick={() => setPage("Mainroleb")}>
            <div className="inst-card-left">
              <div className="inst-card-logo">
                <img src={gnite} alt="GNIET Nagpur" />
              </div>
              <div className="inst-card-info">
                <h4>GNIET Nagpur</h4>
                <p><FiMapPin className="inst-pin-icon" /> Nagpur</p>
              </div>
            </div>
            <div className="inst-card-right">
              <span>School</span>
              <button className="inst-chevron-btn">
                <FiChevronRight />
              </button>
            </div>
          </div>

          <div className="inst-card" onClick={() => setPage("Mainrolec")}>
            <div className="inst-card-left">
              <div className="inst-card-logo">
                <img src={jd} alt="JD College" />
              </div>
              <div className="inst-card-info">
                <h4>JD College</h4>
                <p><FiMapPin className="inst-pin-icon" /> Nagpur</p>
              </div>
            </div>
            <div className="inst-card-right">
              <span>School</span>
              <button className="inst-chevron-btn">
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>

        <div className="inst-footer">
          <p>Can't find your Institute? Contact your institute administrator<br />
            or email us at <a href="mailto:support@mentrixos.com">support@mentrixos.com</a></p>
        </div>
      </div>
    </div>
  );
}

export default Institute;
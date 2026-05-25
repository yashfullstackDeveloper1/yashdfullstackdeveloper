import React from "react";
import "./RoleSelection.css";
import logo from "../assets/logo.png";
import { FiChevronRight } from "react-icons/fi";

import { Shield, User, GraduationCap, ArrowLeft } from "lucide-react";

function InstituteOne({ setPage }) {
  return (
    <div className="role-main-container">
      {/* Top Navigation */}
      <header className="role-header-nav">
        <div className="role-brand">
          <img src={logo} alt="MentrixOS" className="role-brand-logo" />
          <span className="role-brand-name">MentrixOS</span>
        </div>
        <div className="role-user-avatar">YD</div>
      </header>

      {/* Main Content */}
      <div className="role-content-box">
        <button onClick={() => setPage("instuteb")} className="role-change-inst">
          <ArrowLeft /> Change Institute
        </button>

        <div className="role-header-text">
          <h2>Choose Your Role</h2>
          <p>Select how you'd like to access GH Raisoni College</p>
        </div>

        <div className="role-card-list">
          {/* Admin Card */}
          <div className="role-card" onClick={() => setPage("DashboardAOneSecond")}>
            <div className="role-card-left">
              <div className="role-card-icon" style={{ color: "#2563eb" }}>
                <Shield />
              </div>
              <div className="role-card-info">
                <h4>Admin</h4>
                <p>Platform Access</p>
              </div>
            </div>
            <div className="role-card-right">
              <button className="role-chevron-btn">
                <FiChevronRight />
              </button>
            </div>
          </div>

          {/* Student Card */}
          <div className="role-card" onClick={() => setPage("DashboardBOneSecond")}>
            <div className="role-card-left">
              <div className="role-card-icon" style={{ color: "#2563eb" }}>
                <User />
              </div>
              <div className="role-card-info">
                <h4>Student</h4>
                <p>Platform Access</p>
              </div>
            </div>
            <div className="role-card-right">
              <button className="role-chevron-btn">
                <FiChevronRight />
              </button>
            </div>
          </div>

          {/* Trainer Card */}
          <div className="role-card" onClick={() => setPage("DashboardCOneSecond")}>
            <div className="role-card-left">
              <div className="role-card-icon" style={{ color: "#2563eb" }}>
                <GraduationCap />
              </div>
              <div className="role-card-info">
                <h4>Trainer</h4>
                <p>Platform Access</p>
              </div>
            </div>
            <div className="role-card-right">
              <button className="role-chevron-btn">
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="policy-footer">
          <p>Can't find your role? Contact your institute administrator<br />
            or email us at <a href="mailto:support@mentrixos.com">support@mentrixos.com</a></p>
        </div>
      </div>
    </div>
  );
}
export default InstituteOne;

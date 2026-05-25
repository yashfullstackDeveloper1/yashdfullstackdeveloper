import React from "react";
import "./RoleSelection.css";
import logo from "../assets/logo.png";
import { FiChevronRight } from "react-icons/fi";
import { Shield, GraduationCap, ArrowLeft } from "lucide-react";

function RoleB({ setPage }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const selectedInstitute = JSON.parse(localStorage.getItem('selected_institute') || '{}');
  const institutes = JSON.parse(localStorage.getItem('institutes') || '[]');

  // Get roles for selected institute
  const currentInstitute = institutes.find(
    inst => String(inst.institute_id) === String(selectedInstitute.institute_id)
  ) || selectedInstitute;

  const roles = currentInstitute.roles || [];

  const handleRoleSelect = (role) => {
    localStorage.setItem('selected_role', JSON.stringify(role));
    if (role.role_name === 'Trainer') {
      setPage("Maindashboardb");
    } else {
      setPage("Maindashboarda");
    }
  };

  return (
    <div className="role-main-container">
      <header className="role-header-nav">
        <div className="role-brand">
          <img src={logo} alt="MentrixOS" className="role-brand-logo" />
          <span className="role-brand-name">MentrixOS</span>
        </div>
        <div className="role-user-avatar">
          {user.full_name ? user.full_name.charAt(0) : 'U'}
        </div>
      </header>

      <div className="role-content-box">
        <button onClick={() => setPage("instuteb")} className="role-change-inst">
          <ArrowLeft /> Change Institute
        </button>

        <div className="role-header-text">
          <h2>Choose Your Role</h2>
          <p>Select how you'd like to access {selectedInstitute.institute_name || 'your institute'}</p>
        </div>

        <div className="role-card-list">
          {roles.length === 0 && (
            <p style={{ textAlign: 'center', color: 'gray' }}>No roles found!</p>
          )}
          {roles.map((role) => (
            <div
              key={role.role_id}
              className="role-card"
              onClick={() => handleRoleSelect(role)}
            >
              <div className="role-card-left">
                <div className="role-card-icon" style={{ color: role.role_name === 'Trainer' ? '#0284c7' : '#0f766e' }}>
                  {role.role_name === 'Trainer' ? <GraduationCap /> : <Shield />}
                </div>
                <div className="role-card-info">
                  <h4>{role.role_name}</h4>
                  <p>Platform Access</p>
                </div>
              </div>
              <div className="role-card-right">
                <button className="role-chevron-btn">
                  <FiChevronRight />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="policy-footer">
          <p>Can't find your role? Contact your institute administrator<br />
            or email us at <a href="mailto:support@mentrixos.com">support@mentrixos.com</a></p>
        </div>
      </div>
    </div>
  );
}

export default RoleB;
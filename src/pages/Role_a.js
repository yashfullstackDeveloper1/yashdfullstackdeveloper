import React from "react";
import "./RoleSelection.css";
import logo from "../assets/logo.png";
import { FiChevronRight } from "react-icons/fi";
import { Shield, GraduationCap, ArrowLeft, Users } from "lucide-react";

function RoleA({ setPage }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const selectedInstitute = JSON.parse(localStorage.getItem('selected_institute') || '{}');
  const institutes = JSON.parse(localStorage.getItem('institutes') || '[]');

  const currentInstitute = institutes.find(
    inst => String(inst.institute_id) === String(selectedInstitute.institute_id)
  ) || selectedInstitute;

  const roles = currentInstitute.roles || [];
  const hasMultipleInstitutes = institutes.length > 1;

  const handleRoleSelect = (role) => {
    localStorage.setItem('selected_role', JSON.stringify(role));

    if (hasMultipleInstitutes) {
      // yashd flow
      if (role.role_name === 'Trainer') {
        setPage("Maindashboardb");
      } else if (role.role_name === 'Student') {
        setPage("DashboardBOneSecond");
      } else {
        setPage("Maindashboarda");
      }
    } else {
      // divyanshu flow
      if (role.role_name === 'Trainer') {
        setPage("DevaB");
      } else {
        setPage("DevaA");
      }
    }
  };

  const getRoleIcon = (roleName) => {
    if (roleName === 'Trainer') return <GraduationCap />;
    if (roleName === 'Student') return <Users />;
    return <Shield />;
  };

  const getRoleColor = (roleName) => {
    if (roleName === 'Trainer') return '#0284c7';
    if (roleName === 'Student') return '#7c3aed';
    return '#0f766e';
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
        <button
          onClick={() => hasMultipleInstitutes ? setPage("instuteb") : setPage("login")}
          className="role-change-inst"
        >
          <ArrowLeft /> {hasMultipleInstitutes ? 'Change Institute' : 'Back'}
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
                <div className="role-card-icon" style={{ color: getRoleColor(role.role_name) }}>
                  {getRoleIcon(role.role_name)}
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

        <div className="role-footer">
          <p>Can't find your role? Contact your institute administrator<br />
            or email us at <a href="mailto:support@mentrixos.com">support@mentrixos.com</a></p>
        </div>
      </div>
    </div>
  );
}

export default RoleA;
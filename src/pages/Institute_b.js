import React, { useState } from "react";
import "./Institute_b.css";
import logo from "../assets/logo.png";
import { FiMapPin, FiSearch, FiChevronRight } from "react-icons/fi";

function Institute({ setPage }) {
  const [search, setSearch] = useState("");

  // Read institutes from localStorage (saved during login)
  const institutesData = JSON.parse(localStorage.getItem('institutes') || '[]');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const filtered = institutesData.filter((inst) =>
    inst.institute_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleInstituteSelect = (inst) => {
    localStorage.setItem('selected_institute', JSON.stringify(inst));

    if (inst.roles.length === 1) {
      localStorage.setItem('selected_role', JSON.stringify(inst.roles[0]));
      setPage("home");
    } else {
      if (institutesData.length > 2) {
        // yashd → 5 institutes → rolea
        setPage("rolea");
      } else {
        // ayushl → 2 institutes → roleb
        setPage("roleb");
      }
    }
  };
  return (
    <div className="inst-main-container">
      {/* Top Navigation */}
      <header className="inst-header-nav">
        <div className="inst-brand">
          <img src={logo} alt="MentrixOS" className="inst-brand-logo" />
          <span className="inst-brand-name">MentrixOS</span>
        </div>
        <div className="inst-user-avatar">
          {user.full_name ? user.full_name.charAt(0) : 'U'}
        </div>
      </header>

      {/* Main Content */}
      <div className="inst-content-box">
        <div className="inst-header-text">
          <h2>Hi, {user.full_name ? user.full_name.split(' ')[0] : 'User'} ! 👋</h2>
          <p>Select your institute to access your personalized dashboard</p>
        </div>

        <div className="inst-search-container">
          <FiSearch className="inst-search-icon" />
          <input
            type="text"
            className="inst-search-input"
            placeholder="Search your institute"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="inst-card-list">
          {filtered.length === 0 && (
            <p style={{ textAlign: 'center', color: 'gray' }}>
              No institutes found!
            </p>
          )}
          {filtered.map((inst) => (
            <div
              key={inst.institute_id}
              className="inst-card"
              onClick={() => handleInstituteSelect(inst)}
            >
              <div className="inst-card-left">

                {/* LOGO UPDATED HERE */}
                <div className="inst-card-logo">
                  {inst.institute_image ? (
                    <img
                      src={inst.institute_image}
                      alt={inst.institute_name}
                      style={{
                        width: '40px',
                        height: '40px',
                        objectFit: 'contain',
                        borderRadius: '8px'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <span style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#1a73e8',
                    display: inst.institute_image ? 'none' : 'block'
                  }}>
                    {inst.institute_name.charAt(0)}
                  </span>
                </div>

                <div className="inst-card-info">
                  <h4>{inst.institute_name}</h4>
                  <p><FiMapPin className="inst-pin-icon" /> Nagpur</p>
                </div>
              </div>
              <div className="inst-card-right">
                <span>{inst.roles.length} Role{inst.roles.length > 1 ? 's' : ''}</span>
                <button className="inst-chevron-btn">
                  <FiChevronRight />
                </button>
              </div>
            </div>
          ))}
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
import React from "react";
import "./Role_a_dashboard.css";
import logo from "../assets/logo.png";

function Role_a_dashboard({ setPage }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const selectedInstitute = JSON.parse(localStorage.getItem('selected_institute') || '{}');

  const avatarText = user.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'YD';

  const stats = [
    { count: "08", label: "Active Institutes", description: "Institutes actively operating and using the platform for daily management", colorClass: "blue-card" },
    { count: "03", label: "Inactive Institutes", description: "Institutes currently inactive and not participating in system operations", colorClass: "green-card" },
    { count: "15+", label: "Total Modules", description: "Complete set of features enabling academic and administrative workflows", colorClass: "orange-card" },
    { count: "50+", label: "Total Users", description: "All registered users across institutes using the platform services", colorClass: "purple-card" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    setPage("login");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo-section">
          <span className="logo-icon">
            <img src={logo} alt="MentrixOS Logo" className="main-logo" />
          </span>
          <h1 className="brand-name">MentrixOS</h1>
        </div>
        <div className="user-controls">
          <span className="location-text">{selectedInstitute.institute_name || 'MentrixOS'}</span>
          <div className="user-avatar">{avatarText}</div>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>
      <main className="dashboard-content">
        <section className="welcome-section">
          <h1>Hey {user.full_name || 'User'} 👋</h1>
          <h2>Welcome to MentrixOS Admin Panel!</h2>
        </section>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className={`stat-card ${stat.colorClass}`}>
              <h3 className="stat-count">{stat.count}</h3>
              <h4 className="stat-label">{stat.label}</h4>
              <p className="stat-description">{stat.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Role_a_dashboard;
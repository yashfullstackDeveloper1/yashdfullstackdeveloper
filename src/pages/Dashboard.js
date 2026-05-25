import React from "react";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="main">
      <div className="header">
        <div className="header-left">
          <div className="menu-box">
            <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#374151">
              <path d="M120-240v-80h240v80H120Zm0-200v-80h480v80H120Zm0-200v-80h720v80H120Z"/>
            </svg>
          </div>

          <h2 className="logo">
           <span>Dashboard</span>
          </h2>
        </div>

        <div className="profile">YD</div>
      </div>

      <div className="content">
        <h1 className="title">
          Welcome to Dashboard
        </h1>
        <p className="subtitle">Yash Dhapke Panel !</p>

        <div className="cards">

          <div className="card blue">
            <h1>01</h1>
            <h3>Username :- <span className="text">Yash Dhapke</span></h3>
            <p>E-mail :- <span className="text">y@gmail.com</span></p>
          </div>

          <div className="card green">
             <h1>02</h1>
            <h3>Username :- <span className="text">Rohit Sharma</span></h3>
            <p>E-mail :- <span className="text">Rohit@gmail.com</span></p>
          </div>

          <div className="card yellow">
             <h1>03</h1>
            <h3>Username :- <span className="text">Vicky sing</span></h3>
            <p>E-mail :- <span className="text">Vicky@gmail.com</span></p>
          </div>

          <div className="card purple">
             <h1>01</h1>
            <h3>Username :- <span className="text">Sora</span></h3>
            <p>E-mail :- <span className="text">Sora@gmail.com</span></p>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Dashboard;
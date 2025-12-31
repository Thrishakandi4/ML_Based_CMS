import React from "react";
import './WelcomePage.css';

const WelcomePage = ({ onLoginClick, onSignupClick }) => {
  return (
    <div className="welcome-container">
      <nav className="welcome-navbar">
        <div className="navbar-content">
          <span className="navbar-title">ML Based Complaint Management System</span>
          <div className="navbar-buttons">
            <button className="welcome-btn" onClick={onLoginClick}>Login</button>
            <button className="welcome-btn" onClick={onSignupClick}>Signup</button>
          </div>
        </div>
      </nav>
      <div className="welcome-main">
        <div className="welcome-left">
          <video autoPlay loop muted className="side-video">
            <source src="/background.mp4.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="welcome-right">
          <div className="welcome-content">
            <h1 className="welcome-heading">Welcome to ML Based CMS</h1>
             
            <p className="welcome-description">
            
Raise complaints, stay informed, and get instant updates.<br/>
Designed for clarity, speed, and reliability.<br/>
              
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;

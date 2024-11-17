import React from 'react';
import './settings.css';
import { Link } from "react-router-dom";
import nameIcon from './icon/name.png';
import notifIcon from './icon/notif.png';
import moduleIcon from './icon/module.png';
import dashboardIcon from './icon/dashboard.png';
import settingsIcon from './icon/settings.png';
import helpIcon from './icon/help.png';
import logoIcon from './icon/logo.png';

const SidebarItem = ({ icon, text, link }) => (
  <li>
    <img src={icon} alt={`${text} Icon`} width="30%" height="30%" />
    <a href={link}>{text}</a>
  </li>
);

const Settings = () => {
  return (
    <div>
      <header className="header">
        <div className="header-content">
          <div className="header-logo">
            <img src={logoIcon} alt="logo" />
          </div>
        </div>
      </header>
      <nav className="sidebar">
        <ul>
          <li>
            <img src={nameIcon} alt="Name icon" className="sidebar-icon" />
            <Link to="/">Name</Link>
          </li>
          <li>
            <img src={moduleIcon} alt="Module icon" className="sidebar-icon" />
            <Link to="/module">Module</Link>
          </li>
          <li>
            <img src={dashboardIcon} alt="dashboard icon" className="sidebar-icon" />
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <img src={settingsIcon} alt="Settings icon" className="sidebar-icon" />
            <Link to="/settings">Settings</Link>
          </li>
          <li>
            <img src={helpIcon} alt="Help icon" className="sidebar-icon" />
            <Link to="/help">Help</Link>
          </li>
        </ul>
      </nav>
      <div className="settings-container">
        <div className="settings-section">
          {/* General Section */}
          <div className="sec-box">
            <h2>General</h2>
            <div className="row">
              <div className="profile-image">
                {/* Removed icon */}
              </div>
              <div style={{ flexGrow: 1 }}>
                <div className="row">
                  <label>Full Name</label>
                  <input type="text" placeholder="Enter full name" />
                </div>
                <div className="row">
                  <label>Birthdate</label>
                  <input type="text" placeholder="Enter birthdate" />
                </div>
                <div className="row">
                  <label>Email</label>
                  <input type="text" placeholder="Enter email" />
                </div>
                <div className="row">
                  <label>Program</label>
                  <input type="text" placeholder="Enter program" />
                </div>
              </div>
            </div>
          </div>
          {/* Login Info Section */}
          <div className="sec-box">
            <h2>Login Info</h2>
            <div className="row">
              <label>Username</label>
              <input type="text" placeholder="Enter username" />
            </div>
            <div className="row">
              <label>Password</label>
              <input type="password" placeholder="Enter password" />
            </div>
          </div>
          {/* Settings Section (added content) */}
          <div className="settings-section">
            <div className="general-info">
              {/* General Info Content */}
            </div>
            <div className="login-info">
              {/* Login Info Content */}
            </div>
            <div className="submit-button-container">
  <button type="submit" className="submit-button">Submit</button>
</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

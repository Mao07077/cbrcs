import React, { useEffect, useState } from 'react';
import './Header.css';
import nameIcon from '../icon/name.png';
import moduleIcon from '../icon/module.png';
import dashboardIcon from '../icon/dashboard.png';
import Request from '../icon/request.png';
import helpIcon from '../icon/help.png';
import logoIcon from '../icon/logo.png';
import { useLinkClickHandler } from 'react-router-dom';
const SidebarItem = ({ icon, text, onClick }) => (
    <li>
      <button className="sidebar-item" onClick={onClick}>
        <img src={icon} alt={text} className="sidebar-icon" />
        <span>{text}</span>
      </button>
    </li>
  );
  
  const Header = () => {
    // Define the navigation handler
    const handleNavigation = (route) => {
      console.log(`Navigating to: ${route}`);
      // Example for navigation:
      // If using React Router, use navigate(route)
      window.location.href = `/${route}`; // Fallback for simple routing
    };
    return (
        <div className='Main_Header'>
        <header className="header">
            <div className="header-content">
                <div className="header-logo">
                    <img src={logoIcon} alt="logo" />
                </div>
            </div>
            <nav className="Sidebar">
      <ul>
        <li>
          <buttonss className="Sidebar-item" onClick={() => handleNavigation('profile')}>
            <img src={nameIcon} alt="Name Icon" className="sidebar-icon" />
            <span>Profile</span>
          </buttonss>
        </li>
        <li>
          <buttonss className="Sidebar-item" onClick={() => handleNavigation('module')}>
            <img src={moduleIcon} alt="Module Icon" className="sidebar-icon" />
            <span>Module</span>
          </buttonss>
        </li>
        <li>
          <buttonss className="Sidebar-item" onClick={() => handleNavigation('dashboard')}>
            <img src={dashboardIcon} alt="Dashboard Icon" className="sidebar-icon" />
            <span>Dashboard</span>
          </buttonss>
        </li>
        <li>
          <buttonss className="Sidebar-item" onClick={() => handleNavigation('settings')}>
            <img src={Request} alt="Request Icon" className="sidebar-icon" />
            <span>Request</span>
          </buttonss>
        </li>
        <li>
          <buttonss className="Sidebar-item" onClick={() => handleNavigation('help')}>
            <img src={helpIcon} alt="Help Icon" className="sidebar-icon" />
            <span>Help</span>
          </buttonss>
        </li>
      </ul>
    </nav>  

        </header>
        </div>
    );
};

export default Header;
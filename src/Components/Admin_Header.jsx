 
import React, { useState, useEffect } from 'react';
import './Admin_Header.css';
import { Link } from "react-router-dom";

import Dashboard from '../icon/dashboard.png'; 
import Accounts from '../icon/name.png';
import Report from '../icon/Reports.png';
import AdminPost from '../icon/Upload.png';
import Request from '../icon/request.png';
import logoIcon from '../icon/logo.png';

const SidebarItem = ({ icon, text, onClick }) => (
  <li>
    <button className="sidebar-item" onClick={onClick}>
      <img src={icon} alt={text} className="sidebar-icon" />
      <span>{text}</span>
    </button>
  </li>
);

const AdminHeader = () => {
  const handleNavigation = (route) => {
    console.log(`Navigating to: ${route}`);
    window.location.href = `/${route}`; 
  };
  return (
      <div className='Main_Header'>
      <header className="header">
          <div className="header-content">
              <div className="header-logo">
                  <img src={logoIcon} alt="logo" />
              </div>

          </div>

          <div className="header-logout">
        <button onClick={() => handleNavigation('login')}>Logout</button>
      </div>
    </header>
    <div className='Main_Header'></div>
          <nav className="Sidebar">
    <ul>
      <li>
        <buttonss className="Sidebar-item" onClick={() => handleNavigation('Admin_Dashboard')}>
          <img src={Dashboard} alt="Dashboard Icon" className="sidebar-icon" />
          <span>Dashboard</span>
        </buttonss>
      </li>
      <li>
        <buttonss className="Sidebar-item" onClick={() => handleNavigation('Accounts')}>
          <img src={Accounts} alt="Accounts Icon" className="sidebar-icon" />
          <span>Accounts</span>
        </buttonss>
      </li>
      <li>
        <buttonss className="Sidebar-item" onClick={() => handleNavigation('Adminpost')}>
          <img src={AdminPost} alt="AdminPost Icon" className="sidebar-icon" />
          <span>Upload</span>
        </buttonss>
      </li>
      <li>
        <buttonss className="Sidebar-item" onClick={() => handleNavigation('Report')}>
          <img src={Report} alt="Report Icon" className="sidebar-icon" />
          <span>Reports</span>
        </buttonss>
      </li>
      <li>
        <buttonss className="Sidebar-item" onClick={() => handleNavigation('Request')}>
          <img src={Request} alt="Request Icon" className="sidebar-icon" />
          <span>Request</span>
        </buttonss>
      </li>
    </ul>
  </nav>  

      
      </div>
  );
};

export default AdminHeader;
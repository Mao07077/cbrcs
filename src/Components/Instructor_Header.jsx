 
import React, { useState, useEffect } from 'react';
import './Instructor_Header.css';
import Dashboard from '../icon/dashboard.png'; 
import MailIcon from '../icon/Mail.png';
import StudentsIcon from '../icon/Students.png';
import logoIcon from '../icon/logo.png';


 
const SidebarItem = ({ icon, text, onClick }) => (
  <li>
    <button className="sidebar-item" onClick={onClick}>
      <img src={icon} alt={text} className="sidebar-icon" />
      <span>{text}</span>
    </button>
  </li>
);

const InstructorHeader = () => {
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
        <buttonss className="Sidebar-item" onClick={() => handleNavigation('Instructor_Dashboard')}>
          <img src={Dashboard} alt="Dashboard Icon" className="sidebar-icon" />
          <span>Dashboard</span>
        </buttonss>
      </li>
      <li>
        <buttonss className="Sidebar-item" onClick={() => handleNavigation('mail')}>
          <img src={MailIcon} alt="Mail Icon" className="sidebar-icon" />
          <span>Mail</span>
        </buttonss>
      </li>
      <li>
        <buttonss className="Sidebar-item" onClick={() => handleNavigation('studentlist')}>
          <img src={StudentsIcon} alt="Students Icon" className="sidebar-icon" />
          <span>StudentList</span>
        </buttonss>
      </li>
      <li>
        <buttonss className="Sidebar-item" onClick={() => handleNavigation('ModuleList')}>
          <img src={StudentsIcon} alt="Students Icon" className="sidebar-icon" />
          <span>StudentList</span>
        </buttonss>
      </li>
    </ul>
  </nav>  

      </header>
      </div>
      );
};

export default InstructorHeader;
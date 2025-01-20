 
import React, { NavDropdown, Nav, Navbar, useState, useEffect } from 'react';
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
  const handleNavigation = (route) => {
    console.log(`Navigating to: ${route}`);
  
    window.location.href = `/${route}`;
  };
  return (
    <>  <header className="header">
    <div className="header-content">
        <div className="header-logo">
            <img src={logoIcon} alt="logo" />
        </div>
        
    </div>
    <div className="header-logout">
        <button onClick={() => handleNavigation('login')}>Logout</button>
      </div>
    </header>
      <div className='Main_Header'>
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
          <span>Module</span>
        </buttonss>
      </li>
    </ul>
  </nav>  
      </div>
      </>
      );
};

export default InstructorHeader;
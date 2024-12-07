 
import React, { useState, useEffect } from 'react';
import './Instructor_Header.css';
import { Link } from "react-router-dom";

import Dashboard from './dashboard.png'; 
import MailIcon from './Mail.png';
import StudentsIcon from './Students.png';
 
 
import logoIcon from './logo.png';

 
const InstructorHeader = () => {
    return (
        <header className="header">
            <div className="header-content">
                <div className="header-logo">
                    <img src={logoIcon} alt="logo" />
                </div>
            </div>
            <nav className="sidebar">
      <ul>
        <li>
          <img src={Dashboard} alt="Dashboard icon" className="Dashboard-icon" />
          <Link to="/Instructor_Dashboard">Dashboard</Link>
        </li>
        <li>
          <img src={MailIcon} alt="Mail icon" className="sidebar-icon" />
          <Link to="/mail">Mail</Link>
        </li>
        <li>
          <img src={StudentsIcon} alt="Students icon" className="sidebar-icon" />
          <Link to="/Studentlist">Students</Link>
        </li>
         
      </ul>
    </nav>
        </header>
    );
};

export default InstructorHeader;
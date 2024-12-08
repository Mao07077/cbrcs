 
import React, { useState, useEffect } from 'react';
import './Admin_Header.css';
import { Link } from "react-router-dom";

import Dashboard from './dashboard.png'; 
import Accounts from './name.png';
import Report from './Reports.png';
import AdminPost from './Upload.png';
import Request from './request.png';
 
 
import logoIcon from './logo.png';

 
const AdminHeader = () => {
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
          <Link to="/Admin_Dashboard">Dashboard</Link>
        </li>
        <li>
          <img src={Accounts} alt="Accounts Icon" className="sidebar-icon" />
          <Link to="/Accounts">Accounts</Link>
        </li>
        <li>
          <img src={AdminPost} alt="Upload icon" className="sidebar-icon" />
          <Link to="/Adminpost">Upload</Link>
        </li>
        <li>
          <img src={Report} alt="Reports icon" className="sidebar-icon" />
          <Link to="/Reports">Reports</Link>
        </li>
        <li>
          <img src={Request} alt="Request icon" className="sidebar-icon" />
          <Link to="/Request">Request</Link>
        </li>
         
      </ul>
    </nav>
        </header>
    );
};

export default AdminHeader;
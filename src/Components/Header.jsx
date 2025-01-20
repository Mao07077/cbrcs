import React, { useEffect, useState } from 'react';
import './Header.css';
import logoIcon from '../icon/logo.png';
import nameIcon from '../icon/name.png';
import moduleIcon from '../icon/module.png';
import dashboardIcon from '../icon/dashboard.png';
import Request from '../icon/request.png';
import helpIcon  from '../icon/help.png';
const SidebarItem = ({ icon, text, onClick }) => (
    <li>
      <button className="sidebar-item" onClick={onClick}>
        <img src={icon} alt={text} className="sidebar-icon" />
        <span>{text}</span>
      </button>
    </li>
  );
  
  const Header = () => {
    
    const handleNavigation = (route) => {
      console.log(`Navigating to: ${route}`);
      window.location.href = `/${route}`; 
    };
    return (
        <><header className="header">
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
 </div>   
        </>

    );
};

export default Header;
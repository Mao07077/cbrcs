import React, { useEffect, useState } from 'react';
import './Header.css';
import logoIcon from '../icon/logo.png';
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
        <div className='Main_Header'>
        <header className="header">
            <div className="header-content">
                <div className="header-logo">
                    <img src={logoIcon} alt="logo" />
                </div>
            </div>

        </header>
        </div>
    );
};

export default Header;
import React, { useEffect, useState } from 'react';
import './Header.css';
import nameIcon from '../icon/name.png';
import moduleIcon from '../icon/module.png';
import dashboardIcon from '../icon/dashboard.png';
import Request from '../icon/request.png';
import helpIcon from '../icon/help.png';
import logoIcon from '../icon/logo.png';
const SidebarItem = ({ icon, text, link }) => (
    <li>
        <a href={link}>
            <img src={icon} alt={text} />
            {text}
        </a>
    </li>
);

const Header = () => {
    return (
        <div className='Main_Header'>
        <header className="header">
            <div className="header-content">
                <div className="header-logo">
                    <img src={logoIcon} alt="logo" />
                </div>
            </div>
            <nav className="sidebar">
    <ul>
        <button className="sidebar-item" onClick={() => navigateTo('profile')}>
            <img src={nameIcon} alt="Name Icon" />
            <span>Name</span>
        </button>
        <button className="sidebar-item" onClick={() => navigateTo('module')}>
            <img src={moduleIcon} alt="Module Icon" />
            <span>Module</span>
        </button>
        <button className="sidebar-item" onClick={() => navigateTo('dashboard')}>
            <img src={dashboardIcon} alt="Dashboard Icon" />
            <span>Dashboard</span>
        </button>
        <button className="sidebar-item" onClick={() => navigateTo('settings')}>
            <img src={Request} alt="Request Icon" />
            <span>Request</span>
        </button>
        <button className="sidebar-item" onClick={() => navigateTo('help')}>
            <img src={helpIcon} alt="Help Icon" />
            <span>Help</span>
        </button>
    </ul>
</nav>

        </header>
        </div>
    );
};

export default Header;
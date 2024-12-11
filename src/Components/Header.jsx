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
                    <SidebarItem icon={nameIcon} text="Name" link="profile" />
                    <SidebarItem icon={moduleIcon} text="Module" link="module" />
                    <SidebarItem icon={dashboardIcon} text="Dashboard" link="dashboard" />
                    <SidebarItem icon={Request} text="Request" link="settings" />
                    <SidebarItem icon={helpIcon} text="Help" link="help" />
                </ul>
            </nav>
        </header>
        </div>
    );
};

export default Header;
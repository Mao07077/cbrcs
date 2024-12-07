import React, { useEffect, useState } from 'react';
import './Header.css';

import nameIcon from './name.png';
import moduleIcon from './module.png';
import dashboardIcon from './dashboard.png';
import settingsIcon from './settings.png';
import helpIcon from './help.png';
import logoIcon from './logo.png';

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
                    <SidebarItem icon={settingsIcon} text="Settings" link="settings" />
                    <SidebarItem icon={helpIcon} text="Help" link="help" />
                </ul>
            </nav>
        </header>
    );
};

export default Header;
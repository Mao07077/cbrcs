import React from 'react';
import './Settings.css';

import nameIcon from '../../icon/name.png';
import notifIcon from '../../icon/notif.png';
import moduleIcon from '../../icon/module.png';
import dashboardIcon from '../../icon/dashboard.png';
import settingsIcon from '../../icon/settings.png';
import helpIcon from '../../icon/help.png';

const SidebarItem = ({ icon, text, link }) => (
    <li>
        <img src={icon} alt={`${text} Icon`} width="30%" height="30%" />
        <a href={link}>{text}</a>
    </li>
);


const Settings = () => {
    return (
        <div>
            <header className="header">
                <h1>Logo here</h1>
                <img src={nameIcon} alt="Profile" />
                <img src={notifIcon} alt="Notifications" />
            </header>
            <nav className="sidebar">
                <ul>
                    <SidebarItem icon={nameIcon} text="Name" link="profile" />
                    <SidebarItem icon={moduleIcon} text="Module" link="module" />
                    <SidebarItem icon={dashboardIcon} text="Dashboard" link="dashboard" />
                    <SidebarItem icon={settingsIcon} text="Settings" link="settings" />
                    <SidebarItem icon={helpIcon} text="Help" link="help" />
                </ul>
            </nav>
            <div className="settings-container">
                <div className="settings-section">
                    {/* General Section */}
                    <div className="sec-box">
                        <h2>General</h2>
                        <div className="row">
                            <div className="profile-image">
                                {/* Removed icon */}
                            </div>
                            <div style={{ flexGrow: 1 }}>
                                <div className="row">
                                    <label>Full Name</label>
                                    <input type="text" placeholder="Enter full name" />
                                </div>
                                <div className="row">
                                    <label>Birthdate</label>
                                    <input type="text" placeholder="Enter birthdate" />
                                </div>
                                <div className="row">
                                    <label>Email</label>
                                    <input type="text" placeholder="Enter email" />
                                </div>
                                <div className="row">
                                    <label>Program</label>
                                    <input type="text" placeholder="Enter program" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Login Info Section */}
                    <div className="sec-box">
                        <h2>Login Info</h2>
                        <div className="row">
                            <label>Username</label>
                            <input type="text" placeholder="Enter username" />
                        </div>
                        <div className="row">
                            <label>Password</label>
                            <input type="password" placeholder="Enter password" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;

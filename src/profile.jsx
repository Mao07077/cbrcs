import React from 'react';
import './profile.css';

import nameIcon from './icon/name.png';
import notifIcon from './icon/notif.png';
import moduleIcon from './icon/module.png';
import dashboardIcon from './icon/dashboard.png';
import settingsIcon from './icon/settings.png';
import helpIcon from './icon/help.png';

const SidebarItem = ({ icon, text, link }) => (
    <li>
        <img src={icon} alt={`${text} Icon`} width="30%" height="30%" />
        <a href={link}>{text}</a>
    </li>
);


const Profile = () => {
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
            <div className="profile-container">
                <div className="settings-section">
                    <div className="profilebox" style={{ flexGrow: 1 }}>
                        <h2>Account Profile</h2>
                        <div className="row">
                            <div className="profile-image">
                                <img src={nameIcon} alt="Profile Picture" width="100%" height="100%" />
                            </div>
                            <div></div>
                        </div>
                    </div>
                    <div className="sectionholder">
                        <div className="section-box">
                            <div className="row">
                                <label>Name</label>
                            </div>
                            <div className="row">
                                <label>Age</label>
                            </div>
                            <div className="row">
                                <label>Id Number</label>
                            </div>
                            <div className="row">
                                <label>Program</label>
                            </div>
                        </div>
                        <div className="section-box">
                            <div className="row">
                                <label>Hours Activity</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
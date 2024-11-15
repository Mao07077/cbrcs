import React from 'react';
import './profile.css';

import nameIcon from './icon/name.png';
import notifIcon from './icon/notif.png';
import moduleIcon from './icon/module.png';
import dashboardIcon from './icon/dashboard.png';
import settingsIcon from './icon/settings.png';
import helpIcon from './icon/help.png';

// Define SidebarItem component
const SidebarItem = ({ icon, text, link }) => (
    <li>
        <a href={link}>
            <img src={icon} alt={text} />
            {text}
        </a>
    </li>
);

const Profile = () => { 
    return (
        <div>
            <header className="header">
                <h1>Logo here</h1>
                <div className="header-icons">
                    <img src={nameIcon} alt="Profile" />
                    <img src={notifIcon} alt="Notifications" />
                </div>
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
                <div className="header-container">
                    <h2>Account Profile</h2>
                    <div class="header-underline"></div>
                </div>

               <div className="profile-wrapper">
    <div className="profilebox">
        <div className="profile-image">
            <img src={nameIcon} alt="Profile Picture" />
        </div>
        
    </div>
    <div className="separator-line"></div>
    <div className="section-holder">
        <div className="section personal-info">
            <h3>Personal Information</h3>
            <div className="row"><label>Name</label></div>
            <div className="row"><label>Age</label></div>
            <div className="row"><label>Id Number</label></div>
            <div className="row"><label>Program</label></div>
        </div>
        <div className="section activity-info">
            <h3>Activity Information</h3>
            <div className="row"><label>Hours Activity</label></div>
        </div>
    </div>
</div>
            </div>
        </div>
    );
};

export default Profile;

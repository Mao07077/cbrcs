import React from 'react';
import './help.css';

<<<<<<< HEAD:src/help.jsx
import nameIcon from './icon/name.png';
import notifIcon from './icon/notif.png';
import moduleIcon from './icon/module.png';
import dashboardIcon from './icon/dashboard.png';
import settingsIcon from './icon/settings.png';
import helpIcon from './icon/help.png';
=======
import nameIcon from '../../icon/name.png';
import notifIcon from '../../icon/notif.png';
import moduleIcon from '../../icon/module.png';
import dashboardIcon from '../../icon/dashboard.png';
import settingsIcon from '../../icon/settings.png';
import helpIcon from '../../icon/help.png';
import logoIcon from '../../icon/logo.png';
>>>>>>> 358cb3b4 (12/05/2024):src/page/Help/Help.jsx

const SidebarItem = ({ icon, text, link }) => (
    <li>
        <img src={icon} alt={`${text} Icon`} width="30%" height="30%" />
        <a href={link}>{text}</a>
    </li>
);


const HelpPage = () => {
    return (
        <div>
           <header className="header">
        <div className="header_content">
        <div className="header_logo">
             <img src={logoIcon} alt="logo" />
              </div>
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
            <main className="help-container">
                <div className="contact-box">
                    <h2>Contact Us</h2>
                </div>
            </main>
        </div>
    );
};

export default HelpPage;

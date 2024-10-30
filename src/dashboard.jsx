import React from 'react';
import './dashboard.css';

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

const Dashboard = () => {
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
            <main className="dashboard-container">
                <section className="performance-overview">
                    <div className="progress-overview">
                        <h2>Progress Overview</h2>
                        <div className="progress-chart">
                            <p>60% Completed</p>
                        </div>
                    </div>
                    <div className="strength-weakness">
                        <div>
                            <h3>Strength</h3>
                            <p>Explanation about strengths.</p>
                        </div>
                        <div>
                            <h3>Weakness</h3>
                            <p>Explanation about weaknesses.</p>
                        </div>
                    </div>
                </section>
                <section className="progress-chart">
                    <h2>Progress Chart</h2>
                    <p>[Bar Chart Placeholder]</p>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;

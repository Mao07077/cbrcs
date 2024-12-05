import React from 'react';
import styles from'./Dashboard.module.css';

import nameIcon from '../../icon/name.png';
import moduleIcon from '../../icon/module.png';
import dashboardIcon from '../../icon/dashboard.png';
import settingsIcon from '../../icon/settings.png';
import helpIcon from '../../icon/help.png';
import logoIcon from '../../icon/logo.png';

const SidebarItem = ({ icon, text, link }) => (
    <li>
        <img src={icon} alt={`${text} Icon`} width="30%" height="30%" />
        <a href={link}>{text}</a>
    </li>
);

const Dashboard = () => {
    return (
        <main className={styles.Main_dashboard}>
            <header className="header">
            <div className={styles.header_content}>
            <div className="header_logo">
            <img src={logoIcon} alt="logo" />
            </div>
            </div>             
            </header>
            <div className={styles.Dashboardsign}>
              <h1>Dashboard</h1>
              <div className={styles.lines}>
              </div>
            </div>
            <div className={styles.sidebar_combined}>
            
            <nav className="sidebar">
                <ul>
                    <SidebarItem icon={nameIcon} text="Name" link="/Profile" />
                    <SidebarItem icon={moduleIcon} text="Module" link="/Module" />
                    <SidebarItem icon={dashboardIcon} text="Dashboard" link="/Dashboard" />
                    <SidebarItem icon={settingsIcon} text="Settings" link="/Settings" />
                    <SidebarItem icon={helpIcon} text="Help" link="/Help" />
                </ul>
            </nav>
    
            <div className={styles.dashboard_container}>
                <section className={styles.performance_overview}>
                    <div className={styles.progress_overview}>
                        <h2>Progress Overview</h2>
                        <div className={styles.progress_chart}>
                            <p>60% Completed</p>
                        </div>
                    </div>
                    <div className={styles.strength_weakness}>
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
                <section className={styles.progress_chart}>
                    <h2>Progress Chart</h2>
                    <p>[Bar Chart Placeholder]</p>
                </section>
            </div>
            </div>
        </main>
        
    );
};

export default Dashboard;

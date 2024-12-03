import React, { useEffect, useState } from 'react';
import './dashboard.css';
import axios from 'axios';

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
    const [idNumber, setIdNumber] = useState('');
    const [data, setData] = useState(null);

    useEffect(() => {
        if (idNumber) {
            // Example API request to get dashboard data for the idNumber
            axios.get(`http://localhost:8000/api/dashboard/${idNumber}`)
                .then(response => {
                    setData(response.data);
                })
                .catch(error => {
                    console.error("Error fetching dashboard data:", error);
                });
        }
    }, [idNumber]);

    const handleIdChange = (event) => {
        setIdNumber(event.target.value);
    };

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
                <section className="dashboard-data">
                    <input
                        type="text"
                        placeholder="Enter ID number"
                        value={idNumber}
                        onChange={handleIdChange}
                    />
                    {data ? (
                        <div>
                            <h2>Data for ID {idNumber}</h2>
                            {/* Render the data */}
                            <pre>{JSON.stringify(data, null, 2)}</pre>
                        </div>
                    ) : (
                        <p>Loading data...</p>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Dashboard;

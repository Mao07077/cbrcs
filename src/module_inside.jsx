import React from 'react';
import './module_inside.css';
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

const ModuleInside = () => {
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
            <div className="container">
                <main>
                    <section className="module">
                        <div className="module-header">
                            <div className="module-info">
                                <h1>Module 1</h1>
                                <h2>Module topic here</h2>
                                <p>Topic Description</p>
                            </div>
                            <div className="next-module">
                                <h3>Next module</h3>
                                <p>Module title here</p>
                                <p>Description</p>
                                <button>Proceed</button>
                            </div>
                        </div>
                    </section>
                    <section className="module-elements">
                        <h2>Module’s Elements</h2>
                        <p>Complete this module to proceed to the next module</p>
                        <div className="element">
                            <h3>Science</h3>
                            <p>Short description</p>
                            <button>View</button>
                        </div>
                        <div className="element">
                            <h3>Ready for the challenge?</h3>
                            <p>Test description here</p>
                            <button>Take test</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default ModuleInside;

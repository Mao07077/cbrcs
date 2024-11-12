import React, { useEffect, useState } from 'react';
import './module.css';
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

const ModuleDashboard = () => {
  const [modules, setModules] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/modules')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json();
        } else {
          throw new Error("Expected JSON but received non-JSON response");
        }
      })
      .then(data => setModules(data))
      .catch(error => setError(error));
  }, []);

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
      
      <div className="module-container">
        <div className="notheader-container">
          <div className="notheader">
            <h1>Modules</h1>
          </div>
        </div>
        
        <div className="instruc-container">
          <div className="instruc">
            <h2>Instructions here</h2>
          </div>
        </div>
        
        <div className="module-grid">
          {modules.length > 0 ? (
            modules.map(module => (
              <div className="module" key={module.id}>
                <h3>{module.title}</h3>
                <img src={`images/${module.image}`} alt="PDF First Page" />
                <br />
                <button className="proceed-btn">Proceed</button>
              </div>
            ))
          ) : (
            <div className="no-modules">
              <p>No modules available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ModuleDashboard;
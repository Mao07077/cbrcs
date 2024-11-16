import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    <Link to={link}>{text}</Link>
  </li>
);

const ModuleDashboard = () => {
  const [modules, setModules] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch modules from the backend
    const fetchModules = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/modules"); // Backend endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch modules");
        }
        const data = await response.json();
        setModules(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchModules();
  }, []);

  const handleProceedClick = (moduleId) => {
    if (moduleId) {
      navigate(`/module/${moduleId}`);
    } else {
      alert("This module does not have a valid ID. Please contact support.");
    }
  };

  return (
    <div>
      {/* Header Section */}
      <header className="header">
        <h1>Logo here</h1>
        <img src={nameIcon} alt="Profile" />
        <img src={notifIcon} alt="Notifications" />
      </header>

      {/* Sidebar Navigation */}
      <nav className="sidebar">
        <ul>
          <SidebarItem key="profile" icon={nameIcon} text="Name" link="/profile" />
          <SidebarItem key="module" icon={moduleIcon} text="Module" link="/module" />
          <SidebarItem key="dashboard" icon={dashboardIcon} text="Dashboard" link="/dashboard" />
          <SidebarItem key="settings" icon={settingsIcon} text="Settings" link="/settings" />
          <SidebarItem key="help" icon={helpIcon} text="Help" link="/help" />
        </ul>
      </nav>

      {/* Main Module Dashboard */}
      <div className="module-container">
        <div className="notheader">
          <h1>Modules</h1>
        </div>
        <div className="instructions">Instructions here</div>

        <div className="module-grid">
          {error ? (
            <p>{`Error: ${error}`}</p>
          ) : modules.length > 0 ? (
            modules.map((module) => (
              <div className="module" key={module._id}>
                <h3>{module.title}</h3>
                <img
                  src={`http://localhost:8000/${module.image_url}`}
                  alt={`${module.title} Image`}
                  className="module-image"
                />
                <button onClick={() => handleProceedClick(module._id)}>Proceed</button>
              </div>
            ))
          ) : (
            <p>No modules available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleDashboard;


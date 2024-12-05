import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link
import './module.css';
<<<<<<< HEAD:src/module.jsx
import nameIcon from './icon/name.png';
import notifIcon from './icon/notif.png';
import moduleIcon from './icon/module.png';
import dashboardIcon from './icon/dashboard.png';
import settingsIcon from './icon/settings.png';
import helpIcon from './icon/help.png';
import logoIcon from './icon/logo.png';
=======
import nameIcon from '../../icon/name.png';
import notifIcon from '../../icon/notif.png';
import moduleIcon from '../../icon/module.png';
import dashboardIcon from '../../icon/dashboard.png';
import settingsIcon from '../../icon/settings.png';
import helpIcon from '../../icon/help.png';
import logoIcon from '../../icon/logo.png';
>>>>>>> 358cb3b4 (12/05/2024):src/Admin_Page/Module/module.jsx

const SidebarItem = ({ icon, text, link }) => (
  <li>
    <img src={icon} alt={`${text} Icon`} width="30%" height="30%" />
    <Link to={link}>{text}</Link> {/* Use Link instead of a tag */}
  </li>
);

const ModuleDashboard = () => {
  const [modules, setModules] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    // Fetch module information from the server
    fetch('http://localhost:8000/api/modules') // Updated URL to include full path
      .then((response) => {
        if (!response.ok) {
          // If the response is not OK, throw an error
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // Check if the response is JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json();
        } else {
          throw new Error("Expected JSON but received non-JSON response");
        }
      })
      .then((data) => setModules(data))
      .catch((error) => setError(error.message)); // Display error message
  }, []);

  const handleProceedClick = (moduleId) => {
    // Navigate to ModuleInside with the selected module's ID
    navigate(`/module/${moduleId}`); // Assuming each module has a unique _id
  };

  return (
    <div>
<<<<<<< HEAD:src/module.jsx
       {/* Header */}
       <header className="header">
  <div className="header-content">
    <div className="header-logo">
=======
       <header className="header">
  <div className="header_content">
    <div className="header_logo">
>>>>>>> 358cb3b4 (12/05/2024):src/Admin_Page/Module/module.jsx
      <img src={logoIcon} alt="logo" />
    </div>
  </div>
</header>
      <nav className="sidebar">
        <ul>
          <SidebarItem icon={nameIcon} text="Name" link="/profile" />
          <SidebarItem icon={moduleIcon} text="Module" link="/module" />
          <SidebarItem icon={dashboardIcon} text="Dashboard" link="/dashboard" />
          <SidebarItem icon={settingsIcon} text="Settings" link="/settings" />
          <SidebarItem icon={helpIcon} text="Help" link="/help" />
        </ul>
      </nav>
<<<<<<< HEAD:src/module.jsx
      <div className="module-container">
=======

      {/* Main Module Dashboard */}
      <div className="module_container">
>>>>>>> 358cb3b4 (12/05/2024):src/Admin_Page/Module/module.jsx
        <div className="notheader">
          <h1>Modules</h1>
        </div>
        <div className="instructions">
          Instructions here
        </div>
        <div className="module-grid">
          {error ? (
            <p>{`Error: ${error}`}</p> // Display error if there is one
          ) : modules.length > 0 ? (
            modules.map((module) => (
              <div className="module" key={module._id}>
                <h3>{module.title}</h3>
                {/* Prepend the backend URL */}
                <img src={`http://localhost:8000/${module.image_url}`} alt="Module" />
                <br />
                <button className="proceed-btn" onClick={() => handleProceedClick(module._id)}>
                  Proceed
                </button>
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

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
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
  const [module, setModule] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    // Get the module data from the backend
    const fetchModuleData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/modules'); // Fetch modules from API
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // Assuming you want to display the first module
        if (data.length > 0) {
          setModule(data[0]); // Set the first module from the response
        } else {
          throw new Error('No module data available');
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchModuleData();
  }, []);

  const handleProceedClick = () => {
    // Navigate to ModuleInside with the module ID (or other identifier)
    navigate(`/module/${module._id}`); // Assuming each module has an _id
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!module) {
    return <div>Loading...</div>;
  }

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
          <section className="moduler">
            <div className="module-header">
              <div className="module-info">
                <h1>{module.title}</h1> {/* Displaying module title */}
                <h2>Module topic: {module.title}</h2> {/* Displaying module topic */}
                <p>Description: {module.description}</p> {/* Displaying module description */}
              </div>
              <div className="next-module">
                <h3>Next module</h3>
                <p>{module.title}</p>
                <p>{module.description}</p>
                <button onClick={handleProceedClick}>Proceed</button> {/* Handling the click */}
              </div>
            </div>
          </section>
          <section className="module-elements">
            <h2>Module’s Elements</h2>
            <p>Complete this module to proceed to the next module</p> 
            {/* Add Video Element */}
            {module.video_url && (
              <div className="element">
                <h3>Watch Video</h3>
                <video width="100%" controls>
                  <source src={`http://localhost:8000/${module.video_url}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
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


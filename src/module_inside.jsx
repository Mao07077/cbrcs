import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Ensure React Router is properly set up
import './module_inside.css';
import nameIcon from './icon/name.png';
import notifIcon from './icon/notif.png';
import moduleIcon from './icon/module.png';
import dashboardIcon from './icon/dashboard.png';
import settingsIcon from './icon/settings.png';
import helpIcon from './icon/help.png';

// Sidebar component for reusable items
const SidebarItem = ({ icon, text, link }) => (
  <li>
    <img src={icon} alt={`${text} Icon`} width="30%" height="30%" />
    <a href={link}>{text}</a>
  </li>
);

const ModuleInside = () => {
  const [module, setModule] = useState(null); // Store the module data
  const [error, setError] = useState(null); // Store any errors
  const { id } = useParams(); // Extract the module ID from the URL if available
  const navigate = useNavigate(); // Navigation hook

  useEffect(() => {
    // Fetch module data from the backend
    const fetchModuleData = async () => {
      try {
        const endpoint = id
          ? `http://localhost:8000/api/modules/${id}`
          : `http://localhost:8000/api/modules`;

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`Failed to fetch module: ${response.status}`);
        }
        const data = await response.json();

        // If fetching all modules, default to the first module
        if (!id && data.length > 0) {
          setModule(data[0]);
        } else if (id) {
          setModule(data);
        } else {
          throw new Error('No module data available.');
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchModuleData();
  }, [id]); // Re-fetch data when the ID changes

  // Error handling
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // Loading state
  if (!module) {
    return <div className="loading">Loading module data...</div>;
  }

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
          <SidebarItem icon={nameIcon} text="Name" link="/profile" />
          <SidebarItem icon={moduleIcon} text="Module" link="/module" />
          <SidebarItem icon={dashboardIcon} text="Dashboard" link="/dashboard" />
          <SidebarItem icon={settingsIcon} text="Settings" link="/settings" />
          <SidebarItem icon={helpIcon} text="Help" link="/help" />
        </ul>
      </nav>

      {/* Main Content */}
      <div className="container">
        <main>
          {/* Module Header Section */}
          <section className="moduler">
            <div className="module-header">
              <div className="module-info">
                <h1>{module.title}</h1>
                <h2>Module Topic: {module.topic || 'N/A'}</h2>
                <p>Description: {module.description || 'No description available.'}</p>
              </div>
              <div className="next-module">
                <h3>Next Module</h3>
                <p>{module.next_title || 'No next module available.'}</p>
                <p>{module.next_description || ''}</p>
                {module.next_id && (
                  <button onClick={() => navigate(`/module/${module.next_id}`)}>Proceed</button>
                )}
              </div>
            </div>
          </section>

          {/* Module Elements */}
          <section className="module-elements">
            <h2>Module’s Elements</h2>
            <p>Complete this module to proceed to the next module.</p>

            {/* Video Element */}
            {module.video_url && (
              <div className="videoelement">
                <h3>Watch Video</h3>
                <video width="100%" controls>
                  <source src={`http://localhost:8000/${module.video_url}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {/* Additional Elements */}
            <div className="element">
              <h3>Science</h3>
              <p>Short description</p>
              <button>View</button>
            </div>

            <div className="element">
              <h3>Ready for the Challenge?</h3>
              <p>Test description here</p>
              <button onClick={() => navigate(`/post-test/${module._id}`)}>Take Test</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ModuleInside;

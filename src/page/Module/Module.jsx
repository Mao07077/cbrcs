import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Styles from './module.module.css';
import Icon from '../../icon/actual.png';
import NameIcon from '../../icon/name.png';
import ModuleIcon from '../../icon/module.png';
import DashboardIcon from '../../icon/dashboard.png';
import RequestIcon from '../../icon/request.png';
import HelpIcon from '../../icon/help.png';

const SidebarItem = ({ icon, text, onClick }) => (
  <li>
    <button className="sidebar-item" onClick={onClick}>
      <img src={icon} alt={text} className="sidebar-icon" />
      <span>{text}</span>
    </button>
  </li>
);
const ModuleDashboard = () => {
  const handleNavigation = (route) => {
    console.log(`Navigating to: ${route}`);
  
    window.location.href = `/${route}`;
  };
  const [modules, setModules] = useState([]);
  const [error, setError] = useState(null);
  const [userProgram, setUserProgram] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const idNumber = localStorage.getItem("userIdNumber");
        if (!idNumber) {
          setError("User not logged in");
          return;
        }

        const response = await fetch(`http://localhost:8000/api/profile/${idNumber}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        setUserProgram(data.program || "All Programs");
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (!userProgram) return;

    const apiUrl =
      userProgram === "All Programs"
        ? "http://localhost:8000/api/modules"
        : `http://localhost:8000/api/modules?program=${encodeURIComponent(userProgram)}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setModules(data))
      .catch((error) => setError(error.message));
  }, [userProgram]);

  const handleProceedClick = (moduleId) => {
    navigate(`/module/${moduleId}`);
  };

  return (
    <div className={Styles.MainContainer}>
    <div className={Styles.Header}> 
         <div className="header-content">
             <div className="header-logo">
                 <img src={Icon} alt="logo" />
             </div>
             </div>
         </div>
      <nav className={Styles.Menu}> 
          <ul>
            <li>
              <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('profile')}>
                <img src={NameIcon} alt="Name Icon" className={Styles.Sidebar_Icon} />
                <span>Profile</span>
              </buttonss>
            </li>
            <li>
              <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('module')}>
                <img src={ModuleIcon} alt="Module Icon" className={Styles.Sidebar_Icon} />
                <span>Module</span>
              </buttonss>
            </li>
            <li>
              <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('dashboard')}>
                <img src={DashboardIcon} alt="Dashboard Icon" className={Styles.Sidebar_Icon} />
                <span>Dashboard</span>
              </buttonss>
            </li>
            <li>
              <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('Request')}>
                <img src={HelpIcon} alt="help Icon" className={Styles.Sidebar_Icon} />
                <span>Study Habits</span>
              </buttonss>
            </li>
            <li>
              <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('settings')}>
                <img src={RequestIcon} alt="Request Icon" className={Styles.Sidebar_Icon} />
                <span>Request</span>
              </buttonss>
            </li>
           
          </ul>
         </nav>
<div className={Styles.Content}>
    <div className={Styles.ModuleDashboard}>
      

      {/* Unified Module Container */}
      <div className={Styles.Module_Container}>
        {/* Study Habits Section Inside Module_Container */}
        <div className={Styles.StudyHabitsSection}>
          <h2>Your Top 3 Study Habits:</h2>
          <div className={Styles.HabitsContainer}>
            <div className={Styles.HabitCard}>Study With Friends</div>
            <div className={Styles.HabitCard}>Listen To Music</div>
            <div className={Styles.HabitCard}>Asking For Help</div>
          </div>
        </div>

        {/* Modules Section */}
        <h1>Modules</h1>
        <div className={Styles.Module_Grid}>
          {error ? (
            <p>{`Error: ${error}`}</p>
          ) : modules.length > 0 ? (
            modules.map((module) => (
              <div className={Styles.ModuleCard} key={module._id}>
                <h3>{module.title}</h3>
                <div className={Styles.ModuleImage}>
                  <img src={`http://localhost:8000/${module.image_url}`} alt="Module" />
                </div>
                <button className={Styles.ProceedBtn} onClick={() => handleProceedClick(module._id)}>
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
    </div>
</div>
  );
};

export default ModuleDashboard;

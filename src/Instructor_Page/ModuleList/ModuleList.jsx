import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Styles from "./Module.module.css";
import Icon from '../../icon/actual.png';
import CreateModule from '../Create_module/Create_module';
import Dashboard from '../../icon/dashboard.png'; 
import MailIcon from '../../icon/Mail.png';
import StudentsIcon from '../../icon/Students.png';

const SidebarItem = ({ icon, text, onClick }) => (
    <li>
      <button className="sidebar-item" onClick={onClick}>
        <img src={icon} alt={text} className="sidebar-icon" />
        <span>{text}</span>
      </button>
    </li>
  );
const ModuleList = () => {
    const handleNavigation = (route) => {
        console.log(`Navigating to: ${route}`);
      
        window.location.href = `/${route}`;
      };
    const [modules, setModules] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const userIdNumber = localStorage.getItem("userIdNumber") || "All IDs";

    useEffect(() => {
        fetch("http://localhost:8000/api/modules")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => setModules(data))
            .catch((error) => setError(error.message));
    }, []);

    const handleProceedClick = (moduleId) => {
        navigate(`/module/${moduleId}`);
    };

    const filteredModules = modules.filter((module) => module.id_number === userIdNumber);

    return (
        <div className={Styles.MainContainer}>
          <div className={Styles.Header}> 
              <div className="header-content">
                  <div className="header-logo">
                      <img src={Icon} alt="logo" />
                  </div>
                  
              </div></div>
    <nav className={Styles.Menu}> 
    <ul>
      <li>
        <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('Instructor_Dashboard')}>
          <img src={Dashboard} alt="Dashboard Icon" className={Styles.Sidebar_Icon} />
          <span>Dashboard</span>
        </buttonss>
      </li>
      <li>
        <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('mail')}>
          <img src={MailIcon} alt="Mail Icon" className={Styles.Sidebar_Icon} />
          <span>Message</span>
        </buttonss>
      </li>
      <li>
        <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('studentlist')}>
          <img src={StudentsIcon} alt="Students Icon" className={Styles.Sidebar_Icon} />
          <span>StudentList</span>
        </buttonss>
      </li>
      <li>
        <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('ModuleList')}>
          <img src={StudentsIcon} alt="Students Icon" className={Styles.Sidebar_Icon} />
          <span>Module</span>
        </buttonss>
      </li>
    </ul>
   </nav>
            <div className={Styles.Content}>
              <div className={Styles.Greeting_Dashboard}>
                      <h1>Module</h1>
                    </div>
                <h2 className={Styles.sectionTitle}>Your Top 3 Study Habits:</h2>
                <div className={Styles.HabitsContainer}>
                    <div className={Styles.HabitCard}><h3>Study With Friends</h3><p>Description Here</p></div>
                    <div className={Styles.HabitCard}><h3>Listen To Music</h3><p>Description Here</p></div>
                    <div className={Styles.HabitCard}><h3>Asking For Help</h3><p>Description Here</p></div>
                </div>
                <h1 className={Styles.moduleTitle}>Modules</h1>
                <div className={Styles.ModuleGrid}>
                    {error ? (
                        <p>{`Error: ${error}`}</p>
                    ) : filteredModules.length > 0 ? (
                        filteredModules.map((module) => (
                            <div className={Styles.moduleCard} key={module._id}>
                                <h3>{module.title}</h3>
                                <p>Topic here</p>
                                <div className={Styles.moduleImage}>Image here</div>
                                <button className={Styles.proceedBtn} onClick={() => handleProceedClick(module._id)}>Proceed</button>
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

export default ModuleList;

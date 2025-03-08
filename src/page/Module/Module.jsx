import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Styles from './module.module.css';
import Header from '../../Components/Header';

const ModuleDashboard = () => {
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
    <div className={Styles.ModuleDashboard}>
      <Header />

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
  );
};

export default ModuleDashboard;

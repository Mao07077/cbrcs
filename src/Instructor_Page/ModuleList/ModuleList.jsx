import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Styles from './Module.module.css';
import Header from '../../Components/composables/Header';
import Instructor_Sidebar from '../../Components/Instructor_Sidebar';
import Footer from '../../Components/composables/Footer';

const API_URL = "http://127.0.0.1:8000";
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : "http://127.0.0.1:8000");

const ModuleList = () => {
  const [modules, setModules] = useState([]);
  const [error, setError] = useState(null);
  const [userProgram, setUserProgram] = useState(null);
  const [moduleStatuses, setModuleStatuses] = useState({});
  const navigate = useNavigate();

  const requestHeaders = {
    'ngrok-skip-browser-warning': 'true',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const idNumber = localStorage.getItem('userIdNumber');
        if (!idNumber) {
          throw new Error('User not logged in');
        }

        const response = await fetch(`${API_URL}/api/profile/${idNumber}`, {
          method: 'GET',
          headers: requestHeaders,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user profile: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setUserProgram(data.program || 'All Programs');
      } catch (err) {
        setError(err.message);
        console.error('Profile fetch error:', err);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (!userProgram) return;

    const fetchModulesAndStatuses = async () => {
      try {
        const idNumber = localStorage.getItem('userIdNumber');
        const apiUrl =
          userProgram === 'All Programs'
            ? `${API_URL}/api/modules`
            : `${API_URL}/api/modules?program=${encodeURIComponent(userProgram)}`;

        const modulesResponse = await fetch(apiUrl, {
          method: 'GET',
          headers: requestHeaders,
        });

        if (!modulesResponse.ok) {
          throw new Error(`Failed to fetch modules: ${modulesResponse.status} ${modulesResponse.statusText}`);
        }

        const modulesData = await modulesResponse.json();
        setModules(modulesData);

        const statuses = {};
        for (const module of modulesData) {
          const statusResponse = await fetch(`${API_URL}/api/module-status/${module._id}/${idNumber}`, {
            method: 'GET',
            headers: requestHeaders,
          });

          if (statusResponse.ok) {
            statuses[module._id] = await statusResponse.json();
          } else {
            console.warn(`Failed to fetch status for module ${module._id}: ${statusResponse.status}`);
          }
        }
        setModuleStatuses(statuses);
      } catch (error) {
        setError(error.message);
        console.error('Modules fetch error:', error);
      }
    };

    fetchModulesAndStatuses();
  }, [userProgram]);

  const handleProceedClick = (moduleId) => {
    navigate(`/module/${moduleId}`);
  };

  return (
    <div className={Styles.MainContainer}>
      <Header />
      <div className={Styles.Content_Wrapper}>
        <Instructor_Sidebar />
        <div className={Styles.Content}>
          <div className={Styles.Module_Container}>
            <h1>Modules</h1>
            <div className={Styles.Module_Grid}>
              {error ? (
                <p>{`Error: ${error}`}</p>
              ) : modules.length > 0 ? (
                modules.map((module) => {
                  const status = moduleStatuses[module._id] || { pre_test_completed: false, post_test_completed: false };
                  let statusText = 'Take Pre-Test';
                  if (status.pre_test_completed && !status.post_test_completed) {
                    statusText = 'Continue Module';
                  } else if (status.post_test_completed) {
                    statusText = 'Completed';
                  }

                  return (
                    <div className={`${Styles.ModuleCard} ${status.post_test_completed ? Styles.completed : ''}`} key={module._id}>
                      <h3>{module.title}</h3>
                      <div className={Styles.ModuleImage}>
                        <img src={`${API_URL}/${module.image_url}`} alt="Module" />
                      </div>
                      <p>Status: {statusText}</p>
                      <button
                        className={Styles.ModuleProceedBtn}
                        onClick={() => handleProceedClick(module._id)}
                        disabled={status.post_test_completed}
                      >
                        Proceed
                      </button>
                    </div>
                  );
                })
              ) : (
                <p>Please wait for the modules.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ModuleList;
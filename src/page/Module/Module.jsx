import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Styles from './module.module.css';
import Header from '../../Components/composables/Header';
import Student_Sidebar from '../../Components/Student_Sidebar';
import Footer from '../../Components/composables/FooterM';

const ModuleDashboard = () => {
  const [modules, setModules] = useState([]);
  const [error, setError] = useState(null);
  const [userProgram, setUserProgram] = useState(null);
  const [moduleStatuses, setModuleStatuses] = useState({});
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || 
    (window.location.hostname === "localhost" ? "http://127.0.0.1:8000" : "https://321d-2405-8d40-484d-d125-c439-23f4-26b1-4546.ngrok-free.app");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const idNumber = localStorage.getItem('userIdNumber');
        if (!idNumber) {
          setError('User not logged in');
          return;
        }

        const response = await fetch(`${API_URL}/api/profile/${idNumber}`, {
          credentials: 'include', // Include cookies for ngrok
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();
        setUserProgram(data.program || 'All Programs');
      } catch (err) {
        setError(err.message);
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

        console.log('Fetching modules from:', apiUrl);
        const modulesResponse = await fetch(apiUrl, {
          credentials: 'include', // Include cookies to bypass ngrok warning
        });
        if (!modulesResponse.ok) {
          const text = await modulesResponse.text();
          console.error('Response not OK:', modulesResponse.status, text);
          throw new Error(`HTTP error! Status: ${modulesResponse.status} - ${text}`);
        }
        const contentType = modulesResponse.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await modulesResponse.text();
          console.error('Non-JSON response:', text);
          throw new Error('Received non-JSON response, likely ngrok warning page');
        }
        const modulesData = await modulesResponse.json();
        setModules(modulesData);

        // Fetch statuses for all modules
        const statuses = {};
        for (const module of modulesData) {
          const statusResponse = await fetch(`${API_URL}/api/module-status/${module._id}/${idNumber}`, {
            credentials: 'include', // Include cookies for subsequent requests
          });
          if (statusResponse.ok) {
            statuses[module._id] = await statusResponse.json();
          } else {
            console.warn(`Failed to fetch status for module ${module._id}: ${statusResponse.status}`);
          }
        }
        setModuleStatuses(statuses);
      } catch (error) {
        console.error('Error fetching modules:', error);
        setError(error.message);
      }
    };

    fetchModulesAndStatuses();
  }, [userProgram]);

  const handleProceedClick = (moduleId) => {
    const status = moduleStatuses[moduleId] || { pre_test_completed: false, post_test_completed: false };
    if (!status.pre_test_completed) {
      navigate(`/pre-test/${moduleId}`);
    } else {
      navigate(`/module/${moduleId}`);
    }
  };

  return (
    <div className={Styles.MainContainer}>
      <Header />
      <div className={Styles.Content_Wrapper}>
        <Student_Sidebar />
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
                        {statusText}
                      </button>
                    </div>
                  );
                })
              ) : (
                <p>No modules available</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ModuleDashboard;
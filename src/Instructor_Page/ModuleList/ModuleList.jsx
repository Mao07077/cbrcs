import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Styles from './Module.module.css';
import Header from '../../Components/composables/Header';
import Instructor_Sidebar from '../../Components/Instructor_Sidebar';
import Footer from '../../Components/composables/Footer';

const API_URL = process.env.REACT_APP_API_URL || 

  (window.location.hostname === "localhost" ? "http://127.0.0.1:8000" : "https://dfbd-110-54-166-204.ngrok-free.app");

  (window.location.hostname === "localhost" ? "http://127.0.0.1:8000" : "https://c3a1-2405-8d40-448f-2d57-c4b-6820-175b-382a.ngrok-free.app ");

const ModuleList = () => {
  const [modules, setModules] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userIdNumber = localStorage.getItem('userIdNumber') || 'All IDs';

  useEffect(() => {
    fetch(`${API_URL}/api/modules`)
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

  const filteredModules = modules.filter(
    (module) => module.id_number === userIdNumber
  );

  return (
    <div className={Styles.MainContainer}>
      <Header />
      <div className={Styles.Content_Wrapper}>
        <Instructor_Sidebar />
        <div className={Styles.Content}>
          <div className={Styles.Greeting_Dashboard}>
            <h1>Module</h1>
          </div>
          <div className={Styles.ModuleGrid}>
            {error ? (
              <p>{`Error: ${error}`}</p>
            ) : filteredModules.length > 0 ? (
              filteredModules.map((module) => (
                <div className={Styles.moduleCard} key={module._id}>
                  <h3>{module.title}</h3>
                  <p>Topic here</p>
                  <div className={Styles.moduleImage}>
                    <img
                      src={`${API_URL}/${module.image_url}`}
                      alt="Module"
                    />
                  </div>
                  <button
                    className={Styles.proceedBtn}
                    onClick={() => handleProceedClick(module._id)}
                  >
                    Proceed
                  </button>
                </div>
              ))
            ) : (
              <p>Please wait for the modules.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ModuleList;

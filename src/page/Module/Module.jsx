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
        console.log("User Profile:", data); // Debugging
        setUserProgram(data.program || "All Programs"); // Default to 'All Programs' if missing
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (!userProgram) return; // Wait until userProgram is set

    const apiUrl =
      userProgram === "All Programs"
        ? "http://localhost:8000/api/modules"
        : `http://localhost:8000/api/modules?program=${encodeURIComponent(userProgram)}`;

    console.log("Fetching modules from:", apiUrl); // Debugging

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Modules fetched:", data); // Debugging
        setModules(data);
      })
      .catch((error) => setError(error.message));
  }, [userProgram]); // Runs whenever userProgram changes

  const handleProceedClick = (moduleId) => {
    navigate(`/module/${moduleId}`);
  };

  return (
    <div>
      <Header />

      <div className={Styles.Module_Container}>
        <div className={Styles.Notheader}>
          <h1>Modules</h1>
        </div>

        <div className={Styles.User_Program}>
          <p>Current Program: {userProgram || "Loading..."}</p>
        </div>

        <div className={Styles.Module_Grid}>
          {error ? (
            <p>{`Error: ${error}`}</p>
          ) : modules.length > 0 ? (
            modules.map((module) => (
              <div className="module" key={module._id}>
                <h3>{module.title}</h3>
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

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link
import './module.css';
import Header from '../../Components/Header'; // Import the Header component

const ModuleDashboard = () => {
  const [modules, setModules] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  // Retrieve the user's program from local storage
  const userProgram = localStorage.getItem('userProgram') || 'All Programs';

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

  const filteredModules = modules.filter(module => module.program === userProgram);

  return (
    <div>
       {/* Header */}
       <header className="header">
                <Header />
            </header>
      <div className="module-container">
        
        <div className="notheader">
          <h1>Modules</h1>
        </div>
        <div className="instructions">
          Instructions here
        </div>
        <div className="user-program">
          <p>Current Program: {userProgram}</p>
        </div>
        <div className="module-grid">
          {error ? (
            <p>{`Error: ${error}`}</p> // Display error if there is one
          ) : filteredModules.length > 0 ? (
            filteredModules.map((module) => (
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

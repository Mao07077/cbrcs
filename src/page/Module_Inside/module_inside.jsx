import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Ensure React Router is properly set up
import './module_inside.css';
import Header from '../../Components/Header'; // Import the Header component
import Instructor_Header from '../../Components/Instructor_Header'; // Import the Instructor_Header component

const ModuleInside = () => {
  const [module, setModule] = useState(null); // Store the module data
  const [error, setError] = useState(null); // Store any errors
  const [timeSpent, setTimeSpent] = useState(0); // Track time spent on module in seconds
  const [isInstructor, setIsInstructor] = useState(false); // Manage instructor mode
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

    // Start timer
    const startTime = Date.now();
    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      const timeSpentInSeconds = Math.floor((currentTime - startTime) / 1000);
      setTimeSpent(timeSpentInSeconds);
    }, 1000);

    // Cleanup function to stop timer
    return () => {
      clearInterval(intervalId);
    };
  }, [id]); // Re-fetch data when the ID changes

  useEffect(() => {
    // Check user role from local storage
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'instructor') {
      setIsInstructor(true);
    }
  }, []);

  // Error handling
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // Loading state
  if (!module) {
    return <div className="loading">Loading module data...</div>;
  }

  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;

  return (
    <div>
      {/* Header Section */}
      <header className="header">
        {isInstructor ? <Instructor_Header /> : <Header />}
      </header>
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

          {/* Time Spent Section */}
          <section className="time-spent">
            <h2>Time Spent on Module</h2>
            <p>{minutes} minutes {seconds} seconds</p>
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
              <button onClick={() => navigate(`/post-test/${module._id}`, { state: { timeSpent } })}>Take Test</button>
            </div>
          </section>

          {/* Instructor View Section */}
          {isInstructor && (
            <section className="instructor-view">
              <h2>Instructor View</h2>
              <p>Here you can add additional controls or information for the instructor.</p>
              {/* Example: Edit Module Button */}
              <button onClick={() => navigate(`/createposttest/${module._id}`)}>Create Posttest</button>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default ModuleInside;


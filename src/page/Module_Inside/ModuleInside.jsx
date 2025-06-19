import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./module_inside.css";
import Header from '../../Components/composables/Header';

const ModuleInside = () => {
  const [module, setModule] = useState(null);
  const [error, setError] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isInstructor, setIsInstructor] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const [moduleStatus, setModuleStatus] = useState({ pre_test_completed: false, post_test_completed: false });
  
  const { id } = useParams();
  const navigate = useNavigate();

  const API_URL = "https://g28s4zdq-8000.asse.devtunnels.ms/";
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "https://g28s4zdq-8000.asse.devtunnels.ms/"
    : "https://g28s4zdq-8000.asse.devtunnels.ms/");
  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        const userId = localStorage.getItem('userIdNumber');
        if (!userId) {
          throw new Error('User not logged in');
        }

        const statusResponse = await fetch(`${API_URL}/api/module-status/${id}/${userId}`);
        if (!statusResponse.ok) {
          throw new Error('Failed to fetch module status');
        }
        const statusData = await statusResponse.json();
        setModuleStatus(statusData);

        if (!statusData.pre_test_completed && !isInstructor) {
          navigate(`/pre-test/${id}`);
          return;
        }

        const moduleResponse = await fetch(`${API_URL}/api/modules/${id}`);
        if (!moduleResponse.ok) {
          throw new Error(`Failed to fetch module: ${moduleResponse.status}`);
        }
        const moduleData = await moduleResponse.json();
        setModule(moduleData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchModuleData();

    const startTime = Date.now();
    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      setTimeSpent(Math.floor((currentTime - startTime) / 1000));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [id, navigate, isInstructor]);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole === "instructor") {
      setIsInstructor(true);
    }
  }, []);

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!module) {
    return <div className="loading">Loading module data...</div>;
  }

  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;

  return (
    <div className="Main">
      <Header />
      <div className="container">
        <main className="module-content">
          <section className="module-header">
            <h1 className="module-title">{module.title}</h1>
            <p className="time-spent">
              Time Spent: {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </p>
          </section>

          {module.document_url && (
            <section className="module-resource">
              <div
                className="fileelement fixed-file"
                onClick={() => setShowPDF(true)}
              >
                <div className="document-preview">
                  <div className="document-icon"></div>
                  <div className="document-info">
                    <h3>{module.title}</h3>
                    <p>PDF</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          <div className="separator"></div>

          <section className="test-section">
            <div className="test-container">
              <h3>{moduleStatus.post_test_completed ? "Module Completed" : "Ready to Take the Post-Test?"}</h3>
              <p>Instructions Here</p>
              {!moduleStatus.post_test_completed && (
                <button
                  className="proceed-btn"
                  onClick={() => navigate(`/post-test/${id}`, { state: { timeSpent } })}
                >
                  Proceed to Post-Test
                </button>
              )}
              {moduleStatus.post_test_completed && (
                <p className="completed-message">You have completed the post-test for this module.</p>
              )}
            </div>
          </section>

          <section className="module-details">
            <h2>Module Details</h2>
            <p><strong>Topic:</strong> {module.topic}</p>
            <p><strong>Description:</strong> {module.description}</p>
            <p><strong>Program:</strong> {module.program}</p>
            <p><strong>Instructor ID:</strong> {module.id_number}</p>
          </section>

          {showPDF && (
            <div className="pdf-modal-overlay" role="dialog" aria-labelledby="pdf-modal-title" onClick={() => setShowPDF(false)}>
              <div className="pdf-modal" onClick={(e) => e.stopPropagation()}>
                <h2 id="pdf-modal-title" className="sr-only">PDF Viewer</h2>
                <button className="close-btn" onClick={() => setShowPDF(false)}>×</button>
                <iframe
                  src={`${API_URL}/${module.document_url}`}
                  title="Module Document"
                  width="100%"
                  height="100%"
                  onError={() => setError("Failed to load PDF document")}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ModuleInside;
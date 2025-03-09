import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./module_inside.css";
import Header from "../../Components/Header";
import Instructor_Header from "../../Components/Instructor_Header";

const ModuleInside = () => {
  const [module, setModule] = useState(null);
  const [error, setError] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isInstructor, setIsInstructor] = useState(false);
  const [extractedText, setExtractedText] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/modules/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch module: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched module data:", data);
        setModule(data);
        console.error("Error fetching module data:", error);
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
  }, [id]);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole === "instructor") {
      setIsInstructor(true);
    }
  }, []);

  useEffect(() => {
    if (module && module.document_url) {
      handleDocumentView();
    }
  }, [module]);

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:8000/extract-text/', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (result.extracted_text) {
      setExtractedText(result.extracted_text);
    } else {
      setError('Failed to extract text');
    }
  };

  const handleDocumentView = async () => {
    if (module.document_url) {
      const response = await fetch(`http://localhost:8000/${module.document_url}`);
      const blob = await response.blob();
      const file = new File([blob], "document.pdf", { type: blob.type });
      handleFileUpload(file);
    }
  };

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!module) {
    return <div className="loading">Loading module data...</div>;
  }

  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;

  return (
    <div>
      <header className="header">
        {isInstructor ? <Instructor_Header /> : <Header />}
      </header>
      <div className="container">
        <main>
          <section className="moduler">
            <div className="module-header">
              <div className="module-info">
                <h1>{module.title}</h1>
                <h2>Module Topic: {module.topic}</h2>
                <p>Description: {module.description}</p>
              </div>
            </div>
          </section>

          <section className="time-spent">
            <h2>Time Spent on Module</h2>
            <p>
              {minutes} minutes {seconds} seconds
            </p>
          </section>

          <section className="module-elements">
            <h2>Module’s Resources</h2>
            <p>Complete this module to proceed to the next module.</p>
            {module.document_url && (
              <div className="fileelement">
                <h3>View Document</h3>
              </div>
            )}

            {extractedText && (
              <section className="extracted-text">
                <h3>Extracted Text from Document</h3>
                <pre>{extractedText}</pre>
              </section>
            )}

            <div className="element">
              <h3>Ready for the Challenge?</h3>
              <p>Test description here</p>
              <button onClick={() => navigate(`/post-test/${id}`, { state: { timeSpent } })}>Take Test</button>

            </div>
          </section>

          {isInstructor && (
            <section className="instructor-view">
              <h2>Instructor View</h2>
              <p>Add additional controls for instructors.</p>
              <button onClick={() => navigate(`/createposttest/${id}`)}>
                Create Posttest
              </button>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default ModuleInside;

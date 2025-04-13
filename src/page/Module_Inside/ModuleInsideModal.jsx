import React from "react";
import "./module_inside.css";

const ModuleInsideModal = ({ module, timeSpent, onClose, onProceed, API_URL }) => {
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>

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
              onClick={() => window.open(`${API_URL}/${module.document_url}`, "_blank")}
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
            <h3>Ready To Take The Test?</h3>
            <p>Instructions Here</p>
            <button className="proceed-btn" onClick={onProceed}>
              Proceed
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ModuleInsideModal;

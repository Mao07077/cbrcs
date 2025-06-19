import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Create_module.css';

const CreateModule = ({ onClose }) => {
  const [moduleName, setModuleName] = useState('');
  const [moduleTopic, setModuleTopic] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [file, setFile] = useState(null);
  const [picture, setPicture] = useState(null);

  const navigate = useNavigate();

  const API_URL = "http://127.0.0.1:8000";
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : "http://127.0.0.1:8000");
  // Common headers for axios requests
  const requestHeaders = {
    'ngrok-skip-browser-warning': 'true', // Bypasses ngrok warning page
    'Accept': 'application/json',
  };

  const handleFileUpload = (e) => setFile(e.target.files[0]);
  const handlePictureUpload = (e) => setPicture(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!moduleName || !moduleTopic || !description || !file || !picture || !selectedCourse) {
      alert("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append('title', moduleName);
    formData.append('topic', moduleTopic);
    formData.append('description', description);
    formData.append('program', selectedCourse);
    
    const userIdNumber = localStorage.getItem('userIdNumber');
    if (!userIdNumber) {
      alert("User ID not found. Please log in again.");
      return;
    }
    formData.append('id_number', userIdNumber);
    formData.append('document', file);
    formData.append('picture', picture);

    console.log("FormData entries:", [...formData.entries()]); // Debugging: Log form data

    try {
      const response = await axios.post(`${API_URL}/api/create_module`, formData, {
        headers: {
          ...requestHeaders, // Include ngrok header
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        alert("Module created successfully!");
        if (onClose) onClose();
        navigate('/modulelist');
      } else {
        alert("Error creating module: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error creating module:", error.response?.data || error.message);
      alert("Error creating module: " + (error.response?.data?.detail || error.message));
    }
  };

  return (
    <div className="create-module">
      <h1>Create New Module</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={moduleName}
          onChange={(e) => setModuleName(e.target.value)}
          placeholder="Module Name"
          required
        />
        <input
          type="text"
          value={moduleTopic}
          onChange={(e) => setModuleTopic(e.target.value)}
          placeholder="Module Topic"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <label htmlFor="fileUpload">Upload PDF/Document:</label>
        <input
          id="fileUpload"
          type="file"
          onChange={handleFileUpload}
          accept=".pdf,.ppt,.pptx,.doc,.docx"
          required
        />
        <label htmlFor="pictureUpload">Upload Image:</label>
        <input
          id="pictureUpload"
          type="file"
          onChange={handlePictureUpload}
          accept="image/*"
          required
        />
        <select
          className="styled-select"
          name="program"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          required
        >
          <option value="">Select Program</option>
          <option value="LET">LET</option>
          <option value="Nursing">Nursing</option>
          <option value="Civil Service">Civil Service</option>
          <option value="OET">OET</option>
          <option value="UPCAT">UPCAT</option>
        </select>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateModule;
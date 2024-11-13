import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Create_module.css';

const CreateModule = () => {
  const [moduleName, setModuleName] = useState('');
  const [moduleTopic, setModuleTopic] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [video, setVideo] = useState(null);
  const [picture, setPicture] = useState(null);
  const navigate = useNavigate();

  const handleVideoUpload = (e) => {
    setVideo(e.target.files[0]);
  };

  const handlePictureUpload = (e) => {
    setPicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!moduleName || !moduleTopic || !description || !video || !picture || !selectedCourse) {
      alert("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append('title', moduleName);
    formData.append('topic', moduleTopic);
    formData.append('description', description);
    formData.append('video', video);
    formData.append('picture', picture);
    formData.append('program', selectedCourse);

    // Retrieve the user's ID number from localStorage
    const userIdNumber = localStorage.getItem('userIdNumber');
    if (!userIdNumber) {
      alert("User ID not found. Please log in again.");
      return;
    }
    formData.append('id_number', userIdNumber);

    try {
      // Send POST request to backend with the form data
      const response = await axios.post('http://localhost:8000/api/create_module', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        alert("Module created successfully!");
        navigate('/module');
      } else {
        alert("Error creating module: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error creating module:", error);
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
        <input
          type="file"
          onChange={handleVideoUpload}
          accept="video/*"
          placeholder="Upload Video"
          required
        />
        <input
          type="file"
          onChange={handlePictureUpload}
          accept="image/*"
          placeholder="Upload Picture"
          required
        />
        <input
          type="text"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          placeholder="Program"
          required
        />
        <button type="submit">Create Module</button>
      </form>
    </div>
  );
};

export default CreateModule;

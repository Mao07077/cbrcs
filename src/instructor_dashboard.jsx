import React, { useState } from 'react';
import './InstructorDashboard.css';

import HomeIcon from './icon/Home.png';
import MailIcon from './icon/Mail.png';
import StudentsIcon from './icon/Students.png';
import ReportsIcon from './icon/Reports.png';
import settingsIcon from './icon/settings.png';

const InstructorDashboard = () => {
  const [fileName, setFileName] = useState('No file chosen');
  const [postText, setPostText] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file ? file.name : 'No file chosen');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Post:', postText);
    console.log('File:', fileName);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="header">
        <h2>Logo Here</h2>
      </header> 

      {/* Greeting */}
      <div className="greeting">
        <h1>Hi, Mike Angelo Muico</h1>
      </div>

      {/* Sidebar */}
      <nav className="sidebar">
        <ul>
          <li>
            <img src={HomeIcon} alt="Home icon" className="sidebar-icon" />
            <a href="#Home">Home</a>
          </li>
          <li>
            <img src={MailIcon} alt="Mail icon" className="sidebar-icon" />
            <a href="#mail">Mail</a>
          </li>
          <li>
            <img src={StudentsIcon} alt="Students icon" className="sidebar-icon" />
            <a href="#students">Students</a>
          </li>
          <li>
            <img src={ReportsIcon} alt="Reports icon" className="sidebar-icon" />
            <a href="#reports">Reports</a>
          </li>
          <li>
            <img src={settingsIcon} alt="Settings icon" className="sidebar-icon" />
            <a href="#settings">Settings</a>
          </li>
        </ul>
      </nav>

      {/* Statistics Section */}
      <div className="statistics-container">
        <div className="stat-card">
          <h1>Total Number of Students</h1>
          <h2>40</h2>
        </div>
        <div className="stat-card">
          <h1>Student Engagement Rate</h1>
          <h2>50%</h2>
        </div>
      </div>

      {/* Announcement Section */}
      <div className="announcement-container">
        <form id="post-form" onSubmit={handleSubmit}>
          <textarea
            id="post-text"
            placeholder="Post announcement here"
            required
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          />
          <hr className="divider" />
          <input type="file" id="file-upload" hidden onChange={handleFileChange} />
          <label htmlFor="file-upload" className="file-label">
            <span className="file-icon">📎</span> 
            Attach File
          </label>
          <span id="file-chosen">{fileName}</span>
          <button type="submit">Post</button>
        </form>
      </div>

      {/* Content Section */}
      <div className="content-container">
        {/* Student Attendance */}
        <div className="student-attendance">
          <h2>Student Attendance</h2>
          <div className="graph">
            <div className="bar" style={{ height: '70%' }}></div>
            <div className="bar" style={{ height: '50%' }}></div>
            <div className="bar" style={{ height: '90%' }}></div>
            <div className="bar" style={{ height: '60%' }}></div>
            <div className="bar" style={{ height: '40%' }}></div>
          </div>
        </div>

        {/* Modules Section */}
        <div className="modules-container">
          <h2>Module/Course Name</h2>
          <div className="module">
            <span>Topic Name</span>
          </div>
          <div className="module">
            <span>Topic Name</span>
          </div>
          <div className="module">
            <span>Topic Name</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;

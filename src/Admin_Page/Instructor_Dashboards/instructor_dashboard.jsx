import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './Instructor_Dashboard.css';

import HomeIcon from './icon/Home.png';
import MailIcon from './icon/Mail.png';
import StudentsIcon from './icon/Students.png';
import ReportsIcon from './icon/Reports.png';
import SettingsIcon from './icon/settings.png';
import logoIcon from './icon/logo.png';
const InstructorDashboard = () => {
  const [fileName, setFileName] = useState('No file chosen');
  const [postText, setPostText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]); // State for attendance data
  const [stats, setStats] = useState({
    totalStudents: 0,
    engagementRate: 0,
  });

  // Simulating an API call for stats
  useEffect(() => {
    const fetchStats = async () => {
      // Simulate an API response with mock data
      const mockStats = {
        totalStudents: 40, // Example number of students
        engagementRate: 50, // Example engagement rate
      };
      // Simulate loading delay
      setTimeout(() => {
        setStats(mockStats);
      }, 1000);
    };

    fetchStats();
  }, []);

  // Simulate fetching attendance data
  useEffect(() => {
    const simulateBackendFetch = async () => {
      return new Promise((resolve) =>
        setTimeout(() => resolve([70, 50, 90, 60, 40]), 1000)
      );
    };

    const fetchAttendanceData = async () => {
      const data = await simulateBackendFetch();
      setAttendanceData(data);
    };

    fetchAttendanceData();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file ? file.name : 'No file chosen');
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      alert(`File "${file.name}" has been uploaded successfully!`);
    }
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
  <div className="header_content">
    <div className="header_logo">
      <img src={logoIcon} alt="logo" />
    </div>
  </div>
</header>

      {/* Greeting */}
      <div className="greeting-dashboard">
        <h1>Instructor's Dashboard</h1>
      </div>

      {/* Sidebar */}
      <nav className="sidebar">
      <ul>
        <li>
          <img src={HomeIcon} alt="Home icon" className="sidebar-icon" />
          <Link to="/">Home</Link>
        </li>
        <li>
          <img src={MailIcon} alt="Mail icon" className="sidebar-icon" />
          <Link to="/Mail">Mail</Link>
        </li>
        <li>
          <img src={StudentsIcon} alt="Students icon" className="sidebar-icon" />
          <Link to="/Studentlist">Students</Link>
        </li>
        <li>
          <img src={ReportsIcon} alt="Reports icon" className="sidebar-icon" />
          <Link to="/reports">Reports</Link>
        </li>
        <li>
          <img src={SettingsIcon} alt="Settings icon" className="sidebar-icon" />
          <Link to="/Settings">Settings</Link>
        </li>
      </ul>
    </nav>

      {/* Statistics Section */}
      <div className="Main_insdashboard">
      <div className="statistics-container">
        <div className="stat-card">
          <h1>Total Number of Students</h1>
          <h2>{stats.totalStudents || 'Loading...'}</h2>
        </div>
        <div className="stat-card">
          <h1>Student Engagement Rate</h1>
          <h2>{stats.engagementRate ? `${stats.engagementRate}%` : 'Loading...'}</h2>
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
          {/* Drag-and-Drop Area */}
          <div
            className={`drop-zone ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input type="file" id="file-upload" hidden onChange={handleFileChange} />
            <label htmlFor="file-upload" className="file-label">
              Drag & Drop or <span className="file-icon">📎</span> Attach File
            </label>
            <span id="file-chosen">{fileName}</span>
          </div>
          <button type="submit">Post</button>
        </form>
        <div className ="Create-module"> 
         <button type="Create-Module">Create Module</button> 
      </div>
      </div>

      

      {/* Content Section */}
      <div className="content-container">
        {/* Student Attendance */}
        <div className="student-attendance">
          <h2>Student Attendance</h2>
          <div className="graph">
            {attendanceData.length > 0 ? (
              attendanceData.map((value, index) => (
                <div
                  key={index}
                  className="bar"
                  style={{
                    height: `${value}%`,
                    transition: 'height 0.5s ease-in-out',
                  }}
                  title={`Attendance: ${value}%`}
                ></div>
              ))
            ) : (
              <p>Loading attendance data...</p>
            )}
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
    </div>
  );
};

export default InstructorDashboard;
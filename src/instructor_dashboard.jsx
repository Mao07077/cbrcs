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
    // Handle form submission logic here
    console.log('Post:', postText);
    console.log('File:', fileName);
  };

  return (
    <div>
      <div className="header">
        <h2>Logo here</h2>
      </div>
      <div className="instructor-name">
        <h1>Hello Instructor</h1>
      </div>
      
      <div className="Numstudents">
        <div className="header-border">
          <h1>Number of students: </h1>
          <h2>50</h2>
          <div className="header-border"></div>
        </div>
      </div>
      
      <div className="Numstudents" >
  <div class = "header-border" >
    <h1>Number of students: </h1>
    <h2>50</h2>
    <div class = "header-border" ></div>
  </div>
  </div>
  
  <div className='studengagement'>
  <h1>Student engagement</h1>
  <h2>60%</h2>
  <div class = "engagement-border" ></div>
 </div>

      <div className='Upload'>
        <form id="post-form" onSubmit={handleSubmit}>
          <textarea
            id="post-text"
            placeholder="Write your post here..."
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
            <img src={ReportsIcon} alt="reports icon" className="sidebar-icon" />
            <a href="#reports">Reports</a>
          </li>
          <li>
            <img src={settingsIcon} alt="Settings icon" className="sidebar-icon" />
            <a href="#settings">Settings</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default InstructorDashboard;
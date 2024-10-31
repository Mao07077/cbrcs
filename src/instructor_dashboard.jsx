import React from 'react';
import './InstructorDashboard.css';


import HomeIcon from './icon/Home.png';
import MailIcon from './icon/Mail.png';
import StudentsIcon from'./icon/Students.png';
import ReportsIcon from './icon/Reports.png';
import settingsIcon from './icon/settings.png';


const InstructorDashboard = () => {
  return (
    <div>
      <div className="header">
        <h2>Logo here</h2>
      </div>
      <div className="instructor-name">
        <h1>Hello Instructor</h1>
      </div>
      
      <div className="Numstudents" >
      <div class = "header-border" >
        <h1>Number of students: </h1>
        <h2>50</h2>
        <div class = "header-border" ></div>
      </div>
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





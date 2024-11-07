import React from 'react';
import "./Mail.css";

import HomeIcon from './icon/Home.png';
import MailIcon from './icon/Mail.png';
import StudentsIcon from './icon/Students.png';
import ReportsIcon from './icon/Reports.png';
import settingsIcon from './icon/settings.png';


const Mail = () => {
    return (
        <div className="mail-container">
          {/* Header */}
          <header className="header">
            <h2>Logo Here</h2>
          </header> 
    
          {/* Greeting */}
          <div className="pagbati">
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
        </div>
     );
};
export default Mail;
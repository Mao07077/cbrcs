import React from 'react';
import "./mail.css";

import HomeIcon from './icon/Home.png';
import MailIcon from './icon/Mail.png';
import StudentsIcon from './icon/Students.png';
import ReportsIcon from './icon/Reports.png';
import settingsIcon from './icon/settings.png';
import logoIcon from './icon/logo.png';


const Email = () => {
  return (
      <div className="email-part">
          {/* Email List */}
          <div className="mail-bar">
            <h2>Inbox</h2>
            
            {Array.from({ length: 5 }).map((_, index) => (
                <div 
                    className="email-item" 
                    key={index} 
                    onClick={() => handleEmailClick(index)} // Add onClick handler
                    style={{ cursor: 'pointer' }} // Change cursor to pointer
                >
                    <h2><strong>Sender Name</strong></h2>
                    <p>Subject of the email</p>
                    <p>Date here</p>
                    <p>Preview of the email content...</p>
                </div>
              ))}
          </div>
              <div classname="email-details">
          {/* Email Content */}
          
              <div className="proof">
                  {/* Profile and Subject Side-by-Side */}
                  <div className="profile">
                      <div className="avatar">👤</div>
                      <div>
                          <p><strong>Sender Name</strong></p>
                          <p>sender@example.com</p>
                      </div>
                  </div>
                  <div className="subject">
                      <h3>Email Subject Here</h3>
                  </div>
              </div>
              <hr />
              <div className="content">
                  <p>This is the content of the email. It can be multiple lines of text or paragraphs.</p>
              </div>
              <button type="submit-send">Send</button>
          </div>
      </div>
  );
};
const Mail = () => {
  return (
      <div className="mail-container">
           <header className="header">
  <div className="header-content">
    <div className="header-logo">
      <img src={logoIcon} alt="logo" />
    </div>
  </div>
</header>
          <div className="pagbati">
              <h1>Hi, Mike Angelo Muico</h1>
              <div className="line"></div>
                <h2>Mail</h2>
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
                      <img src={ReportsIcon} alt="Reports icon" className="sidebar-icon" />
                      <a href="#reports">Reports</a>
                  </li>
                  <li>
                      <img src={settingsIcon} alt="Settings icon" className="sidebar-icon" />
                      <a href="#settings">Settings</a>
                  </li>
              </ul>
          </nav>
            
          {/* Render the Email Component */}
          <Email />
      </div>
  );
};

export default Mail;

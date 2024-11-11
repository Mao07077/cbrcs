import React, { useState } from 'react';
import "./Mail.css";

import HomeIcon from './icon/Home.png';
import MailIcon from './icon/Mail.png';
import StudentsIcon from './icon/Students.png';
import ReportsIcon from './icon/Reports.png';
import settingsIcon from './icon/settings.png';

const Email = () => {
  const [isComposing, setIsComposing] = useState(false); 
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSendEmail = () => {
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Message:', message);
    alert('Email Sent');
    setTo('');
    setSubject('');
    setMessage('');
    setIsComposing(false); 
  };

  return (
    <div className="email-part">
      {/* Email List */}
      <div className="mail-bar">
        <h2>Inbox</h2>
        
        {Array.from({ length: 5 }).map((_, index) => (
          <div 
            className="email-item" 
            key={index} 
            onClick={() => setIsComposing(false)} // Close compose view on click
            style={{ cursor: 'pointer' }}
          >
            <h2><strong>Sender Name</strong></h2>
            <p>Subject of the email</p>
            <p>Date here</p>
            <p>Preview of the email content...</p>
          </div>
        ))}
      </div>

      {/* Email Content or Compose Email */}
      <div className="email-content">
        {!isComposing ? (
          <>
            {/* Profile and Subject Side-by-Side */}
            <div className="proof">
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
            <button onClick={() => setIsComposing(true)}>Compose New Email</button> {/* Compose button */}
          </>
        ) : (
          <div className="compose-email">
            <h3>Compose New Email</h3>
            <div>
              <label htmlFor="to">To:</label>
              <input
                id="to"
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Enter recipient's email"
              />
            </div>
            <div>
              <label htmlFor="subject">Subject:</label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject"
              />
            </div>
            <div>
              <label htmlFor="message">Message:</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="6"
                placeholder="Enter your email message here..."
              />
            </div>
            <button onClick={handleSendEmail}>Send Email</button>
            <button onClick={() => setIsComposing(false)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

// Mail Component
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
        
     
      <Email />
    </div>
  );
};

export default Mail;
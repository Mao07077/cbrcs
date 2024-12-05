import React from 'react';
import styles from'./Mail.module.css';    

import HomeIcon from './icon/Home.png';
import MailIcon from './icon/Mail.png';
import StudentsIcon from './icon/Students.png';
import ReportsIcon from './icon/Reports.png';
import SettingsIcon from './icon/settings.png';
import logoIcon from './icon/logo.png';

const Email = () => {
  return (
      <div className={styles.email_part}>
          {/* Email List */}
          <div className={styles.mail_bar}>
            <h2>Inbox</h2>
            
            {Array.from({ length: 5 }).map((_, index) => (
                <div 
                    className={styles.email_item} 
                    key={index} 
                    onClick={() => handleEmailClick(index)}
                    style={{ cursor: 'pointer' }} 
                >
                    <h2><strong>Sender Name</strong></h2>
                    <p>Subject of the email</p>
                    <p>Date here</p>
                    <p>Preview of the email content...</p>
                </div>
              ))}
          </div>
              <div classname={styles.email_details}>
          {/* Email Content */}
          
              <div className={styles.proof}>
                  {/* Profile and Subject Side-by-Side */}
                  <div className={styles.profile}>
                      <div className={styles.avatar}>👤</div>
                      <div>
                          <p><strong>Sender Name</strong></p>
                          <p>sender@example.com</p>
                      </div>
                  </div>
                  <div className={styles.subject}>
                      <h3>Email Subject Here</h3>
                  </div>
              </div>
              <hr />
              <div className={styles.content}>
                  <p>This is the content of the email. It can be multiple lines of text or paragraphs.</p>
              </div>
              <button type="submit-send">Send</button>
          </div>
      </div>
  );
};
const Mail = () => {
  return (
      <div className={styles.mail_container}>
           <header className="header">
            <div className={styles.header_content}>
            <div className={styles.header_logo}>
            <img src={logoIcon} alt="logo" />
     </div>
     </div>
          </header>
          <div className={styles.pagbati}>
              <h1>Hi, Mike Angelo Muico</h1>
              <div className={styles.line}></div>
                <h2>Mail</h2>
          </div>
          <div className={styles.overall_sidebar}>
          <nav className="sidebar">
              <ul>
                  <li>
                      <img src={HomeIcon} alt="Home icon" className={styles.sidebar_icon} />
                      <a href="#Home">Home</a>
                  </li>
                  <li>
                      <img src={MailIcon} alt="Mail icon" className={styles.sidebar_icon}/>
                      <a href="#mail">Mail</a>
                  </li>
                  <li>
                      <img src={StudentsIcon} alt="Students icon" className={styles.sidebar_icon} />
                      <a href="#students">Students</a>
                  </li>
                  <li>
                      <img src={ReportsIcon} alt="Reports icon" className={styles.sidebar_icon}  />
                      <a href="#reports">Reports</a>
                  </li>
                  <li>
                      <img src={SettingsIcon} alt="Settings icon" className={styles.sidebar_icon} onClick={() => window.location.href='Settings'}/>
                      <a href="#settings">Settings</a>
                  </li>
              </ul>
          </nav>
          </div>
            
          {/* Render the Email Component */}
          <Email />
      </div>
  );
};

export default Mail;

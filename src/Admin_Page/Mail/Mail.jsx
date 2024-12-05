import React from 'react';
import styles from'./Mail.module.css';    

import HomeIcon from './icon/Home.png';
import MailIcon from './icon/Mail.png';
import StudentsIcon from './icon/Students.png';
import ReportsIcon from './icon/Reports.png';
<<<<<<< HEAD:src/Mail.jsx
import settingsIcon from './icon/settings.png';
import logoIcon from './icon/logo.png';

=======
import SettingsIcon from './icon/settings.png';
import logoIcon from './icon/logo.png';
>>>>>>> 358cb3b4 (12/05/2024):src/Admin_Page/Mail/Mail.jsx

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
<<<<<<< HEAD:src/Mail.jsx
      <div className="mail-container">
           <header className="header">
  <div className="header-content">
    <div className="header-logo">
      <img src={logoIcon} alt="logo" />
    </div>
  </div>
</header>
          <div className="pagbati">
=======
      <div className={styles.mail_container}>
           <header className="header">
            <div className={styles.header_content}>
            <div className={styles.header_logo}>
            <img src={logoIcon} alt="logo" />
     </div>
     </div>
          </header>
          <div className={styles.pagbati}>
>>>>>>> 358cb3b4 (12/05/2024):src/Admin_Page/Mail/Mail.jsx
              <h1>Hi, Mike Angelo Muico</h1>
              <div className={styles.line}></div>
                <h2>Mail</h2>
          </div>
<<<<<<< HEAD:src/Mail.jsx
=======
          <div className={styles.overall_sidebar}>
>>>>>>> 358cb3b4 (12/05/2024):src/Admin_Page/Mail/Mail.jsx
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
<<<<<<< HEAD:src/Mail.jsx
                      <img src={ReportsIcon} alt="Reports icon" className="sidebar-icon" />
                      <a href="#reports">Reports</a>
                  </li>
                  <li>
                      <img src={settingsIcon} alt="Settings icon" className="sidebar-icon" />
=======
                      <img src={ReportsIcon} alt="Reports icon" className={styles.sidebar_icon}  />
                      <a href="#reports">Reports</a>
                  </li>
                  <li>
                      <img src={SettingsIcon} alt="Settings icon" className={styles.sidebar_icon} onClick={() => window.location.href='Settings'}/>
>>>>>>> 358cb3b4 (12/05/2024):src/Admin_Page/Mail/Mail.jsx
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

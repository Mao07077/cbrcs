import React, { useEffect } from 'react';
import Styles from "./Mail.module.css";
import Dashboard from '../../icon/dashboard.png'; 
import MailIcon from '../../icon/Mail.png';
import StudentsIcon from '../../icon/Students.png';
import Icon from '../../icon/actual.png';



 
const SidebarItem = ({ icon, text, onClick }) => (
    <li>
      <button className="sidebar-item" onClick={onClick}>
        <img src={icon} alt={text} className="sidebar-icon" />
        <span>{text}</span>
      </button>
    </li>
  );
  const Mail = () => {
    const handleNavigation = (route) => {
      console.log(`Navigating to: ${route}`);
    
      window.location.href = `/${route}`;
    };
  
    return (
      <div className={Styles.Maincontainer}>
    <div className={Styles.Header}> 
      <div className="header-content">
          <div className="header-logo">
              <img src={Icon} alt="logo" />
          </div>
          
      </div></div>
    <nav className={Styles.Menu}> 
      <ul>
        <li>
          <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('Instructor_Dashboard')}>
            <img src={Dashboard} alt="Dashboard Icon" className={Styles.Sidebar_Icon} />
            <span>Dashboard</span>
          </buttonss>
        </li>
        <li>
          <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('mail')}>
            <img src={MailIcon} alt="Mail Icon" className={Styles.Sidebar_Icon} />
            <span>Message</span>
          </buttonss>
        </li>
        <li>
          <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('studentlist')}>
            <img src={StudentsIcon} alt="Students Icon" className={Styles.Sidebar_Icon} />
            <span>StudentList</span>
          </buttonss>
        </li>
        <li>
          <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('ModuleList')}>
            <img src={StudentsIcon} alt="Students Icon" className={Styles.Sidebar_Icon} />
            <span>Module</span>
          </buttonss>
        </li>
      </ul>
     </nav>
    <div className={Styles.Content}>
    <div className={Styles.Greeting_Dashboard}>
        <h1>Messages</h1>
      </div>
    <div className={Styles.Mail_Bar}>
            {Array.from({ length: 10 }).map((_, index) => (
                <div 
                    className={Styles.Email_Item} 
                    key={index} 
                    onClick={() => handleEmailClick(index)}    
                    style={{ cursor: 'pointer' }}   
                >  
                    <h2><strong> Name Here</strong></h2>
                    <buttons type="submit-send">Invite</buttons>
                    <p>Active Now</p>
                    
                </div>
              ))}
          </div>
              <div classname={Styles.Email_Details}>
              <hr />
             
          </div>
      </div>
  
    </div>
    );
  };
  
  export default Mail;
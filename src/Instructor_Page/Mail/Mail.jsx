import React from 'react';
import Styles from "./Mail.module.css";
import InstructorHeader from '../../Components/Instructor_Header';
 

const Email = () => {
  return (
    
      <div className={Styles.Email_Part}>
          {/* Email List */}
          <div className={Styles.Mail_Bar}>
          <h1>Mail</h1>
            <h2>Inbox</h2>
            
            {Array.from({ length: 5 }).map((_, index) => (
                <div 
                    className={Styles.Email_Item} 
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
              <div classname={Styles.Email_Details}>
          {/* Email Content */}
          
              <div className={Styles.Proof}>
                  {/* Profile and Subject Side-by-Side */}
                  <div className={Styles.Profile}>
                      <div className={Styles.Avatar}>👤</div>
                      <div>
                          <p><strong>Sender Name</strong></p>
                          <p>sender@example.com</p>
                      </div>
                  </div>
                  <div className={Styles.Subject}>
                      <h3>Email Subject Here</h3>
                  </div>
              </div>
              <hr />
              <div className={Styles.Content}>
                  <p>This is the content of the email. It can be multiple lines of text or paragraphs.</p>
              </div>
              <button type="submit-send">Send</button>
          </div>
      </div>
  );
};
const Mail = () => {
  return (
    <><header className="header">
        <InstructorHeader/>
      </header>
    <div className={Styles.Main_Container}>
          <div className={Styles.Pagbati}>
              <h1>Hi, Mike Angelo Muico</h1>
          </div>
           
            
          {/* Render the Email Component */}
          <Email />
      </div>
      </>
  );
};


export default Mail;

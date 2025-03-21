import React, { useState, useEffect } from "react";
import Styles from"./Settings.module.css";
import Icon from '../../icon/actual.png';
import NameIcon from '../../icon/name.png';
import ModuleIcon from '../../icon/module.png';
import DashboardIcon from '../../icon/dashboard.png';
import RequestIcon from '../../icon/request.png';
import HelpIcon from '../../icon/help.png';

const SidebarItem = ({ icon, text, onClick }) => (
  <li>
    <button className="sidebar-item" onClick={onClick}>
      <img src={icon} alt={text} className="sidebar-icon" />
      <span>{text}</span>
    </button>
  </li>
);
const Settings = () => {
  const handleNavigation = (route) => {
    console.log(`Navigating to: ${route}`);
  
    window.location.href = `/${route}`;
  };
  const [formData, setFormData] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    suffix: "",
    birthdate: "",
    email: "",
    program: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const idNumber = localStorage.getItem("userIdNumber"); // Get user ID from localStorage
      try {
        const response = await fetch(`http://localhost:8000/user/settings/${idNumber}`);
        const result = await response.json();
        if (result.success) {
          setFormData({
            firstname: result.data.firstname || "",
            middlename: result.data.middlename || "",
            lastname: result.data.lastname || "",
            suffix: result.data.suffix || "",
            birthdate: result.data.birthdate || "",
            email: result.data.email || "",
            program: result.data.program || "",
            username: result.data.username || "",
            password: "", // Don't prefill the password for security reasons
          });
        } else {
          alert("Failed to load user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Error loading user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmed = window.confirm("Are you sure you want to send the request to the admin?");
    if (confirmed) {
      const idNumber = localStorage.getItem("userIdNumber");
      try {
        const response = await fetch(`http://localhost:8000/user/settings/request/${idNumber}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),  // Send the entire formData as the body
        });
        const result = await response.json();
        if (result.success) {
          setRequestSent(true);
        } else {
          alert(`Error: ${result.detail}`);
        }
      } catch (error) {
        console.error("Error sending request:", error);
        alert("Error sending request");
      }
    }
  };
  

  if (loading) return <div>Loading...</div>;

  return (
    <div className={Styles.MainContainer}>
              <div className={Styles.Header}> 
                   <div className="header-content">
                       <div className="header-logo">
                           <img src={Icon} alt="logo" />
                       </div>
                       </div>
                   </div>
                <nav className={Styles.Menu}> 
                    <ul>
                      <li>
                        <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('profile')}>
                          <img src={NameIcon} alt="Name Icon" className={Styles.Sidebar_Icon} />
                          <span>Profile</span>
                        </buttonss>
                      </li>
                      <li>
                        <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('module')}>
                          <img src={ModuleIcon} alt="Module Icon" className={Styles.Sidebar_Icon} />
                          <span>Module</span>
                        </buttonss>
                      </li>
                      <li>
                        <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('dashboard')}>
                          <img src={DashboardIcon} alt="Dashboard Icon" className={Styles.Sidebar_Icon} />
                          <span>Dashboard</span>
                        </buttonss>
                      </li>
                      <li>
                        <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('Request')}>
                          <img src={HelpIcon} alt="help Icon" className={Styles.Sidebar_Icon} />
                          <span>Study Habits</span>
                        </buttonss>
                      </li>
                      <li>
                        <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('settings')}>
                          <img src={RequestIcon} alt="Request Icon" className={Styles.Sidebar_Icon} />
                          <span>Request</span>
                        </buttonss>
                      </li>
                     
                    </ul>
                   </nav>
          <div className={Styles.Content}>
      <div className={Styles.Settings_Container}>
        <div className={Styles.General}>
        <h2>General</h2>
        </div>
          {requestSent ? (
            <div className="request-sent-message">
              Your request has been sent to the admin.
            </div>
          ) : (
            <>
            <div className={Styles.Sec_Container}>
              <div className={Styles.Sec_Box}>
                <div className={Styles.Row}>
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstname"
                    placeholder="Enter first name"
                    value={formData.firstname}
                    onChange={handleChange}
                  />
                </div>
                <div className={Styles.Row}>
                  <label>Middle Name</label>
                  <input
                    type="text"
                    name="middlename"
                    placeholder="Enter middle name"
                    value={formData.middlename}
                    onChange={handleChange}
                  />
                </div>
                <div className={Styles.Row}>
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastname"
                    placeholder="Enter last name"
                    value={formData.lastname}
                    onChange={handleChange}
                  />
                </div>
                <div className={Styles.Row}>
                  <label>Suffix</label>
                  <input
                    type="text"
                    name="suffix"
                    placeholder="Enter suffix"
                    value={formData.suffix}
                    onChange={handleChange}
                  />
                </div>
                <div className={Styles.Row}>
                  <label>Birthdate</label>
                  <input
                    type="text"
                    name="birthdate"
                    placeholder="Enter birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                  />
                </div>
                <div className={Styles.Row}>
                  <label>Email</label>
                  <input
                    type="text"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className={Styles.Row}>
                  <label>Program</label>
                  <input
                    type="text"
                    name="program"
                    placeholder="Enter program"
                    value={formData.program}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className={Styles.Sec_Box}>
                <h2>Login Info</h2>
                <div className={Styles.Row}>
                  <label>Username</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className={Styles.Row}>
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className={Styles.Submit_Button_Container}>
                <button type="submit" className={Styles.Submit_Button} onClick={handleSubmit}>
                  Submit
                </button>
              </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
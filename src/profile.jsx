import React, { useEffect, useState } from "react";
import "./profile.css";

import nameIcon from "./icon/name.png";
import notifIcon from "./icon/notif.png";
import moduleIcon from "./icon/module.png";
import dashboardIcon from "./icon/dashboard.png";
import settingsIcon from "./icon/settings.png";
import helpIcon from "./icon/help.png";

// Define SidebarItem component
const SidebarItem = ({ icon, text, link }) => (
  <li>
    <a href={link}>
      <img src={icon} alt={text} />
      {text}
    </a>
  </li>
);

const Profile = () => {
  const [profileData, setProfileData] = useState(null); // State to hold profile data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track errors

  useEffect(() => {
    const id_number = localStorage.getItem("userIdNumber"); // Assume user ID is stored in localStorage
    if (!id_number) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    // Fetch profile data from the backend
    fetch(`http://localhost:8000/api/profile/${id_number}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        return response.json();
      })
      .then((data) => {
        setProfileData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <header className="header">
        <h1>Logo here</h1>
        <div className="header-icons">
          <img src={nameIcon} alt="Profile" />
          <img src={notifIcon} alt="Notifications" />
        </div>
      </header>

      <nav className="sidebar">
        <ul>
          <SidebarItem icon={nameIcon} text="Name" link="profile" />
          <SidebarItem icon={moduleIcon} text="Module" link="module" />
          <SidebarItem icon={dashboardIcon} text="Dashboard" link="dashboard" />
          <SidebarItem icon={settingsIcon} text="Settings" link="settings" />
          <SidebarItem icon={helpIcon} text="Help" link="help" />
        </ul>
      </nav>

      <div className="profile-container">
        <div className="header-container">
          <h2>Account Profile</h2>
          <div className="header-underline"></div>
        </div>

        <div className="profile-wrapper">
          <div className="profilebox">
            <div className="profile-image">
              <img src={nameIcon} alt="Profile Picture" />
            </div>
          </div>

          <div className="separator-line"></div>

          <div className="section-holder">
            <div className="section personal-info">
              <h3>Personal Information</h3>
              <div className="row">
                <label>Name:</label>
                <span>
                  {profileData.firstname} {profileData.lastname}
                </span>
              </div>
              <div className="row">
                <label>Age:</label>
                <span>{profileData.age || "N/A"}</span>
              </div>
              <div className="row">
                <label>Id Number:</label>
                <span>{profileData.id_number}</span>
              </div>
              <div className="row">
                <label>Program:</label>
                <span>{profileData.program}</span>
              </div>
            </div>
            <div className="section activity-info">
              <h3>Activity Information</h3>
              <div className="row">
                <label>Hours Activity:</label>
                <span>{profileData.hoursActivity || "0"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

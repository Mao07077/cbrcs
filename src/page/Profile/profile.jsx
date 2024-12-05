import React, { useEffect, useState } from 'react';
import './profile.css';

import nameIcon from './icon/name.png';
import notifIcon from './icon/notif.png';
import moduleIcon from './icon/module.png';
import dashboardIcon from './icon/dashboard.png';
import settingsIcon from './icon/settings.png';
import helpIcon from './icon/help.png';
import logoIcon from './icon/logo.png';

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
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
<<<<<<< HEAD:src/profile.jsx
                const idNumber = localStorage.getItem("userIdNumber");
=======
                // Replace with the actual id_number logic (e.g., from localStorage)
                const idNumber = localStorage.getItem("userIdNumber"); 
>>>>>>> 358cb3b4 (12/05/2024):src/page/Profile/profile.jsx
                if (!idNumber) {
                    setError("User not logged in");
                    setLoading(false);
                    return;
                }

                const response = await fetch(`http://localhost:8000/api/profile/${idNumber}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch profile");
                }

                const data = await response.json();
                setProfile(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
<<<<<<< HEAD:src/profile.jsx
            {/* Header */}
            <header className="header">
                <div className="header-content">
                    <div className="header-logo">
                        <img src={logoIcon} alt="logo" />
                    </div>
=======
            <header className="header">zz
                <img src={logoIcon} alt="logo" />   
                <div className="header-icons">
                    <img src={nameIcon} alt="Profile" />
                    <img src={notifIcon} alt="Notifications" />
>>>>>>> 358cb3b4 (12/05/2024):src/page/Profile/profile.jsx
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
                                <label>Name: {profile.firstname} {profile.lastname}</label>
                            </div>
                            <div className="row">
<<<<<<< HEAD:src/profile.jsx
                                <label>Age: {profile.age || "N/A"}</label>
                            </div>
                            <div className="row">
                                <label>Id Number: {profile.id_number}</label>
                            </div>
                            <div className="row">
=======
                                <label>Id Number: {profile.id_number}</label>
                            </div>
                            <div className="row">
>>>>>>> 358cb3b4 (12/05/2024):src/page/Profile/profile.jsx
                                <label>Program: {profile.program}</label>
                            </div>
                        </div>
                        <div className="section activity-info">
                            <h3>Activity Information</h3>
                            <div className="row">
                                <label>Hours Activity: {profile.hoursActivity}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

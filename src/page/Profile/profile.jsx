import React, { useEffect, useState } from 'react';
import './profile.css';

import nameIcon from './icon/name.png';
import notifIcon from './icon/notif.png';
import moduleIcon from './icon/module.png';
import dashboardIcon from './icon/dashboard.png';
import settingsIcon from './icon/settings.png';
import helpIcon from './icon/help.png';

const SidebarItem = ({ icon, text, link }) => (
    <li>
        <img src={icon} alt={`${text} Icon`} width="30%" height="30%" />
        <a href={link}>{text}</a>
    </li>
);

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Replace with the actual id_number logic (e.g., from localStorage)
                const idNumber = localStorage.getItem("userIdNumber"); 
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
            <header className="header">zz
                <img src={logoIcon} alt="logo" />   
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
                <div className="settings-section">
                    <div className="profilebox" style={{ flexGrow: 1 }}>
                        <h2>Account Profile</h2>
                        <div className="row">
                            <div className="profile-image">
                                <img src={nameIcon} alt="Profile Picture" width="100%" height="100%" />
                            </div>
                            <div></div>
                        </div>
                    </div>
                    <div className="sectionholder">
                        <div className="section-box">
                            <div className="row">
                                <label>Name: {profile.firstname} {profile.lastname}</label>
                            </div>
                            <div className="row">
                                <label>Id Number: {profile.id_number}</label>
                            </div>
                            <div className="row">
                                <label>Program: {profile.program}</label>
                            </div>
                        </div>
                        <div className="section-box">
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

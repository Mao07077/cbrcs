import React, { useEffect, useState } from 'react';
import './profile.css';

import nameIcon from '../../icon/name.png';
import Header from '../../icon/Header';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
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
            {/* Header */}
            <header className="header">
                <Header />
            </header>
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
                                <label>Age: {profile.age || "N/A"}</label>
                            </div>
                            <div className="row">
                                <label>Id Number: {profile.id_number}</label>
                            </div>
                            <div className="row">
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
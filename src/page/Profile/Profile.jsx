import React, { useEffect, useState } from 'react';
import Styles from './profile.module.css';

import nameIcon from '../../icon/name.png';
import Header from '../../Components/Header';

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
        <div className={Styles.Main_Profiles}>
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
                    <div className={Styles.Profilebox}>
                        <div className={Styles.Profile_image}>
                            <img src={nameIcon} alt="Profile Picture" />
                        </div>
                    </div>
                    <div className="separator-line"></div>
                    <div className={Styles.Main_Sectionholder}>
                    <div className={Styles.Section_holder}>
                        <div className={Styles.Section_personal_info}>
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
                        <div className={Styles.Section_activity_info}>
                            <h3>Activity Information</h3>
                            <div className="row">
                                <label>Hours Activity: {profile.hoursActivity}</label>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
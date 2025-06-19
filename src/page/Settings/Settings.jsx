import React, { useState, useEffect } from 'react';
import Styles from './Settings.module.css';
import Header from '../../Components/composables/Header';
import Footer from '../../Components/composables/FooterS';
import Student_Sidebar from '../../Components/Student_Sidebar';

const Settings = () => {
    const handleNavigation = (route) => {
        console.log(`Navigating to: ${route}`);
        window.location.href = `/${route}`;
    };

    const [formData, setFormData] = useState({
        firstname: '',
        middlename: '',
        lastname: '',
        suffix: '',
        birthdate: '',
        email: '',
        program: '',
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(true);
    const [requestSent, setRequestSent] = useState(false);
    const [error, setError] = useState(null);

    // Set API URL dynamically based on the environment
    const apiUrl = process.env.REACT_APP_API_URL || 

        (window.location.hostname === "localhost" ? "http://127.0.0.1:8000" : "http://127.0.0.1:8000 ");
        (window.location.hostname === "localhost" ? "http://127.0.0.1:8000" : "https://c3a1-2405-8d40-448f-2d57-c4b-6820-175b-382a.ngrok-free.app ");

    // Common headers for fetch requests
    const requestHeaders = {
        'ngrok-skip-browser-warning': 'true', // Bypasses ngrok warning page
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const idNumber = localStorage.getItem('userIdNumber');
            if (!idNumber) {
                setError('User ID not found. Please log in.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${apiUrl}/user/settings/${idNumber}`, {
                    headers: requestHeaders, // Add headers here
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch user data: ${response.status} ${response.statusText}`);
                }
                const result = await response.json();
                if (result.success) {
                    setFormData({
                        firstname: result.data.firstname || '',
                        middlename: result.data.middlename || '',
                        lastname: result.data.lastname || '',
                        suffix: result.data.suffix || '',
                        birthdate: result.data.birthdate || '',
                        email: result.data.email || '',
                        program: result.data.program || '',
                        username: result.data.username || '',
                        password: '', // Don't prefill the password for security reasons
                    });
                } else {
                    throw new Error(result.detail || 'Failed to load user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError(error.message || 'Error loading user data');
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [apiUrl]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const confirmed = window.confirm(
            'Are you sure you want to send the request to the admin?'
        );
        if (!confirmed) return;

        const idNumber = localStorage.getItem('userIdNumber');
        if (!idNumber) {
            setError('User ID not found. Please log in.');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/user/settings/request/${idNumber}`, {
                method: 'POST',
                headers: requestHeaders, // Add headers here
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error(`Failed to send request: ${response.status} ${response.statusText}`);
            }
            const result = await response.json();
            if (result.success) {
                setRequestSent(true);
                setError(null);
            } else {
                throw new Error(result.detail || 'Failed to send request');
            }
        } catch (error) {
            console.error('Error sending request:', error);
            setError(error.message || 'Error sending request');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className={Styles.MainContainer}>
            <Header />
            <div className={Styles.Content_Wrapper}>
                <Student_Sidebar />
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
                                        <button
                                            type="submit"
                                            className={Styles.Submit_Button}
                                            onClick={handleSubmit}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Settings;
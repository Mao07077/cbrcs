import React, { useState } from 'react';
import axios from 'axios';
import MainHeader from '../../Components/MainHeader';
import Styles from './Reset_password.module.css';

const API_URL = "https://g28s4zdq-8000.asse.devtunnels.ms/";
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "https://g28s4zdq-8000.asse.devtunnels.ms/"
    : "https://g28s4zdq-8000.asse.devtunnels.ms/");
const ResetPassword = () => {
    const [userId, setUserId] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    // Common headers for axios requests
    const requestHeaders = {
        'ngrok-skip-browser-warning': 'true', // Bypasses ngrok warning page
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await axios.post(`${API_URL}/api/reset_password`, {
                id_number: userId,
                reset_code: resetCode,
                new_password: newPassword,
            }, {
                headers: requestHeaders, // Add headers here
            });
            setMessage(response.data.message || 'Password reset successfully.');
        } catch (error) {
            console.error('Reset password error:', error.response?.data || error.message);
            setMessage(error.response?.data?.detail || 'An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <header className="header">
                <MainHeader />
            </header>
            <div className={Styles.Container}>
                <h2>Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="user_id">User ID:</label>
                    <input
                        type="text"
                        name="user_id"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    />
                    <label htmlFor="reset_code">Reset Code:</label>
                    <input
                        type="text"
                        name="reset_code"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value)}
                        required
                    />
                    <label htmlFor="new_password">New Password:</label>
                    <input
                        type="password"
                        name="new_password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <button className={Styles.Submit} type="submit">Reset Password</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    ); 
};

export default ResetPassword;
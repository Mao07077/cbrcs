import React, { useState } from 'react';
import axios from 'axios';
import './login.css';
import Icon from '../../icon/actual.png';
import cbrcimage from '../../icon/carlbalita.jpg';

const API_URL = "http://127.0.0.1:8000";
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : "http://127.0.0.1:8000");
function Login() {
    const [idNumber, setIdNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Common headers for axios requests
    const requestHeaders = {
        'ngrok-skip-browser-warning': 'true', // Bypasses ngrok warning page
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/api/login`, { idNumber, password }, {
                headers: requestHeaders, // Add headers here
            });
            if (response.data.success) {
                localStorage.setItem('userIdNumber', response.data.id_number);
                localStorage.setItem('userRole', response.data.role);
                localStorage.setItem('userProgram', response.data.program || 'N/A');
                localStorage.setItem('firstname', response.data.firstname || 'Unknown');
                localStorage.setItem('lastname', response.data.lastname || 'Unknown');
                localStorage.setItem('hoursActivity', response.data.hoursActivity || '0');
                localStorage.setItem('surveyCompleted', response.data.surveyCompleted || 'false');

                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                } else {
                    console.warn('No token received from backend');
                }

                const role = response.data.role;
                const surveyTaken = response.data.surveyCompleted;

                if (role === 'student') {
                    window.location.href = surveyTaken ? '/module' : '/survey';
                } else if (role === 'admin') {
                    window.location.href = '/admin_dashboard';
                } else if (role === 'instructor') {
                    window.location.href = '/instructor_dashboard';
                } else {
                    setError('Unknown role');
                }
            } else {
                setError(response.data.message || 'Invalid ID number or password');
            }
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            setError(error.response?.data?.detail || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <header className="header">
                <div className="header-content">
                    <div className="header-logo">
                        <img src={Icon} alt="CBRC Logo" />
                    </div>
                </div>
            </header>

            <main className="login-page">
                <div className="login-content">
                    <div className="login-box">
                        <div className="login-logo">
                            <img src={Icon} alt="CBRC Logo" />
                        </div>

                        {error && <p className="error-message">{error}</p>}
                        <form onSubmit={handleSubmit} noValidate>
                            <input
                                type="number"
                                placeholder="ID Number"
                                value={idNumber}
                                onChange={(e) => setIdNumber(e.target.value)}
                                required />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required />
                            <button type="submit" className="login-button" disabled={isLoading}>
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </button>
                            <div className="links">
                                <a href="/forgot_password">Forgot Password?</a>
                                <a href="/signup">Sign Up</a>
                            </div>
                        </form>
                    </div>

                    <div className="cbrc">
                        <img src={cbrcimage} alt="Carl Balita" />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Login;
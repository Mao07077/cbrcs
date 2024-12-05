import React, { useState } from 'react';
import axios from 'axios';
<<<<<<< HEAD:src/login.jsx
import './login.css';
import logoIcon from './icon/logo.png'; // Logo image import
=======
import './Login.css';
import logoIcon from '../../icon/logo.png';

>>>>>>> 358cb3b4 (12/05/2024):src/page/Login/Login.jsx

const Login = () => {
    const [idNumber, setIdNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login', { idNumber, password });
            if (response.data.success) {
                // Save the logged-in user's ID number to localStorage
                localStorage.setItem('userIdNumber', idNumber);

                // Redirect to the module page upon successful login
                window.location.href = '/module';
            } else {
                setError('Invalid ID number or password');
            }
        } catch (error) {
            // Log the error for debugging purposes
            console.error('Login error:', error);
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
<<<<<<< HEAD:src/login.jsx
            {/* Header */}
            <header className="header">
                <div className="header-content">
                    <div className="header-logo">
                        <img src={logoIcon} alt="Company Logo" />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="login-page">
                <div className="login-box">
                    <h2>Log-in</h2>
                    {error && <p className="error-message">{error}</p>}
                    <form onSubmit={handleSubmit} noValidate>
=======
            <div className="header">
                <img src={logoIcon} alt="logo" />
            </div>

            {/* Center Wrapper */}
            <div className="center-wrapper">
                <div className="login-container">
                   <div className= {"login_text"}>
                    <h2>LOG IN</h2>
                    </div>
                    {error && <p className="error">{error}</p>}
                    <form onSubmit={handleSubmit}>
>>>>>>> 358cb3b4 (12/05/2024):src/page/Login/Login.jsx
                        <input
                            type="number"
                            placeholder="ID Number"
                            value={idNumber}
                            onChange={(e) => setIdNumber(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                        <div className="links">
                            <a href="/forgot_password">Forgot Password?</a>
                            <a href="/signup">Sign Up</a>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Login;

import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import logoIcon from '../../icon/logo.png';


const Login = () => {
    const [idNumber, setIdNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Sending login request", { idNumber, password });
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login', { idNumber, password });
            console.log("Response:", response.data); // Log the response
            if (response.data.success) {
                // Save the user's ID number to localStorage on successful login
                localStorage.setItem('userIdNumber', idNumber);
                window.location.href = '/module'; // Redirect to module page on success
            } else {
                setError('Invalid ID number or password');
            }
        } catch (err) {
            console.error("Error during login:", err); // Log error details
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div>
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
                        <input
                            type="number"
                            name="id_number"
                            placeholder="ID Number"
                            value={idNumber}
                            onChange={(e) => setIdNumber(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div className="links-container">
                            <a href="/forgot_password">Forgot password?</a>
                            <a href="/signup">Sign Up</a>
                        </div>
                        <button type="submit" className="Sign-bot">Sign-in</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;

import React, { useState } from 'react';
import axios from 'axios';
import './login.css';
import logoIcon from '../../icon/logo.png';

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
                // Save the user's program, ID number, and role to localStorage
                localStorage.setItem('userIdNumber', idNumber);
                if (response.data.program) {
                    localStorage.setItem('userProgram', response.data.program);
                } else {
                    console.warn('Program not available for this user.');
                }
                localStorage.setItem('userRole', response.data.role);

                // Redirect based on the role of the account
                const role = response.data.role;
                if (role === 'student') {
                    window.location.href = '/module';
                } else if (role === 'admin') {
                    window.location.href = '/admin_dashboard';
                } else if (role === 'instructor') {
                    window.location.href = '/instructor_dashboard';
                } else {
                    setError('Unknown role');
                }
            } else {
                setError('Invalid ID number or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div>
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

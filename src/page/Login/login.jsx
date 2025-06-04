import React, { useState } from 'react';
import './login.css';
import Icon from '../../icon/actual.png';
import cbrcimage from '../../icon/carlbalita.jpg';

function Login() {
    const [idNumber, setIdNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Hardcoded credentials
        const hardcodedId = '111';
        const hardcodedPassword = 'password'; // set your hardcoded password here

        if (idNumber === hardcodedId && password === hardcodedPassword) {
            localStorage.setItem('userIdNumber', '111');
            localStorage.setItem('userRole', 'student');
            localStorage.setItem('userProgram', 'LET');
            localStorage.setItem('firstname', 'mark');
            localStorage.setItem('lastname', 'manuson');
            localStorage.setItem('hoursActivity', '0');
            localStorage.setItem('surveyCompleted', 'true');
            setIsLoading(false);
            window.location.href = '/module';
        } else {
            setError('Invalid ID number or password');
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

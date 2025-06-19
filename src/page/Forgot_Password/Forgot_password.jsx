import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './forgot_password.css';
import Icon from '../../icon/actual.png';

const API_URL = "https://g28s4zdq-8000.asse.devtunnels.ms/";
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "https://g28s4zdq-8000.asse.devtunnels.ms/"
    : "https://g28s4zdq-8000.asse.devtunnels.ms/");
  
const ForgotPassword = () => {
    const [idNumber, setIdNumber] = useState('');
    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [codeSent, setCodeSent] = useState(false);
    const navigate = useNavigate();

    // Common headers for axios requests
    const requestHeaders = {
        'ngrok-skip-browser-warning': 'true', // Bypasses ngrok warning page
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    const handleSendCode = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await axios.post(`${API_URL}/api/forgot_password`, {
                id_number: idNumber,
                email: email,
            }, {
                headers: requestHeaders, // Add headers here
            });

            if (response.data.success) {
                setMessage('Reset email has been sent.');
                setCodeSent(true);
            } else {
                setError(response.data.message || 'Failed to send reset email.');
            }
        } catch (error) {
            console.error("Error sending reset email:", error.response?.data || error.message);
            setError(error.response?.data?.detail || 'Failed to send email. Please try again.');
        }
    };

    const handleConfirmCode = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await axios.post(`${API_URL}/api/confirm_reset_code`, {
                id_number: idNumber,
                email: email,
                reset_code: resetCode,
            }, {
                headers: requestHeaders, // Add headers here
            });

            if (response.data.success) {
                setMessage('Reset code confirmed. You can now reset your password.');
                navigate('/reset_password');
            } else {
                setError(response.data.message || 'Failed to confirm reset code.');
            }
        } catch (error) {
            console.error("Error confirming reset code:", error.response?.data || error.message);
            setError(error.response?.data?.detail || 'Failed to confirm code. Please check the code and try again.');
        }
    };

    return (
        <div className="forgot-password-page">
            <header className="header">
                <div className="header-content">
                    <div className="header-logo">
                        <img src={Icon} alt="actual" />
                    </div>
                </div>
            </header>
            <main className="forget-page">
                <div className="forget-container responsive-container">
                    <div className="forget-box responsive-box">
                        <div className="forgot-logo">
                            <img src={Icon} alt="actual" />
                        </div>
                        <h2>Forgot Password</h2>
                        {error && <p className="error">{error}</p>}
                        {message && <p className="message">{message}</p>}

                        <form onSubmit={handleSendCode}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <input
                                type="number"
                                name="id_number"
                                placeholder="ID Number"
                                value={idNumber}
                                onChange={(e) => setIdNumber(e.target.value)}
                                required
                            />
                            <button type="submit" className="forgot-password-send-code-btn">Send Code</button>
                        </form>

                        {codeSent && (
                            <form onSubmit={handleConfirmCode}>
                                <input
                                    type="text"
                                    name="reset_code"
                                    placeholder="Enter Code"
                                    value={resetCode}
                                    onChange={(e) => setResetCode(e.target.value)}
                                    required
                                />
                                <button type="submit" className="forgot-password-confirm-btn">Confirm</button>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ForgotPassword;
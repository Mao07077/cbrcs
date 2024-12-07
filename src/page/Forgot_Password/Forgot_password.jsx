import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './forgot_password.css';
import logoIcon from '../../icon/logo.png';
const ForgotPassword = () => {
    const [idNumber, setIdNumber] = useState('');
    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [codeSent, setCodeSent] = useState(false);
    const navigate = useNavigate(); // Initialize navigate

    const handleSendCode = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/forgot_password', {
                id_number: idNumber,
                email: email,
            });

            if (response.data.success) {
                setMessage('Reset email has been sent.');
                setCodeSent(true);
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error("Error sending reset email:", error);
            setError('Failed to send email. Please try again.');
        }
    };

    const handleConfirmCode = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/confirm_reset_code', {
                id_number: idNumber,
                email: email,
                reset_code: resetCode,
            });

            if (response.data.success) {
                setMessage('Reset code confirmed. You can now reset your password.');
                navigate('/reset_password'); // Navigate to reset password page
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error("Error confirming reset code:", error);
            setError('Failed to confirm code. Please check the code and try again.');
        }
    };

    return (
        <div>
           <header className="header">
                <div className="header-content">
                    <div className="header-logo">
                        <img src={logoIcon} alt="logo" />
                    </div>
                    </div>
                    </header>

            <div className="forgot-container">
                <h2>Forgot Password</h2>
                {error && <p className="error">{error}</p>}
                {message && <p className="message">{message}</p>}
                
                {/* Send Reset Code Form */}
                <form onSubmit={handleSendCode}>
                    <input
                        type="number"
                        name="id_number"
                        placeholder="ID Number"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="send-code-btn">Send Code</button>
                </form>

                {/* Confirm Code Form, only visible if the code was sent */}
                {codeSent && (
                    <form onSubmit={handleConfirmCode}>
                        <div className="code-container">
                            <input
                                type="text"
                                name="reset_code"
                                placeholder="Enter Code"
                                value={resetCode}
                                onChange={(e) => setResetCode(e.target.value)}
                                required
                            />
                            <button type="submit" className="confirm-btn">Confirm</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;

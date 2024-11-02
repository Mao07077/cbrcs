import React, { useState } from 'react';
import axios from 'axios';
import './forgot_password.css';

const ForgotPassword = () => {
    const [idNumber, setIdNumber] = useState('');
    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

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
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error("Error sending reset email:", error);
            setError('Failed to send email.');
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
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error("Error confirming reset code:", error);
            setError('Failed to confirm code.');
        }
    };

    return (
        <div>
            <div className="header">
                <h1>Logo here</h1>
            </div>

            <div className="forgot-container">
                <h2>Forgot Password</h2>
                {error && <p className="error">{error}</p>}
                {message && <p className="message">{message}</p>}
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

                <form onSubmit={handleConfirmCode}>
                    <div className="code-container">
                        <input
                            type="text"
                            name="reset_code"
                            placeholder="Enter Code"
                            value={resetCode}
                            onChange={(e) => setResetCode(e.target.value)}
                        />
                        <button type="submit" className="confirm-btn">Confirm</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;

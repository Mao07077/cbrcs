import React, { useState } from 'react';
import axios from 'axios';
import './forgot_password.css';

const ForgotPassword = () => {
    const [idNumber, setIdNumber] = useState('');
    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await axios.post('/api/forgot_password', {
                id_number: idNumber,
                email: email,
            });

            if (response.data.success) {
                setMessage('Reset email has been sent.');
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError('Failed to send email.');
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
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <div className="code-container">
                        <input
                            type="text"
                            name="reset_code"
                            placeholder="Enter Code"
                            value={resetCode}
                            onChange={(e) => setResetCode(e.target.value)}
                        />
                        <button type="submit" className="send-code-btn">Send Code</button>
                    </div>

                    <button type="submit" className="confirm-btn">Confirm</button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;

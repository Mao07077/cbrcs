import React, { useState } from 'react';
import axios from 'axios';

const ResetPassword = () => {
    const [userId, setUserId] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/reset_password', {
                user_id: userId,
                reset_code: resetCode,
                new_password: newPassword,
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div>
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
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPassword;

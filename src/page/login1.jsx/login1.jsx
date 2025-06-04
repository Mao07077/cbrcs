import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL ||
    (window.location.hostname === "localhost"
        ? "http://127.0.0.1:8000"
        : "https://c3a1-2405-8d40-448f-2d57-c4b-6820-175b-382a.ngrok-free.app");

function Login1() {  
    const [idNumber, setIdNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/api/login`, { idNumber, password });
            if (response.data.success) {
                localStorage.setItem('userIdNumber', response.data.id_number);
                localStorage.setItem('userRole', response.data.role);
                if (response.data.token) localStorage.setItem('token', response.data.token);

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
            setError(error.response?.data?.detail || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f5f5f5'
        }}>
            <form
                onSubmit={handleSubmit}
                style={{
                    background: '#fff',
                    padding: 24,
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    minWidth: 300,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                }}
            >
                <h2 style={{ textAlign: 'center', margin: 0 }}>Login</h2>
                {error && <div style={{ color: 'red', fontSize: 14 }}>{error}</div>}
                <input
                    type="number"
                    placeholder="ID Number"
                    value={idNumber}
                    onChange={e => setIdNumber(e.target.value)}
                    required
                    style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        padding: 10,
                        borderRadius: 4,
                        border: 'none',
                        background: '#1976d2',
                        color: '#fff',
                        fontWeight: 'bold',
                        cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>
        </div>
    );
}

export default Login1;
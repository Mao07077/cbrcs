import React, { useState } from 'react';
import axios from 'axios';
import './SendReport.css';
import Header from '../../Components/composables/Header';
import Footer from '../../Components/composables/FooterP';
import Student_Sidebar from '../../Components/Student_Sidebar';

const API_URL = "https://g28s4zdq-8000.asse.devtunnels.ms/";
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "https://g28s4zdq-8000.asse.devtunnels.ms/"
    : "https://g28s4zdq-8000.asse.devtunnels.ms/");
const SendReport = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [screenshot, setScreenshot] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Common headers for axios requests
    const requestHeaders = {
        'ngrok-skip-browser-warning': 'true', // Bypasses ngrok warning page
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
    };

    const handleFileChange = (e) => {
        setScreenshot(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        // Fetch id_number from localStorage
        const id_number = localStorage.getItem('userIdNumber') || '123456'; // Fallback to '123456' if not found

        const formData = new FormData();
        formData.append('id_number', id_number);
        formData.append('title', title);
        formData.append('content', content);
        if (screenshot) {
            formData.append('screenshot', screenshot);
        }

        try {
            const response = await axios.post(`${API_URL}/api/reports`, formData, {
                headers: requestHeaders, // Use requestHeaders
            });

            setMessage(response.data.message || 'Report submitted successfully!');
            setTitle('');
            setContent('');
            setScreenshot(null);
            document.getElementById('screenshot').value = null; // Reset file input
        } catch (err) {
            console.error('Report submission error:', err.response?.data || err.message);
            setError(err.response?.data?.detail || 'An error occurred while submitting the report');
        }
    };

    return (
        <div className="Main">
            <Header />
            <div className="Content_Wrap">
                <Student_Sidebar />
                <div className="MainCon">
                    <div className="sr-send-report-container">
                        <h1 className="sr-send-report-title">Submit a Report</h1>
                        {message && <p className="sr-success-message">{message}</p>}
                        {error && <p className="sr-error-message">{error}</p>}
                        <form onSubmit={handleSubmit} className="sr-send-report-form">
                            <div className="sr-form-group">
                                <label htmlFor="title" className="sr-label">Title:</label>
                                <select
                                    id="title"
                                    className="sr-form-select"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select an issue</option>
                                    <option value="Credentials Issue">Credentials Issue</option>
                                    <option value="Cannot Open Module">Cannot Open Module</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="sr-form-group">
                                <label htmlFor="content" className="sr-label">Content:</label>
                                <textarea
                                    id="content"
                                    className="sr-form-textarea"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Provide details about your concern..."
                                    required
                                />
                            </div>
                            <div className="sr-form-group">
                                <label htmlFor="screenshot" className="sr-label">Attach a screenshot (optional):</label>
                                <input
                                    type="file"
                                    id="screenshot"
                                    className="sr-form-input"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <button type="submit" className="sr-submit-button">Send Report</button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SendReport;
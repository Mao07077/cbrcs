import React, { useState } from 'react';
import './SendReport.css'; // Import the CSS file

const SendReport = () => {
    const [content, setContent] = useState('');
    const [concernType, setConcernType] = useState('');
    const [screenshot, setScreenshot] = useState(null);

    const handleFileChange = (e) => {
        setScreenshot(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const reportData = {
            title: concernType,
            content,
            screenshot,
        };

        // Simulate sending the report
        console.log('Report submitted:', reportData);

        // Clear the form
        setContent('');
        setConcernType('');
        setScreenshot(null);
    };

    return (
        <div className="send-report-container">
            <h1 className="send-report-title">Submit a Report</h1>
            <form className="send-report-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="concernType">What is your concern about the website?</label>
                    <select
                        id="concernType"
                        className="form-select"
                        value={concernType}
                        onChange={(e) => setConcernType(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select a concern</option>
                        <option value="Bug">Bug</option>
                        <option value="UI/UX Issue">UI/UX Issue</option>
                        <option value="Performance">Performance</option>
                        <option value="Feature Request">Feature Request</option>
                        <option value="Login Issues">Login Issues</option>
                        <option value="Credentials Issue">Credentials Issue</option>
                        <option value="Cannot Open Module">Cannot Open Module</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        className="form-textarea"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Provide details about your concern..."
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="screenshot">Attach a screenshot (optional):</label>
                    <input
                        type="file"
                        id="screenshot"
                        className="form-input"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
                <button type="submit" className="submit-button">Send Report</button>
            </form>
        </div>
    );
};

export default SendReport;
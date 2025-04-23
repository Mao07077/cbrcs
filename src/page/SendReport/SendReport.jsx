import React, { useState } from 'react';
import './SendReport.css'; // Import your CSS file for styling

const SendReport = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [screenshot, setScreenshot] = useState(null);

    const handleFileChange = (e) => {
        setScreenshot(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const reportData = { title, content, screenshot };

        // Simulate sending the report
        console.log('Report submitted:', reportData);

        // Clear the form
        setTitle('');
        setContent('');
        setScreenshot(null);
    };

    return (
        <div className="sr-send-report-container">
            <h1 className="sr-send-report-title">Submit a Report</h1>
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
    );
};

export default SendReport;
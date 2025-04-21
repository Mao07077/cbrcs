import React, { useState } from 'react';

const SendReport = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const reportData = { title, content };

        // Simulate sending the report
        console.log('Report submitted:', reportData);

        // Clear the form
        setTitle('');
        setContent('');
    };

    return (
        <div>
            <h1>Submit a Report</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Send Report</button>
            </form>
        </div>
    );
};

export default SendReport;
import React, { useState } from 'react';

const UploadModule = () => {
    const [title, setTitle] = useState('');
    const [pdf, setPdf] = useState(null);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('pdf', pdf);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                setMessage('Module uploaded successfully!');
            } else {
                setMessage(`Error uploading module: ${result.error}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <h1>Upload Module</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>PDF:</label>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setPdf(e.target.files[0])}
                        required
                    />
                </div>
                <button type="submit">Upload</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UploadModule;

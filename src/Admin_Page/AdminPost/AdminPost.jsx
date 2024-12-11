
import React, { useState } from 'react';
import AdminHeader from '../../Components/Admin_Header';

const AdminPost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handlePost = () => {
        // Logic to post the news (e.g., API call)
        console.log('Title:', title);
        console.log('Content:', content);
    };

    return (
        <div className="admin-post-container">
            <header className="header">
                <AdminHeader />
            </header>
            <h2>Post News</h2>
            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>
            <button type="button" onClick={handlePost}>Post</button>
        </div>
    );
};

export default AdminPost;

import React, { useState } from 'react';
import AdminHeader from '../../Components/Admin_Header';

const AdminPost = () => {
    // State to manage the intro text and uploaded images
    const [introText, setIntroText] = useState({
        header: 'Welcome to Dr. Carl Balita Review Center Student Portal',
        subHeader: 'Where the dream and the dreamer become ONE!',
    });
    const [news, setNews] = useState('');
    const [images, setImages] = useState([]); // Store uploaded images

    // Handle editing intro text
    const handleEditIntro = () => {
        const newHeader = prompt('Enter new header text:', introText.header);
        const newSubHeader = prompt('Enter new sub-header text:', introText.subHeader);
        if (newHeader && newSubHeader) {
            const newIntroText = { header: newHeader, subHeader: newSubHeader };
            setIntroText(newIntroText);
            localStorage.setItem('introText', JSON.stringify(newIntroText)); // Save to localStorage
        }
    };

    // Handle image uploads
    const handleImageUpload = (e) => {
        const files = e.target.files;
        const fileArray = Array.from(files).map(file => URL.createObjectURL(file));
        setImages(prevImages => {
            const updatedImages = [...prevImages, ...fileArray];
            localStorage.setItem('uploadedImages', JSON.stringify(updatedImages)); // Save to localStorage
            return updatedImages;
        });
    };

    // Handle adding news
    const handleNewsChange = (e) => {
        setNews(e.target.value);
        localStorage.setItem('news', e.target.value); // Save to localStorage
    };

    return (
        <div className="main-container">
            <header className="header">
                <AdminHeader />
            </header>
            <div className="intro-container">
                <div className="text-container">
                    <h1>{introText.header}</h1>
                    <p>{introText.subHeader}</p>
                    <div className="buttons">
                        <button type="button" className="login" onClick={() => window.location.href = 'login'}>Log-in</button>
                        <button type="button" className="signup" onClick={() => window.location.href = 'signup'}>Sign-Up</button>
                    </div>
                    <button onClick={handleEditIntro}>Edit Intro</button>
                </div>

                <div className="placeholder-box">
                    {/* Render images preview */}
                    {images.length > 0 && (
                        <div className="image-previews">
                            {images.map((image, index) => (
                                <img key={index} src={image} alt={`Uploaded Preview ${index + 1}`} />
                            ))}
                        </div>
                    )}
                    <input 
                        type="file" 
                        multiple 
                        onChange={handleImageUpload} 
                        accept="image/*" 
                    />
                </div>
            </div>

            <div className="news-container">
                <textarea 
                    value={news}
                    onChange={handleNewsChange}
                    placeholder="Write news or announcements here..."
                />
                <button onClick={() => alert('News added: ' + news)}>Add News</button>
            </div>

            <div className="featured-courses">
                <div className="featured-text">
                    <h2>Featured Courses</h2>
                    <p>Browse through our top performing courses</p>
                    <button>View All Courses</button>
                </div>

                <div className="course-grid">
                    {/* Example Course Cards */}
                    <div className="course-card">
                        <div className="placeholder"></div>
                        <div className="course-label">Top Rated</div>
                        <div className="course-title">Course Image 1</div>
                    </div>
                    <div className="course-card">
                        <div className="placeholder"></div>
                        <div className="course-label">Recommended</div>
                        <div className="course-title">Course Image 2</div>
                    </div>
                    <div className="course-card">
                        <div className="placeholder"></div>
                        <div className="course-label">New</div>
                        <div className="course-title">Course Image 3</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPost;

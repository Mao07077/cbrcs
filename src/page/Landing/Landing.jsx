import React, { useEffect, useState } from 'react';
import './landing.css';
import logoIcon from '../../icon/logo.png';
import Header from '../../Components/Header';

const Landing = () => {
    const [introText, setIntroText] = useState({ header: '', subHeader: '' });
    const [images, setImages] = useState([]);
    const [news, setNews] = useState('');

    useEffect(() => {
        // Get stored data from localStorage
        const savedIntroText = localStorage.getItem('introText');
        const savedImages = localStorage.getItem('uploadedImages');
        const savedNews = localStorage.getItem('news');

        if (savedIntroText) {
            setIntroText(JSON.parse(savedIntroText));
        }
        if (savedImages) {
            setImages(JSON.parse(savedImages));
        }
        if (savedNews) {
            setNews(savedNews);
        }
    }, []);

    return (
        <> <header className="header">
    <Header />
  </header>
        <div className="main-container">
            <div>
                <div className="intro-container">
                    <div className="text-container">
                        <h1>{introText.header || 'Welcome to Dr. Carl Balita Review Center Student Portal'}</h1>
                        <p>{introText.subHeader || 'Where the dream and the dreamer become ONE!'}</p>
                        <div className="buttons">
                            <button type="button" className="login" onClick={() => window.location.href = 'login'}>Log-in</button>
                            <button type="button" className="signup" onClick={() => window.location.href = 'signup'}>Sign-Up</button>
                        </div>
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
                    </div>
                </div>

                <div className="news-container">
                    <h2>Latest News</h2>
                    <p>{news || 'No news available at the moment.'}</p>
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
        </div>
        </>
    );
};

export default Landing;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Styles from './Landing.module.css';
import Icon from '../../icon/actual.png';
import image from '../../icon/carlbalita.jpg';

const API_URL = process.env.REACT_APP_API_URL || 
    (window.location.hostname === "localhost" ? "http://127.0.0.1:8000" : "https://e9b7-2405-8d40-4896-dd96-74e0-7ffa-8c67-3b26.ngrok-free.app ");

const Landing = () => {
  const [introText, setIntroText] = useState({ header: '', subHeader: '' });
  const [news, setNews] = useState('');
  const [newsImage, setNewsImage] = useState(null);
  const [courseImages, setCourseImages] = useState([null, null, null]);
  const [introImage, setIntroImage] = useState(null);
  const [error, setError] = useState('');

  // Common headers for axios requests
  const requestHeaders = {
    'ngrok-skip-browser-warning': 'true', // Bypasses ngrok warning page
    'Accept': 'application/json',
  };

  useEffect(() => {
    // Fetch post data from backend
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/get_post`, {
          headers: requestHeaders, // Add headers here
        });
        const post = response.data.data;
        console.log('Fetched post data:', post); // Debug log
        setIntroText({
          header: post.intro?.header || '',
          subHeader: post.intro?.subHeader || '',
        });
        setIntroImage(post.intro?.introImage ? `${API_URL}/${post.intro.introImage}` : null);
        setNews(post.news?.content || '');
        setNewsImage(post.news?.newsImage ? `${API_URL}/${post.news.newsImage}` : null);
        setCourseImages(
          post.courseImages?.images?.map((img) => (img ? `${API_URL}/${img}` : null)) || [
            null,
            null,
            null,
          ]
        );
        setError('');
      } catch (error) {
        console.error('Error fetching post:', error.response?.data || error.message);
        setError(error.response?.data?.detail || 'Failed to load landing page content.');
      }
    };
    fetchPost();
  }, []);

  return (
    <div className={Styles.Landing_Page}>
      <div className={Styles.Header}>
        <div className="header-content">
          <div className="header-logo">
            <img src={Icon} alt="logo" />
          </div>
        </div>
      </div>
      <div className={Styles.Content}>
        {error && <p className={Styles.ErrorMessage}>{error}</p>}
        <div className={Styles.Intro_Container}>
          <div className={Styles.Text_Container}>
            <h1>
              {introText.header || 'Welcome to Dr. Carl Balita Review Center Student Portal'}
            </h1>
            <p>
              {introText.subHeader || 'Where the dream and the dreamer become ONE!'}
            </p>
            <div className={Styles.Buttons}>
              <button
                type="button"
                className={Styles.LoginBtn}
                onClick={() => (window.location.href = 'login')}
              >
                Log-in
              </button>
            </div>
          </div>
          <div className={Styles.Image_Container}>
            <img
              src={introImage || image}
              alt="carlbalita"
              onError={() => console.error('Failed to load intro image:', introImage)}
            />
          </div>
        </div>

        {/* News Section */}
        <div className={Styles.News_Container}>
          <h2>Latest News</h2>
          <div
            className={Styles.News_Card}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <div
              className={Styles.News_Image}
              style={{
                border: '1px dashed #ccc',
                height: '150px',
                width: '200px',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {newsImage ? (
                <img
                  src={newsImage}
                  alt="News"
                  style={{ maxWidth: '100%', maxHeight: '100%' }}
                  onError={() => console.error('Failed to load news image:', newsImage)}
                />
              ) : (
                <p style={{ color: '#888', textAlign: 'center' }}>
                  Image Placeholder
                </p>
              )}
            </div>
            <div>
              <h3>Announcement</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    news ||
                    'CBRC is proud to announce the launch of its new online learning platform, designed to make education accessible to everyone!',
                }}
              />
            </div>
          </div>
        </div>

        {/* CBRC Background Section */}
        <div className={Styles.Cbrc_Description}>
          <div className={Styles.Cbrc_Background}>
            <h2>Dr. Carl Balita Review Center</h2>
            <p>
              CBRC, popularly known as the Dr. Carl E. Balita Review Center, stands as the biggest, most awarded,
              and the only ISO 9001-2015 certified business of its kind. An off-shoot of the “review experience” of its founder
              Dr. Carl E. Balita, who started in the review industry in 1993, CBRC was founded in 2004 with just a chair and a table to boot.
              Since then, it has grown remarkably, boasting 125 branches in major cities nationwide, and has produced hundreds of topnotchers
              and thousands of board passers. This reputation underscores the importance of continually innovating and enhancing preparation
              methods to maintain its leadership in the industry.
            </p>
          </div>
        </div>

        {/* Featured Courses Section */}
        <div className="featured-courses">
          <div className="featured-text">
            <h2>Featured Courses</h2>
          </div>
          <p className={Styles.Featured_Description}>Browse through our top performing courses</p>
          <div className={Styles.Course_Grid}>
            {courseImages.map((image, index) => (
              <div
                key={index}
                className={`${Styles.Course_Card} ${index === 0 ? Styles.TopRated : index === 1 ? Styles.Recommended : Styles.New}`}
              >
                <div className={Styles.Placeholder}>
                  {image ? (
                    <img
                      src={image}
                      alt={`Course ${index + 1}`}
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                      onError={() => console.error(`Failed to load course image ${index + 1}:`, image)}
                    />
                  ) : (
                    <p>Placeholder</p>
                  )}
                </div>
                <div className={Styles.Course_Label}>
                  {index === 0 ? 'Top Rated' : index === 1 ? 'Recommended' : 'New'}
                </div>
                <div className={Styles.Course_Title}>Course Image {index + 1}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={Styles.Footer}>
          <img src={Icon} alt="actual" />
          <p>© 2024 Dr. Carl Balita Review Center. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
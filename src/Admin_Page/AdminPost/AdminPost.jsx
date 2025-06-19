import React, { useState } from 'react';
import Styles from './AdminPost.module.css';
import QuillStyles from './QuillStyles.module.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Admin_Sidebar from '../../Components/Admin_Sidebar';
import Footer from '../../Components/composables/FooterAdmin';
import Header from '../../Components/composables/Header';
import axios from 'axios';

const API_URL = "http://127.0.0.1:8000";
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : "http://127.0.0.1:8000");
const AdminPost = () => {
  const [introText, setIntroText] = useState({
    header: 'Welcome to Dr. Carl Balita Review Center Student Portal',
    subHeader: 'Where the dream and the dreamer become ONE!',
  });
  const [introImage, setIntroImage] = useState(null);
  const [newsContent, setNewsContent] = useState('');
  const [newsImage, setNewsImage] = useState(null);
  const [courseImages, setCourseImages] = useState([null, null, null]);
  const [newsStyle, setNewsStyle] = useState({
    fontSize: '14px',
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: '#333',
  });

  // Common headers for all axios requests
  const requestHeaders = {
    'ngrok-skip-browser-warning': 'true', // Bypasses ngrok warning page
    'Accept': 'application/json',
  };

  // Handlers for image uploads
  const handleSingleImageUpload = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      console.log('Selected image:', file.name); // Debug log
    }
  };

  const handleCourseImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      setCourseImages((prev) => {
        const updated = [...prev];
        updated[index] = file;
        console.log(`Selected course image ${index + 1}:`, file.name); // Debug log
        return updated;
      });
    }
  };

  const handleStyleChange = (key, value) => {
    setNewsStyle((prev) => ({ ...prev, [key]: value }));
  };

  // Handle intro submission
  const handleIntroSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('intro_header', introText.header);
      formData.append('intro_subHeader', introText.subHeader);
      if (introImage) {
        formData.append('intro_image', introImage);
        console.log('Intro image appended:', introImage.name);
      }
      const response = await axios.post(`${API_URL}/api/save_post`, formData, {
        headers: {
          ...requestHeaders, // Include ngrok header
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Intro submit response:', response.data); // Debug log
      alert(response.data.message);
    } catch (error) {
      console.error('Error saving [Intro Submit]:', error.response?.data || error.message);
      alert('Failed to save intro');
    }
  };

  // Handle news submission
  const handleNewsSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('news_content', newsContent);
      if (newsImage) {
        formData.append('news_image', newsImage);
        console.log('News image appended:', newsImage.name);
      }
      const response = await axios.post(`${API_URL}/api/save_post`, formData, {
        headers: {
          ...requestHeaders, // Include ngrok header
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('News submit response:', response.data); // Debug log
      alert(response.data.message);
    } catch (error) {
      console.error('Error [News Submit]:', error.response?.data || error.message);
      alert('Failed to post news');
    }
  };

  // Handle course images submission
  const handleCourseImagesSubmit = async () => {
    try {
      const formData = new FormData();
      courseImages.forEach((img, index) => {
        if (img) {
          formData.append(`course_image_${index + 1}`, img);
          console.log(`Course image ${index + 1} appended:`, img.name);
        }
      });
      const response = await axios.post(`${API_URL}/api/save_post`, formData, {
        headers: {
          ...requestHeaders, // Include ngrok header
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Course images submit response:', response.data); // Debug log
      alert(response.data.message);
    } catch (error) {
      console.error('Error [Course Images Submit]:', error.response?.data || error.message);
      alert('Failed to save course images');
    }
  };

  return (
    <div className={Styles.Maincontainer}>
      {/* Header */}
      <Header />
      {/* Wrapper */}
      <div className={Styles.Content_Wrapper}>
        {/* Sidebar */}
        <Admin_Sidebar />
        {/* Content */}
        <div className={Styles.Content}>
          {/* Intro Section */}
          <div className={Styles.Text_Container}>
            <h1>{introText.header}</h1>
            <p>{introText.subHeader}</p>
            {/* Intro Image */}
            <div className={Styles.Editable_Image_Input}>
              <label htmlFor="introImageUpload">Upload Intro Image:</label>
              <input
                type="file"
                id="introImageUpload"
                accept="image/*"
                onChange={(e) => handleSingleImageUpload(e, setIntroImage)}
              />
              {introImage && (
                <div className={Styles.Image_Previews}>
                  <img src={URL.createObjectURL(introImage)} alt="Intro Preview" />
                </div>
              )}
            </div>
            <button
              className={Styles.EditIntroSubmitButton}
              onClick={handleIntroSubmit}
            >
              Edit Intro
            </button>
          </div>

          {/* News Section */}
          <div className={Styles.News_Container}>
            <h2>Post News</h2>
            <div className={Styles.Editable_Image_Input}>
              <label htmlFor="newsImageUpload">Upload News Image:</label>
              <input
                type="file"
                id="newsImageUpload"
                accept="image/*"
                onChange={(e) => handleSingleImageUpload(e, setNewsImage)}
              />
              {newsImage && (
                <div className={Styles.Image_Previews}>
                  <img src={URL.createObjectURL(newsImage)} alt="News Preview" />
                </div>
              )}
            </div>
            <div className={QuillStyles.qlContainer}>
              <ReactQuill
                value={newsContent}
                onChange={setNewsContent}
                placeholder="Write your news or announcements here..."
                modules={{
                  toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link', 'image'],
                    ['clean'],
                  ],
                }}
                formats={[
                  'header',
                  'bold',
                  'italic',
                  'underline',
                  'strike',
                  'list',
                  'bullet',
                  'link',
                  'image',
                ]}
              />
            </div>
            <button
              className={Styles.NewsSubmitButton}
              onClick={handleNewsSubmit}
            >
              Post News
            </button>
          </div>

          {/* Featured Courses */}
          <div className={Styles.Featured_Courses}>
            <div className={Styles.Featured_Text}>
              <h2>Featured Courses</h2>
              <p>Browse through our top performing courses</p>
            </div>
            <div className={Styles.Course_Grid}>
              {courseImages.map((image, index) => (
                <div key={index} className={Styles.Course_Card}>
                  <div className={Styles.Editable_Image_Input}>
                    <label htmlFor={`courseImageUpload${index}`}>
                      Upload Course {index + 1} Image:
                    </label>
                    <input
                      type="file"
                      id={`courseImageUpload${index}`}
                      accept="image/*"
                      onChange={(e) => handleCourseImageUpload(e, index)}
                    />
                    {image && (
                      <div className={Styles.Image_Previews}>
                        <img src={URL.createObjectURL(image)} alt={`Course ${index + 1} Preview`} />
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    className={Styles.Editable_Text}
                    placeholder={`Course ${index + 1} Title`}
                  />
                </div>
              ))}
            </div>
            <button
              className={Styles.NewsSubmitButton}
              onClick={handleCourseImagesSubmit}
            >
              Save Images
            </button>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminPost;
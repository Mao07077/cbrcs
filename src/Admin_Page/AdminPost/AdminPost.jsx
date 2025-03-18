
import React, { useState } from 'react';
import AdminHeader from '../../Components/Admin_Header';
import Styles from './AdminPost.module.css';
import Dashboard from '../../icon/dashboard.png'; 
import Icon from '../../icon/actual.png';
import Account from '../../icon/name.png';
import Report from '../../icon/Reports.png';
import AdminPosts from '../../icon/Upload.png';
import Request from '../../icon/request.png';


const SidebarItem = ({ icon, text, onClick }) => (
    <li>
      <button className="sidebar-item" onClick={onClick}>
        <img src={icon} alt={text} className="sidebar-icon" />
        <span>{text}</span>
      </button>
    </li>
  );
  
const AdminPost = () => {
    const handleNavigation = (route) => {
        console.log(`Navigating to: ${route}`);
      
        window.location.href = `/${route}`;
      };
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
        <div className={Styles.Maincontainer}>
        <div className={Styles.Header}> 
          <div className="header-content">
              <div className="header-logo">
                  <img src={Icon} alt="logo" />
              </div>
              
          </div></div>
           <nav className={Styles.Menu}> 
                <ul>
                  <li>
                    <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('Admin_Dashboard')}>
                      <img src={Dashboard} alt="Dashboard Icon" className={Styles.Sidebar_Icon} />
                      <span>Dashboard</span>
                    </buttonss>
                  </li>
                  <li>
                    <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('Accounts')}>
                      <img src={Account} alt="Accounts Icon" className={Styles.Sidebar_Icon} />
                      <span>Accounts</span>
                    </buttonss>
                  </li>
                  <li>
                    <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('Adminpost')}>
                      <img src={AdminPosts} alt="Adminpost Icon" className={Styles.Sidebar_Icon} />
                      <span>Uploads</span>
                    </buttonss>
                  </li>
                  <li>
                    <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('Report')}>
                      <img src={Report} alt="Report Icon" className={Styles.Sidebar_Icon} />
                      <span>Report</span>
                    </buttonss>
                  </li>
                  <li>
                    <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('Request')}>
                      <img src={Request} alt="Request Icon" className={Styles.Sidebar_Icon} />
                      <span>Request</span>
                    </buttonss>
                  </li>
                </ul>
               </nav>
               <div className={Styles.Content}>
                <div className={Styles.Text_Container}>
                    <h1>{introText.header}</h1>
                    <p>{introText.subHeader}</p>
                    <div className={Styles.Buttons}>
                        <button type="button" className="login" onClick={() => window.location.href = 'login'}>Log-in</button>
                        <button type="button" className="signup" onClick={() => window.location.href = 'signup'}>Sign-Up</button>
                    </div>
                    <button onClick={handleEditIntro}>Edit Intro</button>
                </div>

                <div className={Styles.Placeholder_Box}>
                    {images.length > 0 && (
                        <div className={Styles.Image_Previews}>
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
           

            <div className={Styles.News_Container}>
                <textarea 
                    value={news}
                    onChange={handleNewsChange}
                    placeholder="Write news or announcements here..."
                />
                <button onClick={() => alert('News added: ' + news)}>Add News</button>
            </div>

            <div className={Styles.Featured_Courses}>
                <div className={Styles.Featured_Text}>
                    <h2>Featured Courses</h2>
                    <p>Browse through our top performing courses</p>
                    <button>View All Courses</button>
                </div>

                <div className={Styles.Course_Grid}>
                    {/* Example Course Cards */}
                    <div className={Styles.Course_Card}>
                        <div className="placeholder"></div>
                        <div className="course-label">Top Rated</div>
                        <div className="course-title">Course Image 1</div>
                    </div>
                    <div className={Styles.Course_Card}>
                        <div className="placeholder"></div>
                        <div className="course-label">Recommended</div>
                        <div className="course-title">Course Image 2</div>
                    </div>
                    <div className={Styles.Course_Card}>
                        <div className="placeholder"></div>
                        <div className="course-label">New</div>
                        <div className="course-title">Course Image 3</div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default AdminPost;

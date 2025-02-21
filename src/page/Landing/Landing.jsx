import React, { useEffect, useState } from "react";
import "./landing.css";
import Icon from '../../icon/actual.png';
import image from '../../icon/carlbalita.jpg';


const Landing = () => {
    const [introText, setIntroText] = useState({ header: "", subHeader: "" });
    const [images, setImages] = useState([]);
    const [news, setNews] = useState("");

    useEffect(() => {
        // Get stored data from localStorage
        const savedIntroText = localStorage.getItem("introText");
        const savedImages = localStorage.getItem("uploadedImages");
        const savedNews = localStorage.getItem("news");

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
        <>
             <header className="header">
                                               <div className="header-content">
                                                   <div className="header-logo">
                                                       <img src={Icon} alt="actual" />
                                                   </div>
                                               </div>
                                           </header>

            <div className="main-container">
                <div>
                    <div className="intro-container">
                        <div className="text-container">
                            <h1>{introText.header || "Welcome to Dr. Carl Balita Review Center Student Portal"}</h1>
                            <p>{introText.subHeader || "Where the dream and the dreamer become ONE!"}</p>
                            <div className="buttons">
                                <button
                                    type="button"
                                    className="login"
                                    onClick={() => (window.location.href = "login")}
                                >
                                    Log-in
                                    
                                </button>
                            </div>
                        </div>
                        <div className="image-container">
        <img src={image} alt="carlbalita" />
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
{/* Newly added image below the news section */}
<div className="cbrc-description">
                        <div className="cbrc-background">
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


                    {/* News Section */}
                    <div className="news-container">
                        <h2>Latest News</h2>
                        <p>{news || "No news available at the moment."}</p>
                    </div>

                   

                    {/* Featured Courses Section */}
                    <div className="featured-courses">
                        <div className="featured-text">
                            <h2>Featured Courses</h2>
                            <p>Browse through our top performing courses</p>
                        </div>

                        <div className="course-grid">
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

            {/* Footer as an image */}
            <footer>
    <div className="footer">
        <img src={Icon} alt="actual" />
        <p>&copy; 2024 Dr. Carl Balita Review Center. All Rights Reserved.</p>
    </div>
</footer>

        </>
    );
};

export default Landing;

import React, { useEffect, useState } from "react";
import Styles from "./Landing.module.css";
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
        <div className={Styles.Landing_Page}>
          <div className={Styles.Header}>
        <div className="header-content">
        <div className="header-logo">
            <img src={Icon} alt="logo" />
        </div> </div>
        </div>
        <div className={Styles.Content}>
        
                    <div className={Styles.Intro_Container}>
                        <div className={Styles.Text_Container}>
                            <h1>{introText.header || "Welcome to Dr. Carl Balita Review Center Student Portal"}</h1>
                            <p>{introText.subHeader || "Where the dream and the dreamer become ONE!"}</p>
                            <div className={Styles.Buttons}>
                                <button
                                    type="button"
                                    className={Styles.LoginBtn}
                                    onClick={() => (window.location.href = "login")}
                                >
                                    Log-in
                                    
                                </button>
                            </div>
                        </div>
                        <div className={Styles.Image_Container}>
        <img src={image} alt="carlbalita" />
    </div>
</div>
                       
                    
{/* Newly added image below the news section */}
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


                    {/* News Section */}
                    <div className={Styles.News_Container}>
                        <h2>Latest News</h2>
                        <div className={Styles.News_Card} style={{ display: "flex", alignItems: "flex-start" }}>
                            {/* News Image Placeholder */}
                            <div className={Styles.News_Image} style={{ border: "1px dashed #ccc", height: "150px", width: "200px", marginRight: "15px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {images.length > 0 ? (
                                    <img src={images[0]} alt="News" style={{ maxWidth: "100%", maxHeight: "100%" }} />
                                ) : (
                                    <p style={{ color: "#888", textAlign: "center" }}>Image Placeholder</p> // Placeholder text
                                )}
                            </div>
                            <div>
                                <h3>Announcement</h3>
                                <p>{news || "CBRC is proud to announce the launch of its new online learning platform, designed to make education accessible to everyone!"}</p>
                            </div>
                        </div>
                    </div>

                   

                    {/* Featured Courses Section */}
                    <div className="featured-courses">
                        <div className="featured-text">
                            <h2>Featured Courses</h2>
                        </div>
                        <p className={Styles.Featured_Description}>Browse through our top performing courses</p>
                        <div className={Styles.Course_Grid}>
                            <div className={`${Styles.Course_Card} ${Styles.TopRated}`}>
                                <div className={Styles.Placeholder}></div>
                                <div className={Styles.Course_Label}>Top Rated</div>
                                <div className={Styles.Course_Title}>Course Image 1</div>
                            </div>
                            <div className={`${Styles.Course_Card} ${Styles.Recommended}`}>
                                <div className={Styles.Placeholder}></div>
                                <div className={Styles.Course_Label}>Recommended</div>
                                <div className={Styles.Course_Title}>Course Image 2</div>
                            </div>
                            <div className={`${Styles.Course_Card} ${Styles.New}`}>
                                <div className={Styles.Placeholder}></div>
                                <div className={Styles.Course_Label}>New</div>
                                <div className={Styles.Course_Title}>Course Image 3</div>
                            </div>
                        </div>
                    </div>
        
            {/* Footer as an image */}
    <div className={Styles.Footer}>
        <img src={Icon} alt="actual" />
        <p>&copy; 2024 Dr. Carl Balita Review Center. All Rights Reserved.</p>
    </div>

    </div>
        </div>

































    );
};

export default Landing;

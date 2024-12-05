import React from 'react';
import styles from'./Landing.module.css';
import logoIcon from '../../icon/logo.png';

const Landing = () => {
    return (            
    <div className={styles.main_container_mark}>

<header className="header">
  <div className="header_content">
    <div className="header_logo">
      <img src={logoIcon} alt="logo" />
    </div>
  </div>
</header>
                   <div className={styles.main_content_mark}>
                       <div className={styles.intro_mark}>
                        <div className={styles.inside_intro_mark}>
                        <h1>Welcome to Dr. Carl Balita Review Center Student Portal</h1>
                        <p>Where the dream and the dreamer become ONE!</p>
                        <div className={styles.buttons_mark}>
                            <button type="button" className="login" onClick={() => window.location.href='login'}>Log-in</button>
                            <button type="button" className="signup" onClick={() => window.location.href='signup'}>Sign-Up</button>
                            </div>
                            </div>
                            <div className={styles.placeholder_box_mark}>
                            </div> {/* Placeholder for the intro image */}
                        
                        </div>
                   
                   

                <div>
                <div className={styles.featured_courses}>
                    <div className={styles.featured_text}><h2>Featured Courses</h2>
                    <p>Browse through our top performing courses</p>
                    <button>View All Courses</button>
                    </div>
                    

                    <div className={styles.course_grid}>
                        {/* Course 1 */}
                        <div className={styles.course_card}>
                            <div className={styles.placeholder}></div>
                            <div className={styles.course_label}>Top Rated</div>
                            <div className={styles.course_title}>Course Image 1</div>
                        </div>

                        {/* Course 2 */}
                        <div className={styles.course_card}>
                            <div className={styles.placeholder}></div>
                            <div className={styles.course_label}>Recommended</div>
                            <div className={styles.course_title}>Course Image 2</div>
                        </div>

                        {/* Course 3 */}
                        <div className={styles.course_card}>
                            <div className={styles.placeholder}></div>
                            <div className={styles.course_label}>New</div>
                            <div className={styles.course_title}>Course Image 3</div>
                        </div>
                    </div>
                </div>
            </div>
        
        </div>
        </div>
    
    );
};

export default Landing;

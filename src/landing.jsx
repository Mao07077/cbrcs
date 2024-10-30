import React from 'react';
import './landing.css';

const Landing = () => {
    return (
        <div>
            <header>
                <div className="logo-placeholder"></div> {/* Placeholder for the logo */}
            </header>

            <div className="landing-container">
                <div className="intro-text">
                    <h1>Welcome to Dr. Carl Balita Review Center Student Portal</h1>
                    <p>Where the dream and the dreamer become ONE!</p>
                    <div className="placeholder-box"></div> {/* Placeholder for the intro image */}
                </div>

                <div className="buttons">
                    <button type="button" className="login" onClick={() => window.location.href='login'}>Log-in</button>
                    <button type="button" className="signup" onClick={() => window.location.href='signup'}>Sign-Up</button>
                </div>

                <div className="featured-courses">
                    <h2>Featured Courses</h2>
                    <p>Browse through our top performing courses</p>
                    <div className="placeholder-box"></div> {/* Placeholder for the featured courses banner */}
                    <button>View All Courses</button>

                    <div className="course-grid">
                        {/* Course 1 */}
                        <div className="course-card">
                            <div className="placeholder"></div>
                            <div className="course-label">Top Rated</div>
                            <div className="course-title">Course Image 1</div>
                        </div>

                        {/* Course 2 */}
                        <div className="course-card">
                            <div className="placeholder"></div>
                            <div className="course-label">Recommended</div>
                            <div className="course-title">Course Image 2</div>
                        </div>

                        {/* Course 3 */}
                        <div className="course-card">
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

export default Landing;

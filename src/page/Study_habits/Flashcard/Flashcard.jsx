import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import styles from './Flashcards.module.css';
import Header from '../../../Components/composables/Header';
import Footer from '../../../Components/composables/Footer';

const Flashcards = () => {
    const location = useLocation();
    const { moduleId } = useParams(); // Get moduleId from URL
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Set API URL dynamically based on the environment
    const API_URL = "http://127.0.0.1:8000";
    process.env.REACT_APP_API_URL ||
    (window.location.hostname === "localhost"
      ? "http://127.0.0.1:8000"
      : "http://127.0.0.1:8000");

    // Common headers for fetch requests
    const requestHeaders = {
        'ngrok-skip-browser-warning': 'true', // Bypasses ngrok warning page
        'Accept': 'application/json',
    };

    // Fetch flashcards from API
    useEffect(() => {
        const fetchFlashcards = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL}/api/flashcards/${moduleId}`, {
                    headers: requestHeaders, // Add headers here
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch flashcards: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                if (data.success) {
                    setFlashcards(data.flashcards || []);
                } else {
                    throw new Error(data.detail || 'Failed to fetch flashcards');
                }
            } catch (error) {
                console.error('Error fetching flashcards:', error);
                setError(error.message || 'Error fetching flashcards');
            } finally {
                setIsLoading(false);
            }
        };

        if (!location.state?.flashcards) {
            fetchFlashcards();
        } else {
            setFlashcards(location.state.flashcards || []);
            setIsLoading(false);
        }
    }, [location.state, moduleId, API_URL]);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
        setFlipped(false); // Reset flip on next card
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
        setFlipped(false); // Reset flip on previous card
    };

    const handleFlip = () => {
        setFlipped((prev) => !prev);
    };

    if (isLoading) return <p className={styles.loading}>Loading...</p>;
    if (error) return <p className={styles.error}>{error}</p>;
    if (flashcards.length === 0) return <p className={styles.error}>No flashcards available</p>;

    return (
        <div className={styles.flashcardPage}>
            <Header />
            <div className={styles.container}>
                <h2 className={styles.title}>FLASHCARD</h2>
                <p className={styles.instructions}>
                    Click on the card to flip it. Use the arrows below to navigate between cards.
                </p>
                <div className={styles.cardContainer}>
                    <div
                        className={`${styles.card} ${flipped ? styles.flipped : ''}`}
                        onClick={handleFlip}
                    >
                        <div className={styles.inner}>
                            <div className={styles.front}>
                                <p>{flashcards[currentIndex].content}</p>
                            </div>
                            <div className={styles.back}>
                                <p>{flashcards[currentIndex].answer}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.navContainer}>
                    <button className={styles.navButton} onClick={handlePrevious}>
                        ← {/* Left arrow */}
                    </button>
                    <p className={styles.cardCounter}>
                        {currentIndex + 1} / {flashcards.length}
                    </p>
                    <button className={styles.navButton} onClick={handleNext}>
                        → {/* Right arrow */}
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Flashcards;
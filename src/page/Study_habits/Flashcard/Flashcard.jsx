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

    const API_URL =
        process.env.REACT_APP_API_URL ||
        (window.location.hostname === 'localhost'
            ? 'http://127.0.0.1:8000'
            : 'https://1945-2405-8d40-4479-50f0-25aa-3e85-9a34-71e6.ngrok-free');

    // Fetch flashcards from API
    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                const response = await fetch(`${API_URL}/api/flashcards/${moduleId}`);
                const data = await response.json();
                if (data.success) {
                    setFlashcards(data.flashcards);
                } else {
                    setError(data.detail || 'Failed to fetch flashcards');
                }
            } catch (error) {
                setError('Error fetching flashcards: ' + error.message);
            }
        };

        if (!location.state?.flashcards) {
            fetchFlashcards();
        } else {
            setFlashcards(location.state.flashcards);
        }
    }, [location.state, moduleId]);

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

    if (error) return <p className={styles.error}>{error}</p>;
    if (flashcards.length === 0) return <p>Loading...</p>;

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
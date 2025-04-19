import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Flashcards.module.css';
import Header from '../../../Components/composables/Header';
import Footer from '../../../Components/composables/Footer';

const Flashcards = () => {
    const location = useLocation();
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);

    // Fetch flashcards from API - replace with your actual endpoint
    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                const response = await fetch(`YOUR_FASTAPI_ENDPOINT/flashcards/${MODULE_ID}`);
                const data = await response.json();
                if (data.success) {
                    setFlashcards(data.flashcards);
                } else {
                    console.error("Failed to fetch flashcards:", data.message);
                }
            } catch (error) {
                console.error("Error fetching flashcards:", error);
            }
        };

        if (!location.state?.flashcards) {
            fetchFlashcards();
        } else {
            setFlashcards(location.state.flashcards);
        }
    }, [location.state]);

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

    if (flashcards.length === 0) return <p>Loading...</p>;

    return (
        <div className={styles.container}>
            <Header />
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
                    &#8592; {/* Left arrow */}
                </button>
                <p className={styles.cardCounter}>
                    {currentIndex + 1} / {flashcards.length}
                </p>
                <button className={styles.navButton} onClick={handleNext}>
                    &#8594; {/* Right arrow */}
                </button>
            </div>
            <Footer />
        </div>
    );
};

export default Flashcards;
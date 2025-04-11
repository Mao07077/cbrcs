import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation to access location state
import styles from './Flashcards.module.css';
import Header from '../../../Components/composables/Header';
import Footer from '../../../Components/composables/Footer';

const Flashcards = () => {
    const location = useLocation(); // Use useLocation hook here
    const flashcards = location.state?.flashcards || []; // Use optional chaining to avoid undefined error
    const [currentSet, setCurrentSet] = useState(0);
    const [flippedCards, setFlippedCards] = useState({});

    const cardsPerPage = 3;
    const totalSets = Math.ceil(flashcards.length / cardsPerPage);
    
    const handleNextSet = () => {
        setFlippedCards({});
        setCurrentSet((prev) => Math.min(prev + 1, totalSets - 1));
    };

    const handlePrevSet = () => {
        setFlippedCards({});
        setCurrentSet((prev) => Math.max(prev - 1, 0));
    };

    const handleFlip = (index) => {
        setFlippedCards((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const startIndex = currentSet * cardsPerPage;
    const displayedCards = flashcards.slice(startIndex, startIndex + cardsPerPage);

    return (
        <div className={styles.container}>
            <Header />
            <h2 className={styles.title}>FLASHCARDS</h2>
            <div className={styles.cardContainer}>
                {displayedCards.map((flashcard, index) => (
                    <div
                        key={flashcard.unique}
                        className={`${styles.card} ${flippedCards[index] ? styles.flipped : ''}`}
                        onClick={() => handleFlip(index)}
                    >
                        <div className={styles.inner}>
                            <div className={`${styles.front} ${flippedCards[index] ? styles.hidden : ''}`}>
                                <p>{flashcard.content}</p>
                            </div>
                            <div className={`${styles.back} ${flippedCards[index] ? styles.visible : styles.hidden}`}>
                                <p>{flashcard.answer}</p> {/* Assuming your flashcard model has an answer field */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.navContainer}>
                {currentSet > 0 && <button className={styles.navButton} onClick={handlePrevSet}>Previous</button>}
                {currentSet < totalSets - 1 && <button className={styles.navButton} onClick={handleNextSet}>Next</button>}
            </div>
            <Footer />
        </div>
    );
};

export default Flashcards;
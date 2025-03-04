import React, { useState } from 'react';
import styles from './Flashcards.module.css';

const Flashcards = () => {
    const hardcodedFlashcards = [
        { question: 'What is React?', answer: 'A JavaScript library for building user interfaces.' },
        { question: 'What is JSX?', answer: 'A syntax extension for JavaScript that looks like XML.' },
        { question: 'What is a component?', answer: 'A reusable piece of UI in a React application.' }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    const handleNext = () => {
        setShowAnswer(false);
        setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    };

    const handlePrev = () => {
        setShowAnswer(false);
        setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    };

    const handleFlip = () => setShowAnswer(!showAnswer);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Flashcards</h2>
            {flashcards.length > 0 ? (
                <div className={styles.card} onClick={handleFlip}>
                     <div className={`${styles.inner} ${showAnswer ? styles.flipped : ''}`}>
                        <div className={styles.front}>
                            <p>{flashcards[currentIndex].question}</p>
                        </div>
                        <div className={styles.back}>
                            <p>{flashcards[currentIndex].answer}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <p>No flashcards available.</p>
            )}
            <div className={styles.controls}>
            <button className={styles.button} onClick={handlePrev}>Prev</button>
                <button className={styles.button} onClick={handleNext}>Next</button>
            </div>
        </div>

    );
};

export default Flashcards;
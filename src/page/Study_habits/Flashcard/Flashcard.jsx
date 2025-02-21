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
        setCurrentIndex((prev) => (prev + 1) % hardcodedFlashcards.length);
    };

    const handlePrev = () => {
        setShowAnswer(false);
        setCurrentIndex((prev) => (prev - 1 + hardcodedFlashcards.length) % hardcodedFlashcards.length);
    };

    const handleFlip = () => setShowAnswer(!showAnswer);

    return (
        <div className={styles.container}>
            <h2>Flashcards</h2>
            {hardcodedFlashcards.length > 0 ? (
                <div className={styles.card} onClick={handleFlip}>
                    <p>{showAnswer ? hardcodedFlashcards[currentIndex].answer : hardcodedFlashcards[currentIndex].question}</p>
                </div>
            ) : (
                <p>No flashcards available.</p>
            )}
            <div className={styles.controls}>
                <button onClick={handlePrev}>Prev</button>
                <button onClick={handleNext}>Next</button>
            </div>
        </div>
    );
};

export default Flashcards;
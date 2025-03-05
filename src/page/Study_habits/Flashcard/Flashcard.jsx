import React, { useState } from 'react';
import styles from './Flashcards.module.css';
import Header from'../../../Components/Header';


const Flashcards = ({ subject = "Computer Programming" }) => {
    const hardcodedFlashcards = [
        { question: "What is React?", answer: "A JavaScript library for building user interfaces." },
        { question: "What is JSX?", answer: "A syntax extension for JavaScript that looks like XML." },
        { question: "What is a component?", answer: "A reusable piece of UI in a React application." }
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
            <Header />
            <h2 className={styles.title}>Flashcards</h2>
            
            {/* Subject Info */}
            <p className={styles.subject}>Currently Studying: <strong>{subject}</strong></p>
            
            {hardcodedFlashcards.length > 0 ? (
                <div className={styles.card} onClick={handleFlip}>
                    <div className={`${styles.inner} ${showAnswer ? styles.flipped : ""}`}>
                        <div className={styles.front}>
                            <p>{hardcodedFlashcards[currentIndex].question}</p>
                        </div>
                        <div className={styles.back}>
                            <p>{hardcodedFlashcards[currentIndex].answer}</p>
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
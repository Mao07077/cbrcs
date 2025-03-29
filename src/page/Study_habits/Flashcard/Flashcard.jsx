import { ReactComponent as LeftButton } from '../../../icon/LeftButton.svg';
import { ReactComponent as RightButton } from '../../../icon/Rightbutton.svg';

import React, { useState } from 'react';
import styles from './Flashcards.module.css';
import Header from '../../../Components/composables/Header';
import Footer from '../../../Components/composables/Footer';

const Flashcards = ({ subject = 'Computer Programming' }) => {
	const hardcodedFlashcards = [
		{
			question: 'What is React?',
			answer: 'A JavaScript library for building user interfaces.',
		},
		{
			question: 'What is JSX?',
			answer: 'A syntax extension for JavaScript that looks like XML.',
		},
		{
			question: 'What is a component?',
			answer: 'A reusable piece of UI in a React application.',
		},
		{
			question: 'What is state in React?',
			answer: 'An object that determines how a component renders and behaves.',
		},
		{
			question: 'What is a prop?',
			answer: 'A way to pass data from parent to child components.',
		},
		{
			question: 'What is useEffect?',
			answer: 'A React Hook that runs side effects in functional components.',
		},
	];

	const [currentSet, setCurrentSet] = useState(0);
	const [flippedCards, setFlippedCards] = useState({});

	const cardsPerPage = 3;
	const totalSets = Math.ceil(hardcodedFlashcards.length / cardsPerPage);

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
	const displayedCards = hardcodedFlashcards.slice(
		startIndex,
		startIndex + cardsPerPage
	);

	return (
		<div className={styles.container}>
			<Header isStudyHabits={true}></Header>
			<div className={styles.content_wrapper}>
				<h2 className={styles.title}>FLASHCARDS</h2>
				<p className={styles.subject}>
					Currently Studying: <strong>{subject}</strong>
				</p>
				{/* Flashcards Container */}
				<div className={styles.cardContainer}>
					{displayedCards.map((flashcard, index) => {
						const globalIndex = startIndex + index;
						return (
							<div
								key={globalIndex}
								className={`${styles.card} ${
									flippedCards[globalIndex] ? styles.flipped : ''
								}`}
								onClick={() => handleFlip(globalIndex)}
							>
								<div className={styles.inner}>
									<div
										className={`${styles.front} ${
											flippedCards[globalIndex] ? styles.hidden : ''
										}`}
									>
										<p>{flashcard.question}</p>
									</div>
									<div
										className={`${styles.back} ${
											flippedCards[globalIndex] ? styles.visible : styles.hidden
										}`}
									>
										<p>{flashcard.answer}</p>
									</div>
								</div>
							</div>
						);
					})}
				</div>
				{/* Navigation Buttons */}
				<div className={styles.navContainer}>
					{currentSet > 0 && (
						<button className={styles.navButton} onClick={handlePrevSet}>
							<LeftButton className={styles.icon} />
						</button>
					)}
					{currentSet < totalSets - 1 && (
						<button className={styles.navButton} onClick={handleNextSet}>
							<RightButton className={styles.icon} />
						</button>
					)}
				</div>
			</div>
			<Footer></Footer>
		</div>
	);
};

export default Flashcards;

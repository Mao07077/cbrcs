import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import './posttest.css';
import logoIcon from '../../icon/logo.png';
import { useParams } from 'react-router-dom';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import axios from 'axios'; // Import axios for making API calls

ChartJS.register(ArcElement, Tooltip, Legend);

const PostTest = () => {
    const { moduleId } = useParams();
    const [postTest, setPostTest] = useState(null);
    const [error, setError] = useState(null);
    const [answers, setAnswers] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(null);
    const [validationError, setValidationError] = useState(null);
    const [correctAnswers, setCorrectAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes timer
    const [timeTaken, setTimeTaken] = useState(0); // Time taken to complete the test
    const [loading, setLoading] = useState(false); // Loading state for paraphrasing

    useEffect(() => {
        const fetchPostTestData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/post-test/${moduleId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch post-test data');
                }
                const data = await response.json();
                const answersMap = {};
                data.questions.forEach((question, index) => {
                    answersMap[index] = question.correctAnswer; // Store correct answers by index
                    question.options = shuffleArray(question.options); // Shuffle options
                });
                setCorrectAnswers(answersMap);
                setPostTest(data);

                // Paraphrase questions
                await paraphraseQuestions(data.questions);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchPostTestData();
    }, [moduleId]);

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const paraphraseQuestions = async (questions) => {
        setLoading(true); // Set loading to true
        const paraphrasedQuestions = await Promise.all(questions.map(async (question) => {
            const inputResponse = createPrompt(question.question, question.correctAnswer, question.wrongAnswers);
            const generatedResponse = await axios.post('http://localhost:8000/api/paraphrase', { input: inputResponse });
            return {
                ...question,
                question: generatedResponse.data.paraphrased // Assuming the response contains the paraphrased question
            };
        }));
        setPostTest(prev => ({ ...prev, questions: paraphrasedQuestions }));
        setLoading(false); // Set loading to false after paraphrasing
    };
    
    const createPrompt = (inputText, correctAnswer, wrongAnswers) => {
        return (
            `Given question: '${inputText}'\n` +
            `Correct answer: '${correctAnswer}'\n` +
            `Wrong answers: '${wrongAnswers.join(", ")}'\n\n` +
            "1. Paraphrase the question.\n" +
            "2. Maintain the question context or topic.\n"  
        );
    };

    // Timer and submission logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    handleSubmit(); // Auto-submit when time runs out
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleAnswerChange = (questionIndex, selectedOption) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionIndex]: selectedOption
        }));
        setValidationError(null);
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        const unansweredQuestions = postTest.questions.filter((_, index) => !answers[index]);
        if (unansweredQuestions.length > 0) {
            setValidationError('Please answer all questions before submitting.');
            return;
        }

        let correctCount = 0;
        let incorrectCount = 0;

        postTest.questions.forEach ((question, index) => {
            if (answers[index] === correctAnswers[index]) {
                correctCount++;
            } else {
                incorrectCount++;
            }
        });

        const userId = localStorage.getItem('userIdNumber'); // Retrieve user ID
        if (!userId) {
            alert('User  ID not found. Please log in again.');
            return;
        }

        const scoreData = {
            correct: correctCount,
            incorrect: incorrectCount,
            total_questions: postTest.questions.length,
            answers,
            user_id: userId // Add user ID
        };

        try {
            const response = await fetch(`http://localhost:8000/api/post-test/submit/${moduleId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(scoreData) // Send the complete data
            });

            if (!response.ok) {
                throw new Error('Failed to submit answers');
            }

            const result = await response.json();
            console.log('Post-test submitted:', result);

            setScore({
                correct: correctCount,
                incorrect: incorrectCount,
                total_questions: postTest.questions.length,
            });
            setSubmitted(true);
            setTimeTaken(600 - timeLeft); // Calculate time taken
        } catch (error) {
            console.error('Error submitting post-test:', error);
            alert('Failed to submit your post-test. Please try again.');
        }
    };

    const handleNextPage = () => {
        const startIndex = (currentPage - 1) * questionsPerPage;
        const endIndex = startIndex + questionsPerPage;
        const unansweredQuestions = postTest.questions.slice(startIndex, endIndex).filter((_, index) => !answers[startIndex + index]);

        if (unansweredQuestions.length > 0) {
            setValidationError('Please answer all questions on this page before proceeding.');
            return;
        }

        setCurrentPage(currentPage + 1);
        setValidationError(null);
    };

    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1);
        setValidationError(null);
    };

    const renderQuestions = () => {
        const startIndex = (currentPage - 1) * questionsPerPage;
        const endIndex = startIndex + questionsPerPage;
        const questionsToRender = postTest.questions.slice(startIndex, endIndex) || [];

        return questionsToRender.map((question, index) => (
            <div key={startIndex + index} className="question-item">
                <p className="question-text">{`${startIndex + index + 1}. ${question.question}`}</p>
                {question.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="choice-label">
                        <input
                            type="radio"
                            name={`question_${startIndex + index}`}
                            value={option}
                            onChange={() => handleAnswerChange(startIndex + index, option)}
                            checked={answers[startIndex + index] === option}
                        />{' '}
                        {option}
                    </label>
                ))}
            </div>
        ));
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!postTest) {
        return <div>Loading post-test...</div>;
    }

    const questionsPerPage = 5;
    const totalPages = Math.ceil((postTest.questions?.length || 0) / questionsPerPage);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="posttest-container">
            <header className="header">
                <div className="header-content">
                    <div className="header-logo">
                        <img src={logoIcon} alt="logo" />
                    </div>
                </div>
            </header>

            <h1 className="posttest-title">{postTest.title}</h1>
            <p className="posttest-description">{postTest.description}</p>

            {!submitted && (
                <div className="timer">
                    Time Left: {formatTime(timeLeft)}
                </div>
            )}

            {loading ? (
                <div className="loading-message">Loading and paraphrasing questions...</div>
            ) : submitted ? (
                <div className="submission-container">
                    <h2 className="submission-title">Your Score</h2>
                    {score && (
                        <div className="chart-container">
                            <Pie
                                data={{
                                    labels: ['Correct', 'Incorrect'],
                                    datasets: [
                                        {
                                            label: 'Score Distribution ',
                                            data: [score.correct, score.incorrect],
                                            backgroundColor: ['#36A2EB', '#FF6384'],
                                            hoverBackgroundColor: ['#36A2EB', '#FF6384']
                                        }
                                    ]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false
                                }}
                            />
                            <p>
                                Total Questions: {score.total_questions} | Correct: {score.correct} | Incorrect: {score.incorrect}
                            </p>
                            <p>
                                Time Taken: {formatTime(timeTaken)}
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="question-section">
                        {renderQuestions()}
                        {validationError && <p className="validation-error">{validationError}</p>}
                        <div className="button-group">
                            {currentPage > 1 && (
                                <button
                                    type="button"
                                    onClick={handlePrevPage}
                                    className="button prev-button"
                                >
                                    Previous
                                </button>
                            )}
                            {currentPage < totalPages ? (
                                <button
                                    type="button"
                                    onClick={handleNextPage}
                                    className="button next-button"
                                >
                                    Next
                                </button>
                            ) : (
                                <button type="submit" className="button submit-button">
                                    Submit
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default PostTest;
import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import './posttest.css';
import Header from '../../Components/composables/Header';
import { useParams, useLocation } from 'react-router-dom';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const PostTest = () => {
    const { moduleId } = useParams();
    const location = useLocation();
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

    const API_URL = "http://127.0.0.1:8000";
    process.env.REACT_APP_API_URL ||
    (window.location.hostname === "localhost"
      ? "http://127.0.0.1:8000"
      : "http://127.0.0.1:8000");
    // Common headers for axios requests
    const requestHeaders = {
        'ngrok-skip-browser-warning': 'true', // Bypasses ngrok warning page
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    useEffect(() => {
        const fetchPostTestData = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/post-test/${moduleId}`, {
                    headers: requestHeaders, // Add headers here
                });
                const data = response.data;
                const answersMap = {};
                data.questions.forEach((question, index) => {
                    answersMap[index] = question.correctAnswer;
                    question.options = shuffleArray(question.options);
                });
                setCorrectAnswers(answersMap);
                setPostTest(data);

                // Paraphrase questions
                await paraphraseQuestions(data.questions);
            } catch (error) {
                console.error('Fetch error:', error.response?.data || error.message);
                setError(error.response?.data?.detail || 'Failed to fetch post-test data');
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
        setLoading(true);
        try {
            const paraphrasedQuestions = await Promise.all(questions.map(async (question) => {
                const inputResponse = createPrompt(question.question, question.correctAnswer, question.wrongAnswers);
                const generatedResponse = await axios.post(`${API_URL}/api/paraphrase`, { input: inputResponse }, {
                    headers: requestHeaders, // Add headers here
                });
                return {
                    ...question,
                    question: generatedResponse.data.paraphrased
                };
            }));
            setPostTest(prev => ({ ...prev, questions: paraphrasedQuestions }));
        } catch (error) {
            console.error('Paraphrase error:', error.response?.data || error.message);
            setError(error.response?.data?.detail || 'Failed to paraphrase questions');
        } finally {
            setLoading(false);
        }
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
                    handleSubmit();
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

        // Get timeSpent from navigation state
        const { timeSpent = 0 } = location.state || {};

        let correctCount = 0;
        let incorrectCount = 0;

        postTest.questions.forEach((question, index) => {
            if (answers[index] === correctAnswers[index]) {
                correctCount++;
            } else if (answers[index]) {
                incorrectCount++;
            }
        });

        const userId = localStorage.getItem('userIdNumber');
        if (!userId) {
            alert('User ID not found. Please log in again.');
            return;
        }

        // Include time_spent in submission data
        const scoreData = {
            answers,
            user_id: userId,
            time_spent: timeSpent
        };

        try {
            setLoading(true);
            console.log("Submitting to:", `${API_URL}/api/post-test/submit/${moduleId}`);
            console.log("Payload:", scoreData);
            const response = await axios.post(`${API_URL}/api/post-test/submit/${moduleId}`, scoreData, {
                headers: requestHeaders, // Use requestHeaders instead of inline headers
            });
            console.log("Submission response:", response.data);
            setScore({
                correct: response.data.correct,
                incorrect: response.data.incorrect,
                total_questions: response.data.total_questions
            });
            setSubmitted(true);
            setTimeTaken(600 - timeLeft);
        } catch (error) {
            console.error('Submission error:', error.response?.data || error.message);
            alert(`Failed to submit post-test: ${error.response?.data?.detail || error.message}`);
        } finally {
            setLoading(false);
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
                            disabled={loading}
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
        <div className="Main">
            <Header />
            <div className="posttest-container">
                <h1 className="posttest-title">{postTest.title}</h1>
                <p className="posttest-description">{postTest.description || 'Please complete the post-test to evaluate your understanding.'}</p>

                {!submitted && (
                    <div className="timer">
                        Time Left: {formatTime(timeLeft)}
                    </div>
                )}

                {loading ? (
                    <div className="loading-message">
                        Please wait up to 5 minutes.<br />
                        The AI is generating and paraphrasing questions to make them easier for you.<br />
                        This may take a while—sit back and relax
                    </div>
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
                                                label: 'Score Distribution',
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
                                        disabled={loading}
                                    >
                                        Previous
                                    </button>
                                )}
                                {currentPage < totalPages ? (
                                    <button
                                        type="button"
                                        onClick={handleNextPage}
                                        className="button next-button"
                                        disabled={loading}
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="button submit-button"
                                        disabled={loading}
                                    >
                                        {loading ? 'Submitting...' : 'Submit'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PostTest;
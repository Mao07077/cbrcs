import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import './pretest.css';
import Header from '../../Components/composables/Header';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const PreTest = () => {
    const { moduleId } = useParams();
    const navigate = useNavigate();
    const [preTest, setPreTest] = useState(null);
    const [error, setError] = useState(null);
    const [answers, setAnswers] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(null);
    const [validationError, setValidationError] = useState(null);
    const [correctAnswers, setCorrectAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes timer
    const [timeTaken, setTimeTaken] = useState(0);
    const [loading, setLoading] = useState(false);
    const [timeSpent, setTimeSpent] = useState(0); // Time spent on the pre-test (in seconds)

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

    // Safe localStorage access
    const getUserId = () => {
        try {
            const userId = localStorage.getItem('userIdNumber');
            if (!userId) {
                throw new Error('User ID not found in localStorage');
            }
            return userId;
        } catch (e) {
            console.error('Failed to access localStorage:', e);
            return null;
        }
    };

    useEffect(() => {
        const fetchPreTestData = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/pre-test/${moduleId}`, {
                    headers: requestHeaders, // Add headers here
                });
                const data = response.data;
                console.log('Pre-test data:', data);
                const answersMap = {};
                data.questions.forEach((question, index) => {
                    answersMap[index] = question.correctAnswer;
                    question.options = shuffleArray(question.options);
                });
                setCorrectAnswers(answersMap);
                setPreTest(data);
            } catch (error) {
                console.error('Fetch error:', error.response?.data || error.message);
                setError(error.response?.data?.detail || 'Failed to load pre-test');
            }
        };

        fetchPreTestData();

        // Start timer to track time spent on the pre-test
        const startTime = Date.now();
        const intervalId = setInterval(() => {
            const currentTime = Date.now();
            setTimeSpent(Math.floor((currentTime - startTime) / 1000));
        }, 1000);

        // Cleanup timer on component unmount
        return () => clearInterval(intervalId);
    }, [moduleId]);

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

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
        if (!moduleId) {
            alert('Module ID missing.');
            return;
        }
        if (preTest.questions.some((_, i) => !answers[i])) {
            alert('Answer all questions.');
            return;
        }

        const userId = getUserId();
        if (!userId) {
            navigate('/login', { state: { error: 'User ID not found. Please log in again.' } });
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
            console.log("Submitting to:", `${API_URL}/api/pre-test/submit/${moduleId}`);
            console.log("Payload:", scoreData);
            const response = await axios.post(`${API_URL}/api/pre-test/submit/${moduleId}`, scoreData, {
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
            alert(`Failed to submit pre-test: ${error.response?.data?.detail || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleNextPage = () => {
        const startIndex = (currentPage - 1) * questionsPerPage;
        const endIndex = startIndex + questionsPerPage;
        const unansweredQuestions = preTest.questions.slice(startIndex, endIndex).filter((_, index) => !answers[startIndex + index]);

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
        const questionsToRender = preTest.questions.slice(startIndex, endIndex) || [];

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

    if (!preTest) {
        return <div>Loading pre-test...</div>;
    }

    const questionsPerPage = 5;
    const totalPages = Math.ceil((preTest.questions?.length || 0) / questionsPerPage);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="Main">
            <Header />
            <div className="posttest-container">
                <h1 className="posttest-title">{preTest.title}</h1>
                <p className="posttest-description">Please complete the pre-test to access the module content.</p>

                {!submitted && (
                    <div className="timer">
                        Time Left: {formatTime(timeLeft)}
                    </div>
                )}

                {submitted ? (
                    <div className="submission-container">
                        <h2 className="submission-title">Your Pre-Test Score</h2>
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
                                <button
                                    className="button proceed-button"
                                    onClick={() => navigate(`/module/${moduleId}`)}
                                >
                                    Proceed to Module
                                </button>
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

export default PreTest;
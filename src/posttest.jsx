import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import './posttest.css';
import logoIcon from './icon/logo.png';
import { useParams } from 'react-router-dom';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

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

    useEffect(() => {
        const fetchPostTestData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/post-test/${moduleId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch post-test data');
                }
                const data = await response.json();
                setPostTest(data);
                const answersMap = {};
                data.questions.forEach((question, index) => {
                    answersMap[index] = question.correctAnswer; // Store correct answers by index
                });
                setCorrectAnswers(answersMap);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchPostTestData();
    }, [moduleId]);

    const handleAnswerChange = (questionIndex, selectedOption) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionIndex]: selectedOption
        }));
        setValidationError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const unansweredQuestions = postTest.questions.filter((_, index) => !answers[index]);
        if (unansweredQuestions.length > 0) {
            setValidationError('Please answer all questions before submitting.');
            return;
        }

        console.log('Answers before submission:', answers); // Log submitted answers

        // Calculate correct and incorrect answers locally
        let correctCount = 0;
        let incorrectCount = 0;

        postTest.questions.forEach((question, index) => {
            if (answers[index] === correctAnswers[index]) {
                correctCount++;
            } else {
                incorrectCount++;
            }
        });

        // Log results
        console.log(`Correct: ${correctCount}, Incorrect: ${incorrectCount}`);

        // Set score for chart
        setScore({
            correct: correctCount,
            incorrect: incorrectCount,
            total_questions: postTest.questions.length,
        });

        setSubmitted(true);

        try {
            const response = await fetch(`http://localhost:8000/api/post-test/submit/${moduleId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ answers }) // Send the answers object
            });

            if (!response.ok) {
                throw new Error('Failed to submit answers');
            }

            const result = await response.json();
            console.log('Post-test submitted:', result); // Log the server response
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

            {submitted ? (
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

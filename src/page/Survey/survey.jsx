import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Survey-design.css";
import Icon from "../../icon/actual.png";
import questions from "./Questions.jsx";

const Survey = () => {
    const [page, setPage] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const idNumber = localStorage.getItem("userIdNumber");
    const navigate = useNavigate(); // For redirection
    const API_URL = "https://g28s4zdq-8000.asse.devtunnels.ms/";
    process.env.REACT_APP_API_URL ||
    (window.location.hostname === "localhost"
      ? "https://g28s4zdq-8000.asse.devtunnels.ms/"
      : "https://g28s4zdq-8000.asse.devtunnels.ms/");
    // Common headers for fetch requests
    const requestHeaders = {
        'ngrok-skip-browser-warning': 'true', // Bypasses ngrok warning page
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    useEffect(() => {
        if (!idNumber) {
            setErrorMessage("User not logged in. Please log in to take the survey.");
        } else {
            const surveyCompleted = localStorage.getItem("surveyCompleted");
            if (surveyCompleted === "true") {
                navigate("/module"); // Redirect if survey already taken
            }
        }
    }, [idNumber, navigate]);

    const scoringSystem = questions.reduce((acc, section) => {
        acc[section.category] = Array.from(
            { length: section.questions[0].choices.length },
            (_, i) => section.questions[0].choices.length - i
        );
        return acc;
    }, {});

    const handleAnswer = (questionIndex, choiceIndex) => {
        const category = questions[page].category;
        const score = scoringSystem[category][choiceIndex];

        setAnswers((prev) => ({
            ...prev,
            [`${page}-${questionIndex}`]: { score, category },
        }));
    };

    const allAnswered = () => {
        return questions[page].questions.every((_, index) =>
            answers.hasOwnProperty(`${page}-${index}`)
        );
    };

    const handleNext = () => {
        if (allAnswered()) {
            if (page < questions.length - 1) {
                setPage(page + 1);
                setErrorMessage("");
            }
        } else {
            setErrorMessage("Please answer all questions before proceeding.");
        }
    };

    const handleBack = () => {
        if (page > 0) {
            setPage(page - 1);
            setErrorMessage("");
        }
    };

    const handleSubmit = async () => {
        if (!allAnswered()) {
            setErrorMessage("Please answer all questions before submitting.");
            return;
        }

        const categoryScores = {};
        Object.values(answers).forEach(({ score, category }) => {
            if (!categoryScores[category]) {
                categoryScores[category] = 0;
            }
            categoryScores[category] += score;
        });

        // Get top 3 habits
        const top3Habits = Object.entries(categoryScores)
            .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
            .slice(0, 3)
            .map(([category]) => category);

        setLoading(true);
        setErrorMessage("");

        try {
            const response = await fetch(`${API_URL}/submit-survey`, {
                method: "POST",
                headers: requestHeaders, // Add headers here
                body: JSON.stringify({
                    id_number: idNumber,
                    categoryScores,
                    top3Habits,
                    surveyCompleted: true,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to submit survey: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            if (result.success) {
                // Set surveyCompleted in localStorage to prevent retaking the survey
                localStorage.setItem("surveyCompleted", "true");
                alert("Survey submitted successfully!");
                navigate("/module"); // Redirect to modules page after submission
            } else {
                throw new Error(result.detail || "Failed to submit survey");
            }
        } catch (error) {
            console.error("Error submitting survey:", error);
            setErrorMessage(error.message || "Failed to submit survey. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (errorMessage && !loading) {
        return <p className="error-message">{errorMessage}</p>;
    }

    return (
        <div>
            <div className="custom-head-content">
                <div className="custom-survey-logo">
                    <img src={Icon} alt="actual" />
                </div>
            </div>
            <div className="custom-survey-container">
                {loading && <p className="loading-message">Submitting survey...</p>}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <p className="custom-instructions">
                    <strong>
                        Please answer the following questions honestly to help us understand your study habits and preferences.
                    </strong>
                </p>
                <div className="custom-survey-box">
                    {questions[page].questions.map((q, index) => (
                        <div key={index} className="custom-question-block">
                            <p>{q.question}</p>
                            {q.choices.map((choice, choiceIndex) => (
                                <label key={choiceIndex} className="custom-choice">
                                    <input
                                        type="radio"
                                        name={`${page}-${index}`}
                                        value={choice}
                                        onChange={() => handleAnswer(index, choiceIndex)}
                                        checked={
                                            answers[`${page}-${index}`]?.score ===
                                            scoringSystem[questions[page].category][choiceIndex]
                                        }
                                        disabled={loading}
                                    />
                                    {choice}
                                </label>
                            ))}
                        </div>
                    ))}
                </div>

                <p className="custom-page-indicator">
                    Page {page + 1} of {questions.length}
                </p>

                <div className="custom-navigation-buttons">
                    {page > 0 && (
                        <button
                            className="custom-button"
                            onClick={handleBack}
                            disabled={loading}
                        >
                            Back
                        </button>
                    )}
                    {page < questions.length - 1 ? (
                        <button
                            className="custom-button"
                            onClick={handleNext}
                            disabled={!allAnswered() || loading}
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            className="custom-button"
                            onClick={handleSubmit}
                            disabled={!allAnswered() || loading}
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Survey;
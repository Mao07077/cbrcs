import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './create_posttest.css';

const CreatePostTest = () => {
    const { id } = useParams(); // Module ID from URL
    const [questions, setQuestions] = useState([
        { question: '', options: ['', '', '', ''], correctAnswer: '' },
    ]);
    const [title, setTitle] = useState('');
    const navigate = useNavigate();

    const API_URL = "https://g28s4zdq-8000.asse.devtunnels.ms/";
    process.env.REACT_APP_API_URL ||
    (window.location.hostname === "localhost"
      ? "https://g28s4zdq-8000.asse.devtunnels.ms/"
      : "https://g28s4zdq-8000.asse.devtunnels.ms/");
    // Common headers for axios requests
    const requestHeaders = {
        'ngrok-skip-browser-warning': 'true', // Bypasses ngrok warning page
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index].question = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, optionIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[optionIndex] = value;
        setQuestions(newQuestions);
    };

    const handleCorrectAnswerChange = (qIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].correctAnswer = value;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        if (questions.length < 20) {
            setQuestions([
                ...questions,
                { question: '', options: ['', '', '', ''], correctAnswer: '' },
            ]);
        } else {
            alert('You can only add up to 20 questions.');
        }
    };

    const removeQuestion = (index) => {
        const newQuestions = questions.filter((_, qIndex) => qIndex !== index);
        setQuestions(newQuestions);
    };

    const handleSubmit = async () => {
        // Validation
        if (!title || questions.some((q) => !q.question || q.options.some((o) => !o) || !q.correctAnswer)) {
            alert('Please fill in all fields, including correct answers.');
            return;
        }

        const postData = {
            title,
            questions: questions.map((q) => ({
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
            })),
            module_id: id, // Pass the module ID
        };

        try {
            const response = await axios.post(`${API_URL}/createposttest/${id}`, postData, {
                headers: requestHeaders, // Include ngrok header
            });
            console.log('Response:', response.data);
            alert('Post-test created successfully!');
            navigate(`/module/${id}`); // Redirect to module page
        } catch (error) {
            console.error('Error response:', error.response?.data || error.message);
            alert('Error creating post-test: ' + (error.response?.data?.detail || error.message));
        }
    };

    return (
        <div className="create-posttest">
            <div className="instructions">
                <h2>Create Post-Test</h2>
                <p>Fill out the form below to create a post-test for your module.</p>
            </div>

            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post-Test Title"
                className="posttest-title"
            />

            {questions.map((q, qIndex) => (
                <div key={qIndex} className="question-card">
                    <input
                        type="text"
                        value={q.question}
                        onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                        placeholder={`Question ${qIndex + 1}`}
                        className="question-input"
                    />
                    {q.options.map((option, oIndex) => (
                        <input
                            key={oIndex}
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                            placeholder={`Option ${oIndex + 1}`}
                            className="option-input"
                        />
                    ))}
                    <select
                        value={q.correctAnswer}
                        onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                        className="correct-answer-select"
                    >
                        <option value="">Select Correct Answer</option>
                        {q.options.map((option, oIndex) => (
                            <option key={oIndex} value={option}>
                                {`Option ${oIndex + 1}: ${option}`}
                            </option>
                        ))}
                    </select>
                    <button
                        className="remove-question-button"
                        onClick={() => removeQuestion(qIndex)}
                    >
                        Remove
                    </button>
                </div>
            ))}

            <div className="add-submit-container">
                <button onClick={addQuestion} className="add-question-button">
                    + Add Question
                </button>
                <button onClick={handleSubmit} className="submit-button">
                    Submit Post-Test
                </button>
            </div>
        </div>
    );
};

export default CreatePostTest;
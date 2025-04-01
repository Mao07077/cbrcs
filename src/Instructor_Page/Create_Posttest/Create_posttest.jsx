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
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [createdQuestions, setCreatedQuestions] = useState(null); // New state variable
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false); // Confirmation modal visibility state
    const navigate = useNavigate();

    // Dynamically set API_URL based on the environment
    const API_URL = process.env.REACT_APP_API_URL || 
    (window.location.hostname === "localhost" ? "http://127.0.0.1:8000" : "https://cbrcs.onrender.com");


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
        setQuestions([
            ...questions,
            { question: '', options: ['', '', '', ''], correctAnswer: '' },
        ]);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex === questions.length - 1) {
            addQuestion();
        }
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = async () => {
        // Validation
        if (!title || questions.some((q) => !q.question || q.options.some((o) => !o))) {
            alert('Please fill in all fields.');
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
            const response = await axios.post(
                `${API_URL}/createposttest/${id}`, // Use the dynamic API_URL
                postData
            );
            console.log('Response:', response.data);
            alert('Post-test created successfully!');
            setCreatedQuestions(postData.questions); // Store created questions
            setIsModalOpen(true); // Open the modal
            // navigate(`/module/${id}`); // Redirect to module page (optional)
        } catch (error) {
            console.error('Error response:', error.response || error.message);
            alert('Error creating post-test: ' + (error.response?.data?.detail || error.message));
        }
    };

    const handleConfirmSubmit = () => {
        setIsConfirmationOpen(true);
    };

    const confirmSubmit = () => {
        setIsConfirmationOpen(false);
        handleSubmit();
    };

    return (
        <div className="create-posttest">
            <h1>Create New Post-Test</h1>

            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post-Test Title"
            />

            <div className="question">
                <input
                    type="text"
                    value={questions[currentQuestionIndex].question}
                    onChange={(e) => handleQuestionChange(currentQuestionIndex, e.target.value)}
                    placeholder={`Question ${currentQuestionIndex + 1}`}
                />

                {questions[currentQuestionIndex].options.map((option, oIndex) => (
                    <input
                        key={oIndex}
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(currentQuestionIndex, oIndex, e.target.value)}
                        placeholder={`Option ${oIndex + 1}`}
                    />
                ))}

                {/* Dropdown for selecting the correct answer */}
                <select
                    value={questions[currentQuestionIndex].correctAnswer}
                    onChange={(e) => handleCorrectAnswerChange(currentQuestionIndex, e.target.value)}
                >
                    <option value="">Select Correct Answer</option>
                    {questions[currentQuestionIndex].options.map((option, oIndex) => (
                        <option key={oIndex} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>

            <button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
                Previous Question
            </button>
            <button onClick={handleNextQuestion}>
                Next Question
            </button>
            <button onClick={handleConfirmSubmit}>Submit Post-Test</button>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>All Questions</h2>
                        {createdQuestions.map((q, index) => (
                            <div key={index} className="created-question">
                                <h3>Question {index + 1}</h3>
                                <p>{q.question}</p>
                                <ul>
                                    {q.options.map((option, oIndex) => (
                                        <li key={oIndex}>{option}</li>
                                    ))}
                                </ul>
                                <p>Correct Answer: {q.correctAnswer}</p>
                            </div>
                        ))}
                        <button onClick={() => setIsModalOpen(false)}>Close</button>
                    </div>
                </div>
            )}

            {isConfirmationOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Confirm Post-Test</h2>
                        <p>Are you sure you want to submit the post-test with the following questions?</p>
                        {questions.map((q, index) => (
                            <div key={index} className="created-question">
                                <h3>Question {index + 1}</h3>
                                <p>{q.question}</p>
                                <ul>
                                    {q.options.map((option, oIndex) => (
                                        <li key={oIndex}>{option}</li>
                                    ))}
                                </ul>
                                <p>Correct Answer: {q.correctAnswer}</p>
                            </div>
                        ))}
                        <button onClick={confirmSubmit}>Confirm</button>
                        <button onClick={() => setIsConfirmationOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreatePostTest;

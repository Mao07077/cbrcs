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
                `http://localhost:8000/createposttest/${id}`, // Corrected URL
                postData
            );
            console.log('Response:', response.data);
            alert('Post-test created successfully!');
            navigate(`/module/${id}`); // Redirect to module page
        } catch (error) {
            console.error('Error response:', error.response || error.message);
            alert('Error creating post-test: ' + (error.response?.data?.detail || error.message));
        }
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

            {questions.map((question, qIndex) => (
                <div key={qIndex} className="question">
                    <input
                        type="text"
                        value={question.question}
                        onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                        placeholder={`Question ${qIndex + 1}`}
                    />

                    {question.options.map((option, oIndex) => (
                        <input
                            key={oIndex}
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                            placeholder={`Option ${oIndex + 1}`}
                        />
                    ))}

                    {/* Dropdown for selecting the correct answer */}
                    <select
                        value={question.correctAnswer}
                        onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                    >
                        <option value="">Select Correct Answer</option>
                        {question.options.map((option, oIndex) => (
                            <option key={oIndex} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            ))}

            <button onClick={addQuestion}>Add Another Question</button>
            <button onClick={handleSubmit}>Submit Post-Test</button>
        </div>
    );
};

export default CreatePostTest;
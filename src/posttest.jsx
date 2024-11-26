import React, { useState } from 'react';
import './posttest.css'; // Importing the CSS file
import logoIcon from './icon/logo.png'; // Logo image import

const PostTest = () => {
    const [formData, setFormData] = useState({
        question_1: '',
        question_2: '',
        question_3: '',
        question_4: '',
        question_5: '',
        question_6: '',
        question_7: '',
        question_8: '',
        question_9: '',
        question_10: ''
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleNext = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitted Data:', formData);
        setSubmitted(true);
    };

    const renderQuestions = () => {
        const questions = {
            1: [
                { id: 1, text: '1. Question text here' },
                { id: 2, text: '2. Question text here' },
                { id: 3, text: '3. Question text here' },
                { id: 4, text: '4. Question text here' },
                { id: 5, text: '5. Question text here' }
            ],
            2: [
                { id: 6, text: '6. Question text here' },
                { id: 7, text: '7. Question text here' },
                { id: 8, text: '8. Question text here' },
                { id: 9, text: '9. Question text here' },
                { id: 10, text: '10. Question text here' }
            ]
        };

        return questions[currentPage].map((q) => (
            <div key={q.id} className="question-item">
                <p className="question-text">{q.text}</p>
                <label className="choice-label">
                    <input
                        type="radio"
                        name={`question_${q.id}`}
                        value="Choice 1"
                        onChange={handleChange}
                    />{' '}
                    Choice 1
                </label>
                <label className="choice-label">
                    <input
                        type="radio"
                        name={`question_${q.id}`}
                        value="Choice 2"
                        onChange={handleChange}
                    />{' '}
                    Choice 2
                </label>
                <label className="choice-label">
                    <input
                        type="radio"
                        name={`question_${q.id}`}
                        value="Choice 3"
                        onChange={handleChange}
                    />{' '}
                    Choice 3
                </label>
            </div>
        ));
    };

    return (
        <div className="posttest-container">
            {/* Header Section */}
            <header className="header">
                <div className="header-content">
                    <div className="header-logo">
                        <img src={logoIcon} alt="logo" />
                    </div>
                </div>
            </header>

            {/* Title and Description */}
            <h1 className="posttest-title">Module Topic Here</h1>
            <p className="posttest-description">
                Answer the following questions based on the module you've reviewed.
            </p>

            {/* Display Submitted Data or the Form */}
            {submitted ? (
                <div className="submission-container">
                    <h2 className="submission-title">Thank you for submitting your answers!</h2>
                    <ul className="submission-answers">
                        {Object.keys(formData).map((key) => (
                            <li key={key} className="answer-item">
                                {key.replace('question_', 'Question ')}: {formData[key] || 'No answer'}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="question-section">
                        {renderQuestions()}
                        <div className="button-group">
                            {currentPage === 1 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
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
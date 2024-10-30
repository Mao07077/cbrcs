import React, { useState } from 'react';

const PostTest = () => {
    const [formData, setFormData] = useState({
        question_29: '',
        question_30: ''
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="container">
            <h1>Module Topic Here</h1>
            {submitted ? (
                <div>
                    <p>Question 29: {formData.question_29}</p>
                    <p>Question 30: {formData.question_30}</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3>Set 1</h3>
                        <div className="question">
                            <p>29. Question here</p>
                            <input type="radio" name="question_29" value="Choice1" onChange={handleChange} /> Choice1
                            <input type="radio" name="question_29" value="Choice2" onChange={handleChange} /> Choice2
                            <input type="radio" name="question_29" value="Choice3" onChange={handleChange} /> Choice3
                        </div>
                        <div className="question">
                            <p>30. Question here</p>
                            <input type="radio" name="question_30" value="Choice1" onChange={handleChange} /> Choice1
                            <input type="radio" name="question_30" value="Choice2" onChange={handleChange} /> Choice2
                            <input type="radio" name="question_30" value="Choice3" onChange={handleChange} /> Choice3
                        </div>
                    </div>
                    <div className="actions">
                        <button type="submit" className="button">Submit</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default PostTest;

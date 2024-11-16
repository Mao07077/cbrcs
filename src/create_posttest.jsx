import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './create_posttest.css';

const CreatePostTest = () => {
  // Get the module id from the URL
  const { id } = useParams();
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], correctAnswer: '' }
  ]);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  // Handle changes to the question input
  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  // Handle changes to the options inputs
  const handleOptionChange = (qIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  // Handle changes to the correct answer input
  const handleCorrectAnswerChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].correctAnswer = value;
    setQuestions(newQuestions);
  };

  // Add a new question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', options: ['', '', '', ''], correctAnswer: '' }
    ]);
  };

  // Submit the post-test
  const handleSubmit = async () => {
    if (!title || questions.some(q => !q.question || q.options.some(o => !o) || !q.correctAnswer)) {
      alert('Please fill in all fields.');
      return;
    }

    const postData = {
      title,
      questions,
      module_id: id // Add the module id to the post data
    };

    try {
      const response = await axios.post(`http://localhost:8000/createposttest/${id}`, postData);
      console.log('Response:', response.data);
      alert('Post-test created successfully!');
      navigate(`/module/${id}`);
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

          <input
            type="text"
            value={question.correctAnswer}
            onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
            placeholder="Correct Answer"
          />
        </div>
      ))}

      <button onClick={addQuestion}>Add Another Question</button>
      <button onClick={handleSubmit}>Submit Post-Test</button>
    </div>
  );
};

export default CreatePostTest;

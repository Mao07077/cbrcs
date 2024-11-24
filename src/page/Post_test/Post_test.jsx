import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Post_test.css';

const PostTest = () => {
  const { moduleId } = useParams(); // Get the module ID from the URL

  const [postTest, setPostTest] = useState(null);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({}); // To keep track of answers

  useEffect(() => {
    const fetchPostTestData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/post-test/${moduleId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post-test data');
        }
        const data = await response.json();
        setPostTest(data);
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // You can send the answers to the backend here
    try {
      const response = await fetch(`http://localhost:8000/api/post-test/submit/${moduleId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit answers');
      }

      const result = await response.json();
      console.log('Post-test submitted:', result);
      alert("Your post-test has been submitted successfully!");
    } catch (error) {
      console.error('Error submitting post-test:', error);
      alert('Failed to submit your post-test. Please try again.');
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!postTest) {
    return <div>Loading post-test...</div>;
  }

  return (
    <div>
      <h1>Post-test for Module {moduleId}</h1>
      <p>{postTest.description}</p>

      <form onSubmit={handleSubmit}>
        {postTest.questions.map((question, index) => (
          <div key={index} className="question">
            <p>{question.question}</p>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="option">
                <input
                  type="radio"
                  id={`question-${index}-option-${optionIndex}`}
                  name={`question-${index}`}
                  value={option}
                  onChange={() => handleAnswerChange(index, option)}
                  checked={answers[index] === option}
                />
                <label htmlFor={`question-${index}-option-${optionIndex}`}>{option}</label>
              </div>
            ))}
          </div>
        ))}
        <button type="submit">Submit Answers</button>
      </form>
    </div>
  );
};

export default PostTest;

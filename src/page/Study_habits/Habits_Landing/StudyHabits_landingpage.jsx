import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './studyhabits.css';
import Study_Habits_Sidebar from '../../../Components/Study_Habits_Sidebar';
import Header from '../../../Components/composables/HeaderSH';
import Footer from '../../../Components/composables/FooterSH';
import axios from 'axios';

const top10StudyHabits = [
  {
    title: 'Learn Together',
    description: 'Group Call',
    path: '/learn_together',
  },
  {
    title: 'Instructor Chat',
    description: 'Seek guidance from teachers',
    path: '/chat',
  },
  {
    title: 'Modules',
    description: 'Regular self-assessment.',
    path: '/modulesh',
  },
  {
    title: 'Scheduler',
    description: 'Create your own schedule.',
    path: '/Scheduler',
  },
  {
    title: 'Notes Organizer',
    description: 'Well-structured notes make revision easier.',
    path: '/notes',
  },
  {
    title: 'Listen to Music',
    description: 'Listen to music while studying.',
    path: '/Music',
  },
  {
    title: 'Use Flashcards',
    description: 'Great for memorizing key facts quickly.',
    path: '/Flashcard_landing',
  },
];

const StudyHabits = () => {
  const [top3Habits, setTop3Habits] = useState([]);
  const [error, setError] = useState(null);

  const idNumber = localStorage.getItem('userIdNumber'); // Assuming the user ID is stored in localStorage

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

  // Fetch study habits when the component mounts
  useEffect(() => {
    const fetchStudyHabits = async () => {
      try {
        if (!idNumber) {
          setError('User not logged in. Please log in to view recommended study habits.');
          return;
        }

        const response = await axios.get(`${API_URL}/students/${idNumber}/recommended-pages`, {
          headers: requestHeaders, // Add headers here
        });
        setTop3Habits(response.data.recommendedPages || []);
      } catch (error) {
        console.error('Failed to fetch study habits:', error.response?.data || error.message);
        setError(error.response?.data?.detail || 'Failed to fetch recommended study habits');
      }
    };

    fetchStudyHabits();
  }, [idNumber, API_URL]);

  return (
    <div className="Container_SHL">
      <Header isStudyHabits={true} />
      <div className="Content_Wrapper_SHL">
        <Study_Habits_Sidebar />
        <div className="Content_SHL">
          <h2 className="title">Study Habits</h2>
          {error && <p className="error">{error}</p>}
          <div className="section">
            <h3 className="subtitle">Your Top 3 Study Habits:</h3>
            <div className="top-habits">
              {top3Habits.length > 0 ? (
                top3Habits.map((habit, index) => (
                  <Link to={`/${habit.replace(/\s+/g, '_').toLowerCase()}`} key={index} className="habit-card">
                    <p className="habit-title">{habit}</p>
                    <p className="habit-description">Description for {habit}</p>
                  </Link>
                ))
              ) : (
                <p>No recommended habits found.</p>
              )}
            </div>

            <h3 className="subtitle2">Explore More Study Techniques:</h3>

            <div className="grid-container">
              {top10StudyHabits.map((habit, index) => (
                <Link to={habit.path} key={index} className="habit-card">
                  <p className="habit-title">
                    {index + 1}. {habit.title}
                  </p>
                  <p className="habit-description">{habit.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StudyHabits;
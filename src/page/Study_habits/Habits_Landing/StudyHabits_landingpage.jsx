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

  const idNumber = localStorage.getItem('userIdNumber');  // Assuming the user ID is stored in localStorage

  const API_URL = process.env.REACT_APP_API_URL || 
    (window.location.hostname === "localhost" ? "http://127.0.0.1:8000" : "https://1945-2405-8d40-4479-50f0-25aa-3e85-9a34-71e6.ngrok-free");

  // Fetch study habits when the component mounts
  useEffect(() => {
	const fetchStudyHabits = async () => {
		try {
			if (!idNumber) return;

			const response = await axios.get(`${API_URL}/students/${idNumber}/recommended-pages`);
			setTop3Habits(response.data.recommendedPages || []);

		} catch (error) {
			console.error("Failed to fetch study habits", error);
		}
	};

	fetchStudyHabits();
}, [idNumber]);

return (
	<div className="Container_SHL">
		<Header isStudyHabits={true} />
		<div className="Content_Wrapper_SHL">
			<Study_Habits_Sidebar />
			<div className="Content_SHL">
				<h2 className="title">Study Habits</h2>
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

      <Footer></Footer>
    </div>
  );
};

export default StudyHabits;

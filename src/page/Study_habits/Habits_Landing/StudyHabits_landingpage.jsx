import React from 'react';
import { Link } from 'react-router-dom';
import './studyhabits.css';

import Icon from '../../../icon/actual.png';
import Study_Habits_Sidebar from '../../../Components/Study_Habits_Sidebar';
import Header from '../../../Components/composables/HeaderSH';
import Footer from '../../../Components/composables/FooterSH';

const studyHabits = [
	{
		title: 'Learn Together',
		description: 'Group Call',
		path: '/learn_together',
	},
	{
		title: 'Scheduler',
		description: 'Create your own schedule',
		path: '/Scheduler',
	},
	{
		title: 'Instructor Chat',
		description: 'Seek guidance from teachers',
		path: '/chat',
	},
];

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
		path: '/module',
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
	return (
		<div className="Container_SHL">
			<Header isStudyHabits={true}></Header>
			<div className="Content_Wrapper_SHL">
				<Study_Habits_Sidebar></Study_Habits_Sidebar>
				<div className="Content_SHL">
					<h2 className="title">Study Habits</h2>
					<div className="section">
						<h3 className="subtitle">Your Top 3 Study Habits:</h3>
						<div className="top-habits">
							{studyHabits.map((habit, index) => (
								<Link to={habit.path} key={index} className="habit-card">
									<p className="habit-title">{habit.title}</p>
									<p className="habit-description">{habit.description}</p>
								</Link>
							))}
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

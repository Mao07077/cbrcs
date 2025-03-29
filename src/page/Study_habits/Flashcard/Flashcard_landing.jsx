import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Styles from './Flashcardlanding_style.module.css'; // ✅ Ensure this file exists and is properly named
import Header from '../../../Components/composables/Header'; // ✅ Ensure this path is correct
import Study_Habits_Sidebar from '../../../Components/Study_Habits_Sidebar';
import Footer from '../../../Components/composables/Footer';

const FlashcardsLandingPage = () => {
	const [modules, setModules] = useState([]);
	const [error, setError] = useState(null);
	const [userProgram, setUserProgram] = useState(null);
	const navigate = useNavigate();

	// ✅ Fetch User Profile
	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const idNumber = localStorage.getItem('userIdNumber');
				if (!idNumber) {
					setError('User not logged in');
					return;
				}

				const response = await fetch(
					`http://localhost:8000/api/profile/${idNumber}`
				);
				if (!response.ok) throw new Error('Failed to fetch user profile');

				const data = await response.json();
				console.log('User Profile:', data); // Debugging
				setUserProgram(data.program || 'All Programs'); // Default to 'All Programs'
			} catch (err) {
				setError(err.message);
			}
		};

		fetchUserProfile();
	}, []);

	// ✅ Fetch Modules Based on User Program
	useEffect(() => {
		if (!userProgram) return;

		const apiUrl =
			userProgram === 'All Programs'
				? 'http://localhost:8000/api/modules'
				: `http://localhost:8000/api/modules?program=${encodeURIComponent(
						userProgram
				  )}`;

		console.log('Fetching modules from:', apiUrl);

		fetch(apiUrl)
			.then((response) => {
				if (!response.ok)
					throw new Error(`HTTP error! Status: ${response.status}`);
				return response.json();
			})
			.then((data) => {
				console.log('Modules fetched:', data);
				setModules(data);
			})
			.catch((error) => setError(error.message));
	}, [userProgram]);

	// ✅ Handle Click to Open Flashcards
	const handleOpenFlashcards = (moduleId) => {
		navigate(`/flashcards/${moduleId}`);
	};

	return (
		<div className={Styles.page_container}>
			<Header isStudyHabits={true}></Header>
			<div className={Styles.content_wrapper}>
				<Study_Habits_Sidebar></Study_Habits_Sidebar>
				<div className={Styles.module_container}>
					<h1 className={Styles.module_title}>Flashcards Modules</h1>
					<p className={Styles.module_description}>
						Select a module to review its flashcards.
					</p>

					<div className={Styles.module_grid}>
						{error ? (
							<p>{`Error: ${error}`}</p>
						) : modules.length > 0 ? (
							modules.map((module) => (
								<div className={Styles.module_card} key={module._id}>
									<h3>{module.title}</h3>
									<img
										src={`http://localhost:8000/${module.image_url}`}
										alt="Module"
										className={Styles.module_image}
									/>
									<br />
									<button
										className={Styles.proceed_btn}
										onClick={() => handleOpenFlashcards(module._id)}
									>
										Open Flashcards
									</button>
								</div>
							))
						) : (
							<p>No modules available</p>
						)}
					</div>
				</div>
			</div>
			<Footer></Footer>
		</div>
	);
};

export default FlashcardsLandingPage;

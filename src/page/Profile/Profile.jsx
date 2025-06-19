import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Styles from './profile.module.css';
import nameIcon from '../../icon/name.png';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Header from '../../Components/composables/Header';
import Student_Sidebar from '../../Components/Student_Sidebar';
import Footer from '../../Components/composables/FooterP';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const API_URL = "http://127.0.0.1:8000";
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : "http://127.0.0.1:8000");
const DailyActivityBarChart = ({ dailyData }) => {
	const data = {
		labels: dailyData.map((item) => item.day),
		datasets: [
			{
				label: 'Daily Study Hours',
				data: dailyData.map((item) => item.hours),
				backgroundColor: 'rgba(75, 192, 192, 0.6)',
				borderColor: 'rgba(75, 192, 192, 1)',
				borderWidth: 1,
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false, // Allow the chart to resize dynamically
		scales: {
			y: {
				beginAtZero: true,
				title: {
					display: true,
					text: 'Hours',
				},
			},
			x: {
				title: {
					display: true,
					text: 'Day',
				},
			},
		},
		plugins: {
			legend: {
				position: 'top',
			},
		},
	};

	return (
		<div style={{ width: '100%', height: '300px', maxWidth: '600px', margin: '0 auto' }}>
			{/* Adjust height and center the chart */}
			<Bar data={data} options={options} />
		</div>
	);
};

const Profile = () => {
	const handleNavigation = (route) => {
		console.log(`Navigating to: ${route}`);
		window.location.href = `/${route}`;
	};

	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [profileImage, setProfileImage] = useState(nameIcon);
	const [top3Habits, setTop3Habits] = useState([]); // State for top 3 habits

	const [dailyData, setDailyData] = useState([
		{ day: 'Monday', hours: 2 },
		{ day: 'Tuesday', hours: 3 },
		{ day: 'Wednesday', hours: 4 },
		{ day: 'Thursday', hours: 1.5 },
		{ day: 'Friday', hours: 2.5 },
		{ day: 'Saturday', hours: 3 },
		{ day: 'Sunday', hours: 4 },
	]);

	useEffect(() => {
		const fetchProfileAndHabits = async () => {
			try {
				const idNumber = localStorage.getItem('userIdNumber');
				if (!idNumber) {
					setError('User not logged in');
					setLoading(false);
					return;
				}

				// Fetch user profile data
				const profileResponse = await fetch(`${API_URL}/api/profile/${idNumber}`);
				if (!profileResponse.ok) {
					throw new Error('Failed to fetch profile');
				}
				const profileData = await profileResponse.json();
				setProfile(profileData);

				// Fetch top 3 study habits
				const habitsResponse = await fetch(`${API_URL}/students/${idNumber}/recommended-pages`);
				if (!habitsResponse.ok) {
					throw new Error('Failed to fetch habits');
				}
				const habitsData = await habitsResponse.json();
				setTop3Habits(habitsData.recommendedPages); // Assuming response has 'recommendedPages' key
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchProfileAndHabits();
	}, []);

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			setProfileImage(imageUrl);
		}
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div className={Styles.MainContainer}>
			<Header></Header>

			<div className={Styles.Content_Wrapper}>
				<Student_Sidebar></Student_Sidebar>
				<div className={Styles.Content}>
					<div className={Styles.TopSection}>
						<h2>Account Profile</h2>
					</div>

					{/* Profile Icon and Info Card */}
					<div className={Styles.Info}>
						<div className={Styles.IconContainer}>
							<img src={profileImage} alt="Profile Icon" />
							<input
								type="file"
								accept="image/*"
								onChange={handleImageChange}
								style={{ display: 'none' }}
								id="profileImageUpload"
							/>
							<button
								className={Styles.editButton}
								onClick={() =>
									document.getElementById('profileImageUpload').click()
								}
							>
								Edit
							</button>
						</div>

						<div className={Styles.InfoCard}>
							<label>Name: {profile?.firstname} {profile?.lastname}</label>
							<label>Age: {profile?.age || 'N/A'}</label>
							<label>Id Number: {profile?.id_number}</label>
							<label>Program: {profile?.program}</label>
							<div className={Styles.DateInfo}>
								<p>Date Started and End Date</p>
								<p>09/20/2004 - 03/12/2025</p>
							</div>
						</div>
					</div>

					{/* Display Dynamic Top 3 Study Habits */}
					<div className={Styles.HabitsWrapper}>
						<h3 className={Styles.StudyTitle}>Your Top 3 Study Habits</h3>
						{top3Habits.length > 0 ? (
							top3Habits.map((habit, index) => (
								<div
									key={index}
									className={Styles.HabitCard}
									onClick={() => handleNavigation(habit)}
								>
									<h4 className={Styles.HabitTitle}>{habit}</h4>
									<p className={Styles.HabitDescription}>
										Description for {habit}
									</p>
								</div>
							))
						) : (
							<p>No habits found</p>
						)}
					</div>

					{/* Daily Activity Bar Chart */}
					<div className={Styles.chartSection}>
						<h3>Daily Activity</h3>
						<div className={Styles.Data}>
						<DailyActivityBarChart dailyData={dailyData} />
						</div>
					</div>
				</div>
			</div>

			<Footer></Footer>
		</div>
	);
};

export default Profile;

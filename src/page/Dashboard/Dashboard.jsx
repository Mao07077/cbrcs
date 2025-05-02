import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Styles from './Dashboard.module.css';

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	ArcElement,
	Tooltip,
	Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import Header from '../../Components/composables/Header';
import Student_Sidebar from '../../Components/Student_Sidebar';
import Footer from '../../Components/composables/Footer';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	ArcElement,
	Tooltip,
	Legend
);

const SidebarItem = ({ icon, text, onClick }) => (
	<li>
		<button className="sidebar-item" onClick={onClick}>
			<img src={icon} alt={text} className="sidebar-icon" />
			<span>{text}</span>
		</button>
	</li>
);

const Dashboard = ({ isModal = false }) => {
	const handleNavigation = (route) => {
		console.log(`Navigating to: ${route}`);
		window.location.href = `/${route}`;
	};

	const [idNumber, setIdNumber] = useState(localStorage.getItem('userIdNumber') || '');
	const [progress, setProgress] = useState(60);
	const [error, setError] = useState(null);
	const [barChartData, setBarChartData] = useState({
		labels: [],
		datasets: [],
	});
	const [top3Habits, setTop3Habits] = useState([]);

	// Dynamically set API_URL based on the environment
	const API_URL = process.env.REACT_APP_API_URL || 
    (window.location.hostname === "localhost" ? "http://127.0.0.1:8000" : "https://cbrcs.onrender.com");

	useEffect(() => {
		if (!idNumber) {
			setError('User not logged in');
			return;
		}

		const fetchDashboardData = async () => {
			try {
				// Fetching post-test data
				const response = await axios.get(`${API_URL}/api/dashboard/${idNumber}`);
				const { post_tests } = response.data;

				if (post_tests) {
					setBarChartData({
						labels: post_tests.map(
							(test) => test.post_test_title || 'Unknown Post-Test'
						),
						datasets: [
							{
								label: 'Correct',
								data: post_tests.map((test) => test.correct || 0),
								backgroundColor: 'rgba(75, 192, 192, 0.6)',
							},
							{
								label: 'Incorrect',
								data: post_tests.map((test) => test.incorrect || 0),
								backgroundColor: 'rgba(255, 99, 132, 0.6)',
							},
							{
								label: 'Total Questions',
								data: post_tests.map((test) => test.total_questions || 0),
								backgroundColor: 'rgba(86, 14, 230, 0.6)',
							},
						],
					});
				}

				// Fetching recommended study habits
				const habitsResponse = await axios.get(`${API_URL}/students/${idNumber}/recommended-pages`);
				setTop3Habits(habitsResponse.data.recommendedPages || []);
			} catch (error) {
				setError('Failed to fetch dashboard data');
				console.error(error);
			}
		};

		fetchDashboardData();
	}, [idNumber]);

	if (error) {
		return <div>Error: {error}</div>;
	}

	const progressData = {
		labels: ['Completed', 'Remaining'],
		datasets: [
			{
				data: [progress, 100 - progress],
				backgroundColor: ['#FFD700', '#1E40AF'],
			},
		],
	};
	const updatedBarChartData = {
		labels: barChartData.labels,
		datasets: barChartData.datasets.map((dataset) => ({
			...dataset,
		})),
	};

	return (
		<div className={Styles.MainContainer}>
			<Header></Header>
			<div className={Styles.Content_Wrapper}>
				<Student_Sidebar></Student_Sidebar>
				<div className={Styles.Content}>
					<div className={Styles.Title}>
						<h2>Dashboard</h2>
					</div>
					<div className={Styles.PerformanceOverview}>
						<h2>Performance Overview</h2>
						<p>Track your progress </p>
							<div className={Styles.ProgressContainer}>
							<Doughnut
								data={progressData}
								options={{
									responsive: true,
									maintainAspectRatio: false,
									cutout: '70%', // Ensures the hole in the middle
									plugins: {
										tooltip: { enabled: false }, // Disable tooltips
										legend: { display: false }, // Hide legend if not needed
									},
								}}
								plugins={[
									{
										id: 'centerText',
										afterDraw: (chart) => {
											const {
												ctx,
												chartArea: { left, right, top, bottom },
											} = chart;

											// Save the current context state
											ctx.save();

											// Adjust font size dynamically based on chart size and screen width
											const isMobile = window.innerWidth <= 768; // Define mobile view
											const fontSize = isMobile
												? Math.min((right - left) / 7, 16) // Smaller font size for mobile
												: Math.min((right - left) / 5, 24); // Default font size for larger screens

											// Set font and text properties
											ctx.font = `bold ${fontSize}px Arial`;
											ctx.fillStyle = '#000'; // Set text color
											ctx.textAlign = 'center';
											ctx.textBaseline = 'middle';

											// Calculate exact center position
											const centerX = (left + right) / 2;
											const centerY = (top + bottom) / 2;

											// Draw the percentage in the middle of the doughnut
											ctx.fillText(`${progress}%`, centerX, centerY);

											// Restore the context state
											ctx.restore();
										},
									},
								]}
							/>
						</div>
						<p className={Styles.Disclaimer}>
							Note: For new accounts, the progress starts at 60% as the standard passing threshold.
						</p>
					</div>
					<div className={Styles.Section}>
						<div className={Styles.StrengthWeaknessContainer}>
							<div className={Styles.StrengthCard}>Strength</div>
							<div className={Styles.WeaknessCard}>Weakness</div>
						</div>
						<section className={Styles.StudyHabitsSection}>
							<h3>Top 3 Study Habits:</h3>
							<div className={Styles.HabitsWrapper}>
								{top3Habits.length > 0 ? (
									top3Habits.map((habit, index) => (
										<div
											key={index}
											className={Styles.HabitCard}
											onClick={() => handleNavigation(habit)} // Navigate based on the habit
										>
											<h4 className={Styles.HabitTitle}>{habit}</h4>
											<p className={Styles.HabitDescription}>Description for {habit}</p>
										</div>
									))
								) : (
									<p>No recommended study habits found.</p>
								)}
							</div>
						</section>
						<section className={Styles.ProgressChartSection}>
							<h3>Post-Test Scores</h3>
							<Bar
								data={updatedBarChartData}
								options={{
									responsive: true,
									scales: {
										y: { beginAtZero: true },
										x: {
											stacked: false,
											grouped: true,
											categoryPercentage: 0.7, // Slightly increase category width allocation
											barPercentage: 0.3, // Significantly decrease bar width percentage for thinner bars
										},
									},
									plugins: {
										legend: { display: true },
									},
								}}
							/>
						</section>
					</div>
				</div>
			</div>

			<Footer></Footer>
		</div>
	);
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import Styles from './Admin_Dashboard.module.css';
import Admin_Sidebar from '../../Components/Admin_Sidebar';
import Footer from '../../Components/composables/Footer';
import Header from '../../Components/composables/Header';

const AdminDashboard = () => {
	const [fileName, setFileName] = useState('No file chosen');
	const [isDragging, setIsDragging] = useState(false);
	const [attendanceData, setAttendanceData] = useState([]); // State for attendance data
	const [stats, setStats] = useState({
		totalStudents: 0,
		engagementRate: 0,
	});

	// Simulating an API call for stats
	useEffect(() => {
		const fetchStats = async () => {
			// Simulate an API response with mock data
			const mockStats = {
				totalStudents: 40, // Example number of students
				engagementRate: 50, // Example engagement rate
			};
			// Simulate loading delay
			setTimeout(() => {
				setStats(mockStats);
			}, 1000);
		};

		fetchStats();
	}, []);

	// Simulate fetching attendance data
	useEffect(() => {
		const simulateBackendFetch = async () => {
			return new Promise((resolve) =>
				setTimeout(() => resolve([70, 50, 90, 60, 40]), 1000)
			);
		};

		const fetchAttendanceData = async () => {
			const data = await simulateBackendFetch();
			setAttendanceData(data);
		};

		fetchAttendanceData();
	}, []);

	return (
		// header
		<div className={Styles.Maincontainer}>
			<Header></Header>
			{/* wrapper */}
			<div className={Styles.Content_Wrapper}>
				{/* sidebar */}
				<Admin_Sidebar></Admin_Sidebar>
				{/* content */}
				<div className={Styles.Content}>
					<div className={Styles.Greeting_Dashboard}>
						<h1>Admin Dashboard</h1>
					</div>
					<div className={Styles.Statistics_Container}>
						<div className={Styles.Stat_Card}>
							<h1>Total Number of Students</h1>
							<h2>{stats.totalStudents || 'Loading...'}</h2>
						</div>
						<div className={Styles.Stat_Card}>
							<h1> Number of Instructor/per season</h1>
							<h2>{stats.totalStudents || 'Loading...'}</h2>
						</div>
						<div className={Styles.Stat_Card}>
							<h1>number of Enrolled course's/per season</h1>
							<h2>
								{stats.engagementRate
									? `${stats.engagementRate}%`
									: 'Loading...'}
							</h2>
						</div>
					</div>

					<div className={Styles.List_Students}>
						<div className={Styles.Student}>
							<h2>List of Students</h2>
						</div>
						<div className={Styles.Instructor}>
							<h2>Names of Instructor's/Per season</h2>
						</div>
					</div>
				</div>
			</div>
			{/* footer */}
			<Footer></Footer>
		</div>
	);
};

export default AdminDashboard;

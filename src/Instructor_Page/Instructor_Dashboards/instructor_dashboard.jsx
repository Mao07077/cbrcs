import React, { useState, useEffect } from 'react';
import Styles from './InstructorDashboard.module.css';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import Header from '../../Components/composables/Header';
import Instructor_Sidebar from '../../Components/Instructor_Sidebar';
import Footer from '../../Components/composables/Footer';

const InstructorDashboard = () => {
	const handleNavigation = (route) => {
		console.log(`Navigating to: ${route}`);
		window.location.href = `/${route}`;
	};

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [attendanceData, setAttendanceData] = useState([]);
	const [modules, setModules] = useState([]);
	const [stats, setStats] = useState({
		totalStudents: 0,
		engagementRate: 0,
	});

	const [selectedFile, setSelectedFile] = useState(null);

	useEffect(() => {
		const fetchStats = async () => {
			const mockStats = {
				totalStudents: 0,
				engagementRate: 0,
			};
			setTimeout(() => {
				setStats(mockStats);
			}, 1000);
		};
		fetchStats();
	}, []);

	useEffect(() => {
		const fetchAttendanceData = async () => {
			const data = await new Promise((resolve) =>
				setTimeout(() => resolve([70, 50, 90, 60, 40]), 1000)
			);
			setAttendanceData(data);
		};
		fetchAttendanceData();
	}, []);

	useEffect(() => {
		const fetchModules = async () => {
			const mockModules = ['Module 1', 'Module 2', 'Module 3'];
			setTimeout(() => {
				setModules(mockModules);
			}, 1000);
		};
		fetchModules();
	}, []);

	return (
		<div className={Styles.MainContainer}>
			<Header></Header>
			<div className={Styles.Content_Wrapper}>
				<Instructor_Sidebar></Instructor_Sidebar>
				<div className={Styles.Content}>
					<div className={Styles.Greeting_Dashboard}>
						<h1>Instructor Dashboard</h1>
					</div>

					<div className={Styles.Statistics_Container}>
						<div className={Styles.Stat_Card}>
							<h1>Total Number of Students</h1>
							<h2>{stats.totalStudents}</h2>
						</div>
						<div className={Styles.Stat_Card}>
							<h1>Student Engagement Rate</h1>
							<h2>{stats.engagementRate}%</h2>
						</div>
					</div>

					<div className={Styles.Create_Module}>
						<div className={Styles.AnnouncementBox}>
							<div className={Styles.AnnouncementInput}>
								<input
									type="text"
									placeholder="Post announcement here"
									className={Styles.InputField}
								/>
							</div>
							<hr className={Styles.Divider} />
							<div className={Styles.AnnouncementActions}>
								<input
									type="file"
									id="fileInput"
									style={{ display: 'none' }}
									onChange={(e) => setSelectedFile(e.target.files[0])}
								/>
								<button
									className={Styles.AttachFile}
									onClick={() => document.getElementById('fileInput').click()}
								>
									+ Attach file
								</button>
								{selectedFile && (
									<span className={Styles.FileName}>{selectedFile.name}</span>
								)}
								<button className={Styles.PostButton}>Post</button>
							</div>
						</div>
					</div>

					<div className={Styles.Content_Container}>
						<div className={Styles.Student_Attendance}>
							<h2>Student Attendance</h2>
							<div className={Styles.Graph}>
								{attendanceData.length > 0 ? (
									attendanceData.map((value, index) => (
										<div
											key={index}
											className={Styles.Bar}
											style={{
												height: `${value}%`,
												transition: 'height 0.5s ease-in-out',
											}}
											title={`Attendance: ${value}%`}
										></div>
									))
								) : (
									<p>Loading attendance data...</p>
								)}
							</div>
						</div>

						<div className={Styles.Modules_List}>
							<h2>Module\Course Name</h2>
							{modules.length > 0 ? (
								modules.map((module, index) => (
									<div key={index} className={Styles.Module}>
										{module}
									</div>
								))
							) : (
								<p>Loading modules...</p>
							)}
						</div>
					</div>
				</div>
			</div>

			<Footer></Footer>
		</div>
	);
};

export default InstructorDashboard;

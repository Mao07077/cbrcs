import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Styles from './Admin_Dashboard.module.css';
import Dashboard from '../../icon/dashboard.png';
import Icon from '../../icon/actual.png';
import Accounts from '../../icon/name.png';
import Report from '../../icon/Reports.png';
import AdminPost from '../../icon/Upload.png';
import Request from '../../icon/request.png';
import { HomeIcon, SquarePen, UserIcon } from 'lucide-react';
import Sidebar from '../../Components/composables/Sidebar';

const SidebarItem = ({ icon, text, onClick }) => (
	<li>
		<button className="sidebar-item" onClick={onClick}>
			<img src={icon} alt={text} className="sidebar-icon" />
			<span>{text}</span>
		</button>
	</li>
);

const routes = [
	{
		routeName: 'Dashboard',
		routePath: '/Admin_Dashboard',
		routeIcon: <HomeIcon></HomeIcon>,
	},
	{
		routeName: 'Accounts',
		routePath: '/Accounts',
		routeIcon: <UserIcon></UserIcon>,
	},
	{
		routeName: 'Uploads',
		routePath: '/Adminpost',
		routeIcon: <UserIcon></UserIcon>,
	},
	{
		routeName: 'Report',
		routePath: '/Report',
		routeIcon: <Flag></Flag>,
	},

	{
		routeName: 'Request',
		routePath: '/Request',
		routeIcon: <SquarePen></SquarePen>,
	},
];

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
		<div className={Styles.Maincontainer}>
			<div className={Styles.Header}>
				<div className="header-content">
					<div className="header-logo">
						<img src={Icon} alt="logo" />
					</div>
				</div>
			</div>

			<Sidebar routes={routes}></Sidebar>

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
							{stats.engagementRate ? `${stats.engagementRate}%` : 'Loading...'}
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
	);
};

export default AdminDashboard;

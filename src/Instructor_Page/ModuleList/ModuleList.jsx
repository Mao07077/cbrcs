import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Styles from './Module.module.css';
import Icon from '../../icon/actual.png';
import CreateModule from '../Create_module/Create_module';
import Dashboard from '../../icon/dashboard.png';
import MailIcon from '../../icon/Mail.png';
import StudentsIcon from '../../icon/Students.png';
import Header from '../../Components/composables/Header';
import Instructor_Sidebar from '../../Components/Instructor_Sidebar';
import Footer from '../../Components/composables/Footer';

const ModuleList = () => {
	const [modules, setModules] = useState([]);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const userIdNumber = localStorage.getItem('userIdNumber') || 'All IDs';

	useEffect(() => {
		fetch('http://localhost:8000/api/modules')
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				return response.json();
			})
			.then((data) => setModules(data))
			.catch((error) => setError(error.message));
	}, []);

	const handleProceedClick = (moduleId) => {
		navigate(`/module/${moduleId}`);
	};

	const filteredModules = modules.filter(
		(module) => module.id_number === userIdNumber
	);

	return (
		<div className={Styles.MainContainer}>
			<Header></Header>
			<div className={Styles.Content_Wrapper}>
				<Instructor_Sidebar></Instructor_Sidebar>
				<div className={Styles.Content}>
					<div className={Styles.Greeting_Dashboard}>
						<h1>Module</h1>
					</div>
					<div className={Styles.ModuleGrid}>
						{error ? (
							<p>{`Error: ${error}`}</p>
						) : filteredModules.length > 0 ? (
							filteredModules.map((module) => (
								<div className={Styles.moduleCard} key={module._id}>
									<h3>{module.title}</h3>
									<p>Topic here</p>
									<div className={Styles.moduleImage}>Image here</div>
									<button
										className={Styles.proceedBtn}
										onClick={() => handleProceedClick(module._id)}
									>
										Proceed
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

export default ModuleList;

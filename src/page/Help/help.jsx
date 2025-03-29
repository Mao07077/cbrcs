import React from 'react';
import './help.css';
import Header from '../../Components/composables/Header';
import Study_Habits_Sidebar from '../../Components/Study_Habits_Sidebar';
import Footer from '../../Components/composables/Footer';

const HelpPage = () => {
	return (
		<div className="help_container">
			<Header isStudyHabits={true}></Header>
			<div className="help_wrapper">
				<Study_Habits_Sidebar></Study_Habits_Sidebar>
				<main className="help_content">
					<div className="contact-box">
						<h2>Contact Us</h2>
					</div>
				</main>
			</div>

			<Footer></Footer>
		</div>
	);
};

export default HelpPage;

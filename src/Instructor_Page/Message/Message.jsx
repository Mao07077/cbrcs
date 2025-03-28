import React, { useEffect } from 'react';
import Styles from './Message.module.css';
import Header from '../../Components/composables/Header';
import Footer from '../../Components/composables/Footer';
import Instructor_Sidebar from '../../Components/Instructor_Sidebar';

const Message = () => {
	const handleNavigation = (route) => {
		console.log(`Navigating to: ${route}`);

		window.location.href = `/${route}`;
	};

	return (
		<div className={Styles.Maincontainer}>
			<Header></Header>

			<div className={Styles.Content_Wrapper}>
				<Instructor_Sidebar></Instructor_Sidebar>
				<div className={Styles.Content}>
					<div className={Styles.Greeting_Dashboard}>
						<h1>Messages</h1>
					</div>
					<div className={Styles.Mail_Bar}>
						{Array.from({ length: 10 }).map((_, index) => (
							<div
								className={Styles.Email_Item}
								key={index}
								onClick={() => handleEmailClick(index)}
								style={{ cursor: 'pointer' }}
							>
								<div className={Styles.Email_Text}>
									<h2>Name Here</h2>
									<p>Active Now</p>
								</div>
								<div className={Styles.Button}>
									<buttonz type="submit-send">Message</buttonz>
								</div>
							</div>
						))}
					</div>
					<div classname={Styles.Email_Details}>
						<hr />
					</div>
				</div>
			</div>

			<Footer></Footer>
		</div>
	);
};

export default Message;

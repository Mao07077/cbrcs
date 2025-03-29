import { useState } from 'react';
import styles from './Chat.module.css';
import Header from '../../../Components/composables/Header';
import Footer from '../../../Components/composables/Footer';
import Study_Habits_Sidebar from '../../../Components/Study_Habits_Sidebar';

const Chat = () => {
	const [selectedInstructor, setSelectedInstructor] = useState(null);
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState('');

	const instructors = [
		{ name: 'Jessica Carroll', active: true },
		{ name: 'Emily Rose', active: false },
		{ name: 'David Bryant', active: true },
	];

	const selectInstructor = (instructor) => {
		setSelectedInstructor(instructor);
		setMessages([
			{ sender: instructor.name, text: 'Hello, how can I help you?' },
		]);
	};

	const sendMessage = () => {
		if (message.trim() && selectedInstructor) {
			setMessages([...messages, { sender: 'You', text: message }]);
			setMessage('');
		}
	};

	return (
		<div className={styles.chatContainer}>
			<Header />
			{/* Sidebar with Instructor List */}
			<div className={styles.content_Wrapper}>
				<Study_Habits_Sidebar></Study_Habits_Sidebar>
				<div className={styles.sidebar}>
					<h3>Messages</h3>
					{instructors.map((instructor, index) => (
						<div
							key={index}
							className={styles.instructorItem}
							onClick={() => selectInstructor(instructor)}
						>
							<div className={styles.instructorAvatar}></div>
							<div className={styles.instructorInfo}>
								<strong>{instructor.name}</strong>
								<p className={styles.previewText}>Click to chat</p>
								<p
									className={
										instructor.active
											? styles.activeStatus
											: styles.inactiveStatus
									}
								>
									<span className={styles.statusDot}></span>
									{instructor.active ? 'Active now' : 'Offline'}
								</p>
							</div>
						</div>
					))}
				</div>

				{/* Chat Section */}
				<div className={styles.chatSection}>
					{selectedInstructor ? (
						<>
							<div className={styles.chatHeader}>
								<div className={styles.instructorAvatar}></div>
								<h3>{selectedInstructor.name}</h3>
							</div>

							<div className={styles.messages}>
								{messages.map((msg, index) => (
									<div
										key={index}
										className={
											msg.sender === 'You'
												? styles.userMessage
												: styles.instructorMessage
										}
									>
										<div className={styles.messageBubble}>{msg.text}</div>
									</div>
								))}
							</div>

							<div className={styles.inputContainer}>
								<input
									type="text"
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									className={styles.input}
									placeholder="Type your message here..."
								/>
								<button onClick={sendMessage} className={styles.sendButton}>
									➤
								</button>
							</div>
						</>
					) : (
						<div className={styles.noChatSelected}>
							<p>Select an instructor to start a chat</p>
						</div>
					)}
				</div>
			</div>
			<Footer></Footer>
		</div>
	);
};

export default Chat;

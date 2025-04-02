import { useState, useEffect } from 'react';
import styles from './Scheduler.module.css';
import Header from '../../../Components/composables/Header';
import Footer from '../../../Components/composables/Footer';

const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const ScheduleTable = () => {
	const [schedule, setSchedule] = useState(
		Array(5)
			.fill(null)
			.map(() => Array(7).fill(''))
	);
	const [times, setTimes] = useState([
		'08:00 AM',
		'10:00 AM',
		'12:00 PM',
		'02:00 PM',
		'04:00 PM',
	]);
	const [reminder, setReminder] = useState(null);

	useEffect(() => {
		const checkReminders = () => {
			const now = new Date();
			const currentTime = now.toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
				hour12: true,
			});

			schedule.forEach((row, rowIndex) => {
				if (times[rowIndex] === currentTime) {
					row.forEach((item, colIndex) => {
						if (item) {
							setReminder(`Reminder: ${item} at ${times[rowIndex]}`);
						}
					});
				}
			});
		};

		const interval = setInterval(checkReminders, 60000);
		return () => clearInterval(interval);
	}, [schedule, times]);

	const handleTimeChange = (index, value) => {
		const newTimes = [...times];
		newTimes[index] = value;
		setTimes(newTimes);
	};

	const handleScheduleChange = (row, col, value) => {
		const newSchedule = [...schedule];
		newSchedule[row][col] = value;
		setSchedule(newSchedule);
	};

	return (
		<div className={styles.container}>
			<Header isStudyHabits={true}></Header>
			<div className={styles.content_wrapper}>

				<div className={styles.content_wrapper_sched}>
					{reminder && (
						<div className={styles.reminderPopup}>
							<p>{reminder}</p>
							<button onClick={() => setReminder(null)}>Close</button>
						</div>
					)}
					<div className={styles.scheduleWrapper}>
						<table className={styles.scheduleTable}>
							<thead>
								<tr>
									<th>TIME</th>
									{daysOfWeek.map((day, index) => (
										<th key={index} className={styles.dayHeader}>
											{day}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{schedule.map((row, rowIndex) => (
									<tr key={rowIndex}>
										<td>
											<input
												type="text"
												value={times[rowIndex]}
												onChange={(e) =>
													handleTimeChange(rowIndex, e.target.value)
												}
											/>
										</td>
										{row.map((item, colIndex) => (
											<td key={colIndex}>
												<input
													type="text"
													value={item}
													onChange={(e) =>
														handleScheduleChange(
															rowIndex,
															colIndex,
															e.target.value
														)
													}
												/>
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<Footer></Footer>
		</div>
	);
};

export default ScheduleTable;

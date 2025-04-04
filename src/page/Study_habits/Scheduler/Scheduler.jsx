import { useState, useEffect } from 'react';
import styles from './Scheduler.module.css';
import Header from '../../../Components/composables/Header';
import Footer from '../../../Components/composables/Footer';

const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const ScheduleTable = () => {
    const [schedule, setSchedule] = useState(
        Array(5)
            .fill(null)
            .map(() => Array(7).fill('0')) // Initialize all days with "0" (empty value)
    );
    const [times, setTimes] = useState([
        '08:00 AM',
        '10:00 AM',
        '12:00 PM',
        '02:00 PM',
        '04:00 PM',
    ]);
    const [reminder, setReminder] = useState(null);
    const [userIdNumber, setUserIdNumber] = useState(null); // Track user ID
    const [showTaskInput, setShowTaskInput] = useState(false); // State to toggle task input

    const [taskData, setTaskData] = useState({
        time: '',
        day: '',
        task: ''
    });

    // Define API URL dynamically based on environment
	const API_URL = process.env.REACT_APP_API_URL || 
    (window.location.hostname === "localhost" ? "http://127.0.0.1:8000" : "https://cbrcs.onrender.com");

    useEffect(() => {
        const userId = localStorage.getItem('userIdNumber');
        if (userId) {
            setUserIdNumber(userId);
            fetchSchedule(userId); // Fetch schedule when component mounts
        }
    }, []);

    useEffect(() => {
        const checkReminders = () => {
            const now = new Date();
            const currentDay = daysOfWeek[now.getDay()]; // Get current day
            const currentTime = now.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });

            schedule.forEach((row, rowIndex) => {
                if (times[rowIndex] === currentTime) {
                    row.forEach((item, colIndex) => {
                        if (item && item !== '0' && daysOfWeek[colIndex] === currentDay) {
                            // Notify user if task matches the current day and time
                            setReminder(`Reminder: ${item} at ${currentTime} on ${currentDay}`);
                        }
                    });
                }
            });
        };

        const interval = setInterval(checkReminders, 60000); // Check every minute
        return () => clearInterval(interval); // Clear the interval when the component is unmounted
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

    // Fetch schedule from backend
    const fetchSchedule = async (id_number) => {
        try {
            const response = await fetch(`${API_URL}/get_schedule/${id_number}`);
            const data = await response.json();
            if (data.schedule) {
                setSchedule(data.schedule);
                setTimes(data.times);
            }
        } catch (error) {
            console.error("Error fetching schedule:", error);
        }
    };

    // Save schedule to backend
    const saveSchedule = async () => {
        if (!userIdNumber) return;

        const scheduleData = {
            id_number: userIdNumber,
            schedule: schedule,
            times: times,
        };

        try {
            const response = await fetch(`${API_URL}/save_schedule`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(scheduleData),
            });

            const result = await response.json();
            if (result.success) {
                alert('Schedule saved successfully!');
            } else {
                alert('Failed to save schedule.');
            }
        } catch (error) {
            console.error("Error saving schedule:", error);
        }
    };

    // Function to handle task input and add to the schedule
    const handleAddTask = () => {
        if (taskData.task === '') {
            alert('Please enter a task.');
            return;
        }

        const newSchedule = [...schedule];
        const { time, day, task } = taskData;

        // Find the correct row (time) and column (day)
        const timeIndex = times.findIndex(t => t === time);
        const dayIndex = daysOfWeek.findIndex(d => d === day);

        if (timeIndex >= 0 && dayIndex >= 0) {
            newSchedule[timeIndex][dayIndex] = task;
            setSchedule(newSchedule);
            setShowTaskInput(false); // Hide the input field after adding task
        }
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
                                                onChange={(e) => handleTimeChange(rowIndex, e.target.value)}
                                            />
                                        </td>
                                        {row.map((item, colIndex) => (
                                            <td key={colIndex}>
                                                <input
                                                    type="text"
                                                    value={item === '0' ? '' : item} // Display empty for "0"
                                                    onChange={(e) =>
                                                        handleScheduleChange(rowIndex, colIndex, e.target.value)
                                                    }
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className={styles.addTaskWrapper}>
                            {!showTaskInput ? (
                                <button className={styles.addButton} onClick={() => setShowTaskInput(true)}>
                                    +
                                </button>
                            ) : (
                                <div className={styles.taskInput}>
                                    <select
                                        value={taskData.time}
                                        onChange={(e) =>
                                            setTaskData({ ...taskData, time: e.target.value })
                                        }
                                    >
                                        {times.map((time, index) => (
                                            <option key={index} value={time}>
                                                {time}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={taskData.day}
                                        onChange={(e) =>
                                            setTaskData({ ...taskData, day: e.target.value })
                                        }
                                    >
                                        {daysOfWeek.map((day, index) => (
                                            <option key={index} value={day}>
                                                {day}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Enter task"
                                        value={taskData.task}
                                        onChange={(e) =>
                                            setTaskData({ ...taskData, task: e.target.value })
                                        }
                                    />
                                    <button onClick={handleAddTask}>Add Task</button>
                                </div>
                            )}
                        </div>
                        <button onClick={saveSchedule} className={styles.saveButton}>Save Schedule</button>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default ScheduleTable;

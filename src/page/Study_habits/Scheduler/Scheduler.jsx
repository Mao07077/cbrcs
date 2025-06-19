import { useState, useEffect } from 'react';
import styles from './Scheduler.module.css';
import Header from '../../../Components/composables/Header';
import Footer from '../../../Components/composables/Footer';

const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const pastelColors = ['#FFD1DC', '#FFECB3', '#D1C4E9', '#B3E5FC', '#C8E6C9']; // Predefined pastel colors

const ScheduleTable = () => {
    const [schedule, setSchedule] = useState(
        Array(5).fill(null).map(() => Array(7).fill(''))
    );
    const [times, setTimes] = useState([
        '08:00 AM',
        '10:00 AM',
        '12:00 PM',
        '02:00 PM',
        '04:00 PM',
    ]);
    const [reminder, setReminder] = useState(null);
    const [userIdNumber, setUserIdNumber] = useState(null);
    const [showTaskInput, setShowTaskInput] = useState(false);

    const [taskData, setTaskData] = useState({
        time: '',
        day: '',
        task: '',
        color: '#FFD1DC', // Default pastel color
    });

    const API_URL = "http://127.0.0.1:8000";
    process.env.REACT_APP_API_URL ||
    (window.location.hostname === "localhost"
      ? "http://127.0.0.1:8000"
      : "http://127.0.0.1:8000");

    useEffect(() => {
        const userId = localStorage.getItem('userIdNumber');
        if (userId) {
            setUserIdNumber(userId);
            fetchSchedule(userId);
        }
    }, []);

    useEffect(() => {
        const checkReminders = () => {
            const now = new Date();
            const currentDay = daysOfWeek[now.getDay()];
            const currentTime = now.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });

            schedule.forEach((row, rowIndex) => {
                if (times[rowIndex] === currentTime) {
                    row.forEach((item, colIndex) => {
                        if (item && daysOfWeek[colIndex] === currentDay) {
                            setReminder(`Reminder: ${item} at ${currentTime} on ${currentDay}`);
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

    const fetchSchedule = async (id_number) => {
        try {
            const response = await fetch(`${API_URL}/get_schedule/${id_number}`);
            const data = await response.json();
            if (data.schedule) {
                setSchedule(data.schedule);
                setTimes(data.times);
            }
        } catch (error) {
            console.error('Error fetching schedule:', error);
        }
    };

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
            console.error('Error saving schedule:', error);
        }
    };

    const handleAddTask = () => {
        if (!taskData.time || !taskData.day || taskData.task.trim() === '') {
            alert('Please fill in all fields to add a task.');
            return;
        }

        const newSchedule = [...schedule];
        const { time, day, task, color } = taskData;

        // Find the correct row (time) and column (day)
        const timeIndex = times.findIndex(t => t === time);
        const dayIndex = daysOfWeek.findIndex(d => d === day);

        if (timeIndex >= 0 && dayIndex >= 0) {
            newSchedule[timeIndex][dayIndex] = { task, color }; // Update the task and color in the schedule
            setSchedule(newSchedule);
            setTaskData({ time: '', day: '', task: '', color: '#FFD1DC' }); // Reset the task input fields
            setShowTaskInput(false); // Hide the input field after adding the task
        } else {
            alert('Invalid time or day selected.');
        }
    };

    const handleAddRow = () => {
        setTimes([...times, '']);
        setSchedule([...schedule, Array(7).fill('')]);
    };

    return (
        <div className={styles.container}>
            <div style={{ width: '100%' }}>
                <Header isStudyHabits={true}></Header>
            </div>
            <div className={styles.content_wrapper}>
                <div className={styles.content_wrapper_sched}>
                    {reminder && (
                        <div className={styles.reminderPopup}>
                            <p>{reminder}</p>
                            <button onClick={() => setReminder(null)}>Close</button>
                        </div>
                    )}
                    <div className={styles.scheduleWrapper}>
                        <div className={styles.scheduleTable}>
                            <div className={styles.timeColumn}></div>
                            {daysOfWeek.map((day, index) => (
                                <div key={index} className={styles.dayHeader}>
                                    {day}
                                </div>
                            ))}
                            {schedule.map((row, rowIndex) => (
                                <>
                                    <div className={styles.timeColumn}>
                                        <input
                                            type="text"
                                            value={times[rowIndex]}
                                            onChange={(e) => handleTimeChange(rowIndex, e.target.value)}
                                        />
                                    </div>
                                    {row.map((item, colIndex) => (
                                        <div
                                            key={`${rowIndex}-${colIndex}`}
                                            className={styles.cell}
                                            style={{ backgroundColor: item?.color || '#f9f9f9' }} // Apply the task color
                                            onClick={() => {
                                                setTaskData({
                                                    time: times[rowIndex],
                                                    day: daysOfWeek[colIndex],
                                                    task: item?.task || '',
                                                    color: item?.color || '#FFD1DC',
                                                });
                                                setShowTaskInput(true);
                                            }}
                                        >
                                            {item?.task && <div className={styles.event}>{item.task}</div>}
                                        </div>
                                    ))}
                                </>
                            ))}
                        </div>

                        <div className={styles.buttonBar}>
                            {!showTaskInput ? (
                                <>
                                    <button className={styles.addButton} onClick={() => setShowTaskInput(true)}>
                                        +
                                    </button>
                                    <button onClick={handleAddRow} className={styles.addRowButton}>
                                        Add Row
                                    </button>
                                </>
                            ) : (
                                <div className={styles.taskInput}>
                                    <select
                                        value={taskData.time}
                                        onChange={(e) =>
                                            setTaskData({ ...taskData, time: e.target.value })
                                        }
                                    >
                                        <option value="" disabled>Select Time</option>
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
                                        <option value="" disabled>Select Day</option>
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
                                    <div className={styles.colorPicker}>
                                        <label>Pick a color:</label>
                                        <div className={styles.colorOptions}>
                                            {pastelColors.map((color, index) => (
                                                <button
                                                    key={index}
                                                    className={styles.colorButton}
                                                    style={{ backgroundColor: color }}
                                                    onClick={() => setTaskData({ ...taskData, color })}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <button onClick={handleAddTask}>Add Task</button>
                                </div>
                            )}
                        </div>
                        {showTaskInput && (
                            <div className={styles.saveButtonWrapper}>
                                <button onClick={saveSchedule} className={styles.saveButton}>
                                    Save
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div style={{ width: '100%' }}>
                <Footer></Footer>
            </div>
        </div>
    );
};

export default ScheduleTable;

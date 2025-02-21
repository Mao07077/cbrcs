import { useState, useEffect } from "react";
import styles from "./Scheduler.module.css";

const Scheduler = () => {
  const [schedule, setSchedule] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (day, time, value) => {
    setSchedule((prev) => ({
      ...prev,
      [`${day}-${time}`]: value,
    }));
  };

  useEffect(() => {
    const day = new Date().toLocaleString("en-US", { weekday: "short" }).toUpperCase();
    const hour = new Date().getHours();
    const key = `${day}-${hour}`;

    if (schedule[key]) {
      alert(`Reminder: ${schedule[key]}`);
    }
  }, [currentTime, schedule]);

  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const times = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className={styles.schedulerContainer}>
      <table className={styles.schedulerTable}>
        <thead>
          <tr>
            <th>TIME</th>
            {days.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map((time) => (
            <tr key={time}>
              <td>{`${time}:00`}</td>
              {days.map((day) => (
                <td key={`${day}-${time}`}>
                  <input
                    type="text"
                    value={schedule[`${day}-${time}`] || ""}
                    onChange={(e) => handleInputChange(day, time, e.target.value)}
                    className={styles.input}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Scheduler;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Styles from './Dashboard.module.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import Header from '../../Components/Header';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

const Dashboard = ({ isModal = false }) => {
    const [idNumber, setIdNumber] = useState(localStorage.getItem('userIdNumber') || '');
    const [progress, setProgress] = useState(60);
    const [error, setError] = useState(null);
    const [barChartData, setBarChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        if (!idNumber) {
            setError('User not logged in');
            return;
        }
        
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/dashboard/${idNumber}`);
                const { post_tests } = response.data;
                
                if (post_tests) {
                    setBarChartData({
                        labels: post_tests.map(test => test.post_test_title || 'Unknown Post-Test'),
                        datasets: [
                            {
                                label: 'Correct',
                                data: post_tests.map(test => test.correct || 0),
                                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            },
                            {
                                label: 'Incorrect',
                                data: post_tests.map(test => test.incorrect || 0),
                                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                            },
                            {
                                label: 'Total Questions',
                                data: post_tests.map(test => test.total_questions || 0),
                                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                            },
                        ],
                    });
                }
            } catch (error) {
                setError('Failed to fetch dashboard data');
                console.error(error);
            }
        };
        
        fetchDashboardData();
    }, [idNumber]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    const progressData = {
        labels: ['Completed', 'Remaining'],
        datasets: [
            {
                data: [progress, 100 - progress],
                backgroundColor: ['#FFD700', '#1E40AF'],
            },
        ],
    };

    return (
        <main className={Styles.Main_Dashboard}>
            {!isModal && <Header />}
            <h1 className={Styles.Title}>Dashboard</h1>
            <section className={Styles.PerformanceOverview}>
    <h2>Performance Overview</h2>
    <p>Track your progress </p>
    <div className={Styles.ProgressContainer} style={{ width: "200px", height: "200px" }}>
    <Doughnut 
    data={progressData} 
    options={{
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%", // Ensures the hole in the middle
        plugins: {
            tooltip: { enabled: false }, // Disable tooltips
            legend: { display: false }, // Hide legend if not needed
        }
    }}
    plugins={[
        {
            id: "centerText",
            afterDraw: (chart) => {
                const { ctx, chartArea: { left, right, top, bottom } } = chart;
                ctx.save();
                ctx.font = "bold 24px Arial"; // Adjust font size
                ctx.fillStyle = "#000"; // Set text color
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                // Calculate exact center position
                const centerX = (left + right) / 2;
                const centerY = (top + bottom) / 2;

                // Draw the percentage in the middle of the doughnut
                ctx.fillText(`${progress}%`, centerX, centerY);
                ctx.restore();
            }
        }
    ]}
/>


    </div>
</section>
            <div className={Styles.StrengthWeaknessContainer}>
                <div className={Styles.StrengthCard}>Strength</div>
                <div className={Styles.WeaknessCard}>Weakness</div>
            </div>
            <section className={Styles.StudyHabitsSection}>
                <h3>Top 3 Study Habits:</h3>
                <div className={Styles.StudyHabitsContainer}>
                    <div className={Styles.HabitCard}>Study With Friends</div>
                    <div className={Styles.HabitCard}>Listen To Music</div>
                    <div className={Styles.HabitCard}>Asking For Help</div>
                </div>
            </section>
            <section className={Styles.ProgressChartSection}>
                <h3>Post-Test Scores</h3>
                <Bar data={barChartData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
            </section>
        </main>
    );
};

export default Dashboard;

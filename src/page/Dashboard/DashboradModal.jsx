import React, { useState, useEffect } from 'react';
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

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

const API_URL =
  localStorage.getItem('REACT_APP_API_URL') ||
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : "https://ea13-110-54-166-204.ngrok-free.app");
function DashboardModal({ student, onClose }) {
    const [dashboardData, setDashboardData] = useState({
        modules: [],
        pre_tests: [],
        post_tests: []
    });
    const [preTestChartData, setPreTestChartData] = useState({
        labels: [],
        datasets: [],
    });
    const [postTestChartData, setPostTestChartData] = useState({
        labels: [],
        datasets: [],
    });
    const [top3Habits, setTop3Habits] = useState([]);
    const [progress] = useState(60); // Fixed progress as per Dashboard component
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Common headers for axios requests
    const requestHeaders = {
        'ngrok-skip-browser-warning': 'true', // Bypasses ngrok warning page
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    // Chart options for bar charts
    const chartOptions = {
        responsive: true,
        scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Value' } },
            x: {
                stacked: false,
                grouped: true,
                categoryPercentage: 0.7,
                barPercentage: 0.3,
            },
        },
        plugins: {
            legend: { display: true, position: 'top' },
        },
    };

    // Progress doughnut chart data
    const progressData = {
        labels: ['Completed', 'Remaining'],
        datasets: [
            {
                data: [progress, 100 - progress],
                backgroundColor: ['#FFD700', '#1E40AF'],
            },
        ],
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch dashboard data
                const response = await axios.get(`${API_URL}/api/dashboard/${student.studentNo}`, {
                    headers: requestHeaders, // Add headers here
                });
                const { pre_tests, post_tests } = response.data;
                setDashboardData(response.data);

                // Process pre-test data for bar chart
                if (pre_tests && pre_tests.length > 0) {
                    const preTestLabels = pre_tests.map(
                        (test) => test.pre_test_title || 'Unknown Pre-Test'
                    );
                    setPreTestChartData({
                        labels: preTestLabels,
                        datasets: [
                            {
                                label: 'Pre-Test Correct',
                                data: pre_tests.map((test) => test.correct || 0),
                                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1,
                            },
                            {
                                label: 'Pre-Test Incorrect',
                                data: pre_tests.map((test) => test.incorrect || 0),
                                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                                borderColor: 'rgba(255, 99, 132, 1)',
                                borderWidth: 1,
                            },
                            {
                                label: 'Pre-Test Total Questions',
                                data: pre_tests.map((test) => test.total_questions || 0),
                                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                                borderColor: 'rgba(153, 102, 255, 1)',
                                borderWidth: 1,
                            },
                            {
                                label: 'Pre-Test Time Spent (min)',
                                data: pre_tests.map((test) => Math.floor((test.time_spent || 0) / 60)),
                                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                                borderColor: 'rgba(255, 159, 64, 1)',
                                borderWidth: 1,
                            },
                        ],
                    });
                }

                // Process post-test data for bar chart
                if (post_tests && post_tests.length > 0) {
                    const postTestLabels = post_tests.map(
                        (test) => test.post_test_title || 'Unknown Post-Test'
                    );
                    setPostTestChartData({
                        labels: postTestLabels,
                        datasets: [
                            {
                                label: 'Post-Test Correct',
                                data: post_tests.map((test) => test.correct || 0),
                                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1,
                            },
                            {
                                label: 'Post-Test Incorrect',
                                data: post_tests.map((test) => test.incorrect || 0),
                                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                                borderColor: 'rgba(255, 99, 132, 1)',
                                borderWidth: 1,
                            },
                            {
                                label: 'Post-Test Total Questions',
                                data: post_tests.map((test) => test.total_questions || 0),
                                backgroundColor: 'rgba(86, 14, 230, 0.6)',
                                borderColor: 'rgba(86, 14, 230, 1)',
                                borderWidth: 1,
                            },
                            {
                                label: 'Post-Test Time Spent (min)',
                                data: post_tests.map((test) => Math.floor((test.time_spent || 0) / 60)),
                                backgroundColor: 'rgba(255, 206, 86, 0.6)',
                                borderColor: 'rgba(255, 206, 86, 1)',
                                borderWidth: 1,
                            },
                        ],
                    });
                }

                // Fetch recommended study habits
                const habitsResponse = await axios.get(`${API_URL}/students/${student.studentNo}/recommended-pages`, {
                    headers: requestHeaders, // Add headers here
                });
                setTop3Habits(habitsResponse.data.recommendedPages || []);

                setIsLoading(false);
            } catch (error) {
                const errorMessage = error.response?.data?.detail || 'Failed to load dashboard data.';
                console.error('Error fetching dashboard data:', error.response?.data || error.message);
                setError(errorMessage);
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [student.studentNo]);

    const handleNavigation = (route) => {
        console.log(`Navigating to: ${route}`);
        window.location.href = `/${route}`;
    };

    return (
        <div className={Styles.modalOverlay}>
            <div className={Styles.modalContent}>
                <button className={Styles.closeButton} onClick={onClose}>
                    ×
                </button>
                <h2>{student.name}'s Dashboard</h2>
                {isLoading ? (
                    <p>Loading dashboard...</p>
                ) : error ? (
                    <p className={Styles.error}>{error}</p>
                ) : (
                    <div className={Styles.dashboardContent}>
                        <div className={Styles.PerformanceOverview}>
                            <h3>Performance Overview</h3>
                            <p>Track your progress</p>
                            <div className={Styles.ProgressContainer}>
                                <Doughnut
                                    data={progressData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        cutout: '70%',
                                        plugins: {
                                            tooltip: { enabled: false },
                                            legend: { display: false },
                                        },
                                    }}
                                    plugins={[
                                        {
                                            id: 'centerText',
                                            afterDraw: (chart) => {
                                                const {
                                                    ctx,
                                                    chartArea: { left, right, top, bottom },
                                                } = chart;

                                                ctx.save();

                                                const isMobile = window.innerWidth <= 768;
                                                const fontSize = isMobile
                                                    ? Math.min((right - left) / 7, 16)
                                                    : Math.min((right - left) / 5, 24);

                                                ctx.font = `bold ${fontSize}px Arial`;
                                                ctx.fillStyle = '#000';
                                                ctx.textAlign = 'center';
                                                ctx.textBaseline = 'middle';

                                                const centerX = (left + right) / 2;
                                                const centerY = (top + bottom) / 2;

                                                ctx.fillText(`${progress}%`, centerX, centerY);

                                                ctx.restore();
                                            },
                                        },
                                    ]}
                                />
                            </div>
                            <p className={Styles.Disclaimer}>
                                Note: For new accounts, the progress starts at 60% as the standard passing threshold.
                            </p>
                        </div>
                        <div className={Styles.Section}>
                            <div className={Styles.StrengthWeaknessContainer}>
                                <div className={Styles.StrengthCard}>Strength</div>
                                <div className={Styles.WeaknessCard}>Weakness</div>
                            </div>
                            <section className={Styles.StudyHabitsSection}>
                                <h3>Top 3 Study Habits:</h3>
                                <div className={Styles.HabitsWrapper}>
                                    {top3Habits.length > 0 ? (
                                        top3Habits.map((habit, index) => (
                                            <div
                                                key={index}
                                                className={Styles.HabitCard}
                                                onClick={() => handleNavigation(habit)}
                                            >
                                                <h4 className={Styles.HabitTitle}>{habit}</h4>
                                                <p className={Styles.HabitDescription}>Description for {habit}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Please wait a moment while we identify your Top 3 Study Habits</p>
                                    )}
                                </div>
                            </section>
                            <section className={Styles.ProgressChartSection}>
                                <h3>Pre-Test Performance</h3>
                                {preTestChartData.labels.length > 0 ? (
                                    <Bar
                                        data={preTestChartData}
                                        options={{
                                            ...chartOptions,
                                            plugins: {
                                                ...chartOptions.plugins,
                                                title: { display: true, text: 'Pre-Test Scores' },
                                            },
                                        }}
                                    />
                                ) : (
                                    <p>Analyzing your pre-test results—please wait while we calculate your performance.</p>
                                )}
                                <h3 className={Styles.ChartTitle}>Post-Test Performance</h3>
                                {postTestChartData.labels.length > 0 ? (
                                    <Bar
                                        data={postTestChartData}
                                        options={{
                                            ...chartOptions,
                                            plugins: {
                                                ...chartOptions.plugins,
                                                title: { display: true, text: 'Post-Test Scores' },
                                            },
                                        }}
                                    />
                                ) : (
                                    <p>Processing your post-test scores—please wait as we generate your performance summary.</p>
                                )}
                            </section>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DashboardModal;
import React, { useEffect, useState } from 'react';
import './dashboard.css';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import nameIcon from './icon/name.png';
import notifIcon from './icon/notif.png';
import moduleIcon from './icon/module.png';
import dashboardIcon from './icon/dashboard.png';
import settingsIcon from './icon/settings.png';
import helpIcon from './icon/help.png';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Sidebar Item Component
const SidebarItem = ({ icon, text, link }) => (
    <li>
        <img src={icon} alt={`${text} Icon`} width="30%" height="30%" />
        <a href={link}>{text}</a>
    </li>
);

// Pretest Score Chart Component
const PretestScoreChart = ({ scores }) => {
    const data = {
        labels: scores.map(score => score.subject),
        datasets: [
            {
                label: 'Pretest Scores',
                data: scores.map(score => score.score),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return <Bar data={data} options={options} />;
};

// Post-Test Score Bar Chart Component
const PostTestScoreBarChart = ({ postTestScores }) => {
    const data = {
        labels: postTestScores.map(score => score.post_test_title || "Unknown Post-Test"),
        datasets: [
            {
                label: 'Correct',
                data: postTestScores.map(score => score.correct || 0),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Incorrect',
                data: postTestScores.map(score => score.incorrect || 0),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
            {
                label: 'Total Questions',
                data: postTestScores.map(score => score.total_questions || 0),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    return <Bar data={data} options={options} />;
};

// Main Dashboard Component
const Dashboard = () => {
    const [idNumber, setIdNumber] = useState(localStorage.getItem('userIdNumber') || '');
    const [data, setData] = useState(null);
    const [scores, setScores] = useState([]);
    const [postTestScores, setPostTestScores] = useState([]);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    // Fetch data from the backend
    useEffect(() => {
        if (!idNumber) {
            setError('User not logged in');
            return;
        }

        const fetchDashboardData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/dashboard/${idNumber}`);
                const { completed_count, total_modules } = response.data;

                setData(response.data);
                setScores(response.data.pretest_scores || []);
                setPostTestScores(response.data.post_tests || []);

                // Calculate progress percentage
                if (total_modules > 0) {
                    setProgress((completed_count / total_modules) * 100);
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

    return (
        <div>
            <header className="header">
                <h1>Logo here</h1>
                <img src={nameIcon} alt="Profile" />
                <img src={notifIcon} alt="Notifications" />
            </header>
            <nav className="sidebar">
                <ul>
                    <SidebarItem icon={nameIcon} text="Name" link="profile" />
                    <SidebarItem icon={moduleIcon} text="Module" link="module" />
                    <SidebarItem icon={dashboardIcon} text="Dashboard" link="dashboard" />
                    <SidebarItem icon={settingsIcon} text="Settings" link="settings" />
                    <SidebarItem icon={helpIcon} text="Help" link="help" />
                </ul>
            </nav>
            <main className="dashboard-container">
                <section className="performance-overview">
                    <h2>Progress Overview</h2>
                    <div className="progress-chart">
                        <p>{progress.toFixed(0)}% Completed</p>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${progress}%`, backgroundColor: 'rgba(75, 192, 192, 0.6)' }}
                            ></div>
                        </div>
                    </div>
                    <div className="strength-weakness">
                        <div>
                            <h3>Strength</h3>
                            <p>Explanation about strengths.</p>
                        </div>
                        <div>
                            <h3>Weakness</h3>
                            <p>Explanation about weaknesses.</p>
                        </div>
                    </div>
                </section>
                <section className="pretest-score-chart">
                    <h2>Pretest Scores</h2>
                    {scores.length > 0 ? (
                        <PretestScoreChart scores={scores} />
                    ) : (
                        <p>No pretest scores available.</p>
                    )}
                </section>
                <section className="post-test-scores">
                    <h2>Post-Test Scores as Bar Charts</h2>
                    {postTestScores.length > 0 ? (
                        <PostTestScoreBarChart postTestScores={postTestScores} />
                    ) : (
                        <p>No post-test scores available.</p>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Dashboard;

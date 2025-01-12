import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Dashboard.module.css';
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
import Header from '../../Components/Header';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

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

const Dashboard = ({ isModal = false }) => {
    const [idNumber, setIdNumber] = useState(localStorage.getItem('userIdNumber') || '');
    const [data, setData] = useState(null);
    const [scores, setScores] = useState([]);
    const [postTestScores, setPostTestScores] = useState([]);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

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
        <main className={styles.Main_Dashboard}>
            {!isModal && (
                <header className="header">
                    <Header />
                </header>
            )}
            <div className={styles.Dashboardsign}>
                <h1>Dashboard</h1>
                <div className={styles.lines}></div>
            </div>
            <div className={styles.sidebar_combined}>
                <div className={styles.dashboard_container}>
                    <section className={styles.performance_overview}>
                        <div className={styles.progress_overview}>
                            <h2>Progress Overview</h2>
                            <div className={styles.progress_chart}>
                                <p>{progress.toFixed(0)}% Completed</p>
                                <div className={styles.progress_bar}>
                                    <div
                                        className={styles.progress_fill}
                                        style={{ width: `${progress}%`, backgroundColor: 'rgba(75, 192, 192, 0.6)' }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.strength_weakness}>
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
                    <section className={styles.pretest_score_chart}>
                        <h2>Pretest Scores</h2>
                        {scores.length > 0 ? (
                            <PretestScoreChart scores={scores} />
                        ) : (
                            <p>No pretest scores available.</p>
                        )}
                    </section>
                    <section className={styles.post_test_scores}>
                        <h2>Post-Test Scores as Bar Charts</h2>
                        {postTestScores.length > 0 ? (
                            <PostTestScoreBarChart postTestScores={postTestScores} />
                        ) : (
                            <p>No post-test scores available.</p>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
};

export default Dashboard;

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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

const API_URL = "http://127.0.0.1:8000";
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : "http://127.0.0.1:8000");

function DashboardModal({ student, onClose }) {
    const [dashboardData, setDashboardData] = useState({
        modules: [],
        pre_tests: [],
        post_tests: []
    });
    const [program, setProgram] = useState('');
    const [progress, setProgress] = useState(0);
    const [progressData, setProgressData] = useState(null);
    const [preTestChartData, setPreTestChartData] = useState({
        labels: [],
        datasets: [],
    });
    const [postTestChartData, setPostTestChartData] = useState({
        labels: [],
        datasets: [],
    });
    const [top3Habits, setTop3Habits] = useState([]);
    const [strengths, setStrengths] = useState([]);
    const [weaknesses, setWeaknesses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const requestHeaders = {
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

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

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const profileResponse = await axios.get(`${API_URL}/api/profile/${student.studentNo}`, {
                    headers: requestHeaders,
                });
                const userProgram = profileResponse.data.program;
                setProgram(userProgram);

                const dashboardResponse = await axios.get(`${API_URL}/api/dashboard/${student.studentNo}`, {
                    headers: requestHeaders,
                });
                const { modules, pre_tests, post_tests } = dashboardResponse.data;
                setDashboardData(dashboardResponse.data);

                const totalModules = modules.length;
                const completedPostTests = post_tests.length;
                const progressPercentage = totalModules > 0 
                    ? Math.round((completedPostTests / totalModules) * 100) 
                    : 0;
                setProgress(progressPercentage);
                setProgressData({ totalModules, completedPostTests });

                const avgTimeSpent = (pre_tests.concat(post_tests).reduce((sum, test) => sum + (test.time_spent || 0), 0) / (pre_tests.length + post_tests.length)) || 300;

                const skillCategories = {
                    'Lesson Planning': 'Instructional Skills',
                    'Curriculum Design': 'Instructional Skills',
                    'Classroom Management': 'Classroom Skills',
                    'Student Engagement': 'Classroom Skills',
                    'Critical Thinking': 'Analytical Skills',
                    'Problem Solving': 'Analytical Skills',
                    'Assessment Strategies': 'Evaluation Skills',
                    'Feedback Techniques': 'Evaluation Skills',
                    'Teaching Methods': 'Instructional Skills',
                };

                const calculateStrengthsWeaknesses = (preTests, postTests) => {
                    const categoryPerformance = {};
                    const thresholdStrength = 0.7;
                    const thresholdWeakness = 0.5;
                    const improvementThreshold = 0.2;
                    const timeEfficiencyThreshold = avgTimeSpent * 0.8;

                    const postTestMap = postTests.reduce((map, test) => {
                        map[test.post_test_title] = test;
                        return map;
                    }, {});

                    preTests.forEach((preTest) => {
                        const preScore = preTest.correct / preTest.total_questions || 0;
                        const postTest = postTestMap[preTest.pre_test_title.replace('Pre-Test', 'Post-Test')] || {};
                        const postScore = postTest.correct / postTest.total_questions || 0;
                        const avgScore = (preScore + postScore) / 2;
                        const improvement = postScore - preScore;
                        const postTimeSpent = postTest.time_spent || avgTimeSpent;

                        const skill = preTest.pre_test_title.replace('Pre-Test for ', '').replace('Module', '').trim();
                        const category = skillCategories[skill] || 'General Skills';

                        if (!categoryPerformance[category]) {
                            categoryPerformance[category] = {
                                scores: [],
                                improvements: [],
                                timeSpent: [],
                            };
                        }

                        categoryPerformance[category].scores.push(avgScore);
                        categoryPerformance[category].improvements.push(improvement);
                        categoryPerformance[category].timeSpent.push(postTimeSpent);
                    });

                    const strengths = [];
                    const weaknesses = [];

                    for (const [category, data] of Object.entries(categoryPerformance)) {
                        const avgScore = data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length;
                        const avgImprovement = data.improvements.reduce((sum, imp) => sum + imp, 0) / data.improvements.length;
                        const avgTimeSpent = data.timeSpent.reduce((sum, time) => sum + time, 0) / data.timeSpent.length;

                        if (avgScore >= thresholdStrength && avgImprovement >= improvementThreshold && avgTimeSpent <= timeEfficiencyThreshold) {
                            strengths.push(`Strong ${category} (Efficient and High-Performing)`);
                        }
                        else if (avgImprovement >= improvementThreshold && avgScore >= 0.6) {
                            strengths.push(`Adaptability in ${category}`);
                        }

                        if (avgScore < thresholdWeakness || avgImprovement < 0.1) {
                            if (avgTimeSpent > avgTimeSpent * 1.2) {
                                weaknesses.push(`Needs Improvement in ${category} (Slow Processing)`);
                            } else {
                                weaknesses.push(`Needs Improvement in ${category}`);
                            }
                        }
                    }

                    return { strengths: strengths.slice(0, 2), weaknesses: weaknesses.slice(0, 2) };
                };

                const { strengths, weaknesses } = calculateStrengthsWeaknesses(pre_tests, post_tests);
                setStrengths(strengths);
                setWeaknesses(weaknesses);

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

                const habitsResponse = await axios.get(`${API_URL}/students/${student.studentNo}/recommended-pages`, {
                    headers: requestHeaders,
                });
                setTop3Habits(habitsResponse.data.recommendedPages || []);

                setIsLoading(false);
            } catch (error) {
                const errorMessage = error.response?.data?.error || error.response?.data?.detail || 'Failed to load dashboard data.';
                console.error('Error fetching dashboard data:', errorMessage);
                setError(errorMessage);
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [student.studentNo]);

    const progressChartData = {
        labels: ['Completed', 'Remaining'],
        datasets: [
            {
                data: [progress, 100 - progress],
                backgroundColor: ['#FFD700', '#1E40AF'],
            },
        ],
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
                            <div className={Styles.FormField}>
                            </div>
                            <div className={Styles.ProgressContainer}>
                                <Doughnut
                                    data={progressChartData}
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
                        </div>
                        <div className={Styles.Section}>
                            <div className={Styles.StrengthWeaknessContainer}>
                                <div className={Styles.StrengthCard}>
                                    <h4>Strengths</h4>
                                    <ul>
                                        {strengths.length > 0 ? strengths.map((strength, index) => (
                                            <li key={index}>{strength}</li>
                                        )) : <li>No strengths identified</li>}
                                    </ul>
                                </div>
                                <div className={Styles.WeaknessCard}>
                                    <h4>Weaknesses</h4>
                                    <ul>
                                        {weaknesses.length > 0 ? weaknesses.map((weakness, index) => (
                                            <li key={index}>{weakness}</li>
                                        )) : <li>No weaknesses identified</li>}
                                    </ul>
                                </div>
                            </div>
                            <section className={Styles.StudyHabitsSection}>
                                <h3>Top 3 Study Habits</h3>
                                <div className={Styles.HabitsWrapper}>
                                    {top3Habits.length > 0 ? (
                                        top3Habits.map((habit, index) => (
                                            <div key={index} className={Styles.HabitCard}>
                                                <h4 className={Styles.HabitTitle}>{habit}</h4>
                                                <p className={Styles.HabitDescription}>Description for {habit}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No study habits identified</p>
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
                                    <p>No pre-test data available</p>
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
                                    <p>No post-test data available</p>
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

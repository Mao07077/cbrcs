import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
import Header from '../../Components/composables/Header';
import Student_Sidebar from '../../Components/Student_Sidebar';
import Footer from '../../Components/composables/Footer';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

const Dashboard = ({ isModal = false }) => {
    const navigate = useNavigate();
    const handleNavigation = (route) => {
        console.log(`Navigating to: ${route}`);
        window.location.href = `/${route}`;
    };

    const [idNumber, setIdNumber] = useState(localStorage.getItem('userIdNumber') || '');
    const [program, setProgram] = useState('');
    const [progress, setProgress] = useState(0);
    const [progressData, setProgressData] = useState(null);
    const [error, setError] = useState(null);
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

    const API_URL = "https://g28s4zdq-8000.asse.devtunnels.ms/";
    process.env.REACT_APP_API_URL ||
    (window.location.hostname === "localhost"
      ? "https://g28s4zdq-8000.asse.devtunnels.ms/"
      : "https://g28s4zdq-8000.asse.devtunnels.ms/");
    const requestHeaders = {
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    useEffect(() => {
        if (!idNumber) {
            setError('User not logged in');
            navigate('/login');
            return;
        }

        const fetchDashboardData = async () => {
            try {
                const profileResponse = await axios.get(`${API_URL}/api/profile/${idNumber}`, {
                    headers: requestHeaders,
                });
                const userProgram = profileResponse.data.program;
                console.log('User Program:', userProgram);
                setProgram(userProgram);

                const dashboardResponse = await axios.get(`${API_URL}/api/dashboard/${idNumber}`, {
                    headers: requestHeaders,
                });
                const { modules, pre_tests, post_tests } = dashboardResponse.data;
                console.log('Dashboard Modules:', modules);
                console.log('Dashboard Pre-Tests:', pre_tests);
                console.log('Dashboard Post-Tests:', post_tests);

                const totalModules = modules.length;
                const completedPostTests = post_tests.length;
                const progressPercentage = totalModules > 0 
                    ? Math.round((completedPostTests / totalModules) * 100) 
                    : 0;
                console.log('Total Modules:', totalModules);
                console.log('Completed Post-Tests:', completedPostTests);
                console.log('Calculated Progress:', progressPercentage);
                setProgress(progressPercentage);
                setProgressData({ totalModules, completedPostTests });

                // Calculate average time spent to use as a benchmark
                const avgTimeSpent = (pre_tests.concat(post_tests).reduce((sum, test) => sum + (test.time_spent || 0), 0) / (pre_tests.length + post_tests.length)) || 300;

                // Define skill categories based on module titles (manual mapping for now)
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

                // Calculate strengths and weaknesses
                const calculateStrengthsWeaknesses = (preTests, postTests) => {
                    const categoryPerformance = {};
                    const thresholdStrength = 0.7; // 70%
                    const thresholdWeakness = 0.5; // 50%
                    const improvementThreshold = 0.2; // 20%
                    const timeEfficiencyThreshold = avgTimeSpent * 0.8; // Faster than 80% of average time

                    // Map post-tests by title for easier lookup
                    const postTestMap = postTests.reduce((map, test) => {
                        map[test.post_test_title] = test;
                        return map;
                    }, {});

                    // Aggregate performance by category
                    preTests.forEach((preTest) => {
                        const preScore = preTest.correct / preTest.total_questions || 0;
                        const postTest = postTestMap[preTest.pre_test_title.replace('Pre-Test', 'Post-Test')] || {};
                        const postScore = postTest.correct / postTest.total_questions || 0;
                        const avgScore = (preScore + postScore) / 2;
                        const improvement = postScore - preScore;
                        const postTimeSpent = postTest.time_spent || avgTimeSpent;

                        // Extract the skill/topic from the module title
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

                    // Summarize performance by category
                    for (const [category, data] of Object.entries(categoryPerformance)) {
                        const avgScore = data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length;
                        const avgImprovement = data.improvements.reduce((sum, imp) => sum + imp, 0) / data.improvements.length;
                        const avgTimeSpent = data.timeSpent.reduce((sum, time) => sum + time, 0) / data.timeSpent.length;

                        // Strength: High average score, good improvement, and efficient time
                        if (avgScore >= thresholdStrength && avgImprovement >= improvementThreshold && avgTimeSpent <= timeEfficiencyThreshold) {
                            strengths.push(`Strong ${category} (Efficient and High-Performing)`);
                        }
                        // Strength: Significant improvement
                        else if (avgImprovement >= improvementThreshold && avgScore >= 0.6) {
                            strengths.push(`Adaptability in ${category}`);
                        }

                        // Weakness: Low score or little improvement
                        if (avgScore < thresholdWeakness || avgImprovement < 0.1) {
                            if (avgTimeSpent > avgTimeSpent * 1.2) {
                                weaknesses.push(`Needs Improvement in ${category} (Slow Processing)`);
                            } else {
                                weaknesses.push(`Needs Improvement in ${category}`);
                            }
                        }
                    }

                    return { strengths: strengths.slice(0, 2), weaknesses: weaknesses.slice(0, 2) }; // Limit to top 2
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
                                label: 'Pre-Test Time Spent (min)',
                                data: post_tests.map((test) => Math.floor((test.time_spent || 0) / 60)),
                                backgroundColor: 'rgba(255, 206, 86, 0.6)',
                                borderColor: 'rgba(255, 206, 86, 1)',
                                borderWidth: 1,
                            },
                        ],
                    });
                }

                const habitsResponse = await axios.get(`${API_URL}/students/${idNumber}/recommended-pages`, {
                    headers: requestHeaders,
                });
                console.log('Recommended Habits:', habitsResponse.data.recommendedPages);
                setTop3Habits(habitsResponse.data.recommendedPages || []);
            } catch (error) {
                const errorMessage = error.response?.data?.error || error.response?.data?.detail || 'Failed to fetch dashboard data';
                console.error('Error fetching dashboard data:', errorMessage);
                setError(errorMessage);
            }
        };

        fetchDashboardData();
    }, [idNumber, navigate]);

    if (error) {
        return <div className="text-red-500 text-center py-10">Error: {error}</div>;
    }

    const progressChartData = {
        labels: ['Completed', 'Remaining'],
        datasets: [
            {
                data: [progress, 100 - progress],
                backgroundColor: ['#FFD700', '#1E40AF'],
            },
        ],
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

    return (
        <div className={Styles.MainContainer}>
            <Header />
            <div className={Styles.Content_Wrapper}>
                <Student_Sidebar />
                <div className={Styles.Content}>
                    <div className={Styles.Title}>
                        <h2>Dashboard</h2>
                    </div>
                    <div className={Styles.PerformanceOverview}>
                        <h2>Performance Overview</h2>
                        <p>{progress === 0 && !error ? 'Please wait while your study progress is being updated.' : `Your progress: ${progress}%`}</p>
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
                            <h3 className="mt-6">Post-Test Performance</h3>
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
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;
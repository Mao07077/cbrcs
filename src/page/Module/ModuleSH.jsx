import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Styles from './module.module.css';
import Header from '../../Components/composables/Header';
import Footer from '../../Components/composables/FooterM';

const ModuleDashboard = () => {
    const handleNavigation = (route) => {
        console.log(`Navigating to: ${route}`);
        window.location.href = `/${route}`;
    };

    const [modules, setModules] = useState([]);
    const [error, setError] = useState(null);
    const [userProgram, setUserProgram] = useState(null);
    const navigate = useNavigate();

    const API_URL = "https://g28s4zdq-8000.asse.devtunnels.ms/";
    process.env.REACT_APP_API_URL ||
    (window.location.hostname === "localhost"
      ? "https://g28s4zdq-8000.asse.devtunnels.ms/"
      : "https://g28s4zdq-8000.asse.devtunnels.ms/");
    // Common headers for fetch requests
    const requestHeaders = {
        'ngrok-skip-browser-warning': 'true', // Bypasses ngrok warning page
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const idNumber = localStorage.getItem('userIdNumber');
                if (!idNumber) {
                    setError('User not logged in');
                    return;
                }

                const response = await fetch(`${API_URL}/api/profile/${idNumber}`, {
                    headers: requestHeaders, // Add headers here
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch user profile: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                setUserProgram(data.program || 'All Programs');
            } catch (err) {
                console.error('Error fetching user profile:', err);
                setError(err.message);
            }
        };

        fetchUserProfile();
    }, []);

    useEffect(() => {
        if (!userProgram) return;

        const apiUrl =
            userProgram === 'All Programs'
                ? `${API_URL}/api/modules`
                : `${API_URL}/api/modules?program=${encodeURIComponent(userProgram)}`;

        const fetchModules = async () => {
            try {
                const response = await fetch(apiUrl, {
                    headers: requestHeaders, // Add headers here
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch modules: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                setModules(data);
                setError(null);
            } catch (error) {
                console.error('Error fetching modules:', error);
                setError(error.message);
            }
        };

        fetchModules();
    }, [userProgram]);

    const handleProceedClick = (moduleId) => {
        navigate(`/module/${moduleId}`);
    };

    return (
        <div className={Styles.MainContainer}>
            <Header isStudyHabits={true}></Header>
            <div className={Styles.Content_Wrapper}>
                <div className={Styles.Content}>
                    <div className={Styles.ModuleDashboard}>
                        <div className={Styles.Module_Container}>
                            <h1>Modules</h1>
                            <div className={Styles.Module_Grid}>
                                {error ? (
                                    <p>{`Error: ${error}`}</p>
                                ) : modules.length > 0 ? (
                                    modules.map((module) => (
                                        <div className={Styles.ModuleCard} key={module._id}>
                                            <h3>{module.title}</h3>
                                            <div className={Styles.ModuleImage}>
                                                <img
                                                    src={`${API_URL}/${module.image_url}`}
                                                    alt="Module"
                                                    onError={() => console.error(`Failed to load image for module ${module._id}`)}
                                                />
                                            </div>
                                            <button
                                                className={Styles.ModuleProceedBtn}
                                                onClick={() => handleProceedClick(module._id)}
                                            >
                                                Proceed
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p>Please wait for the modules.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default ModuleDashboard;
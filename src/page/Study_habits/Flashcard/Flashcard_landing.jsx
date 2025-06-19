import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Styles from './Flashcardlanding_style.module.css';
import Header from '../../../Components/composables/Header';
import Footer from '../../../Components/composables/Footer';

const FlashcardsLandingPage = () => {
    const [modules, setModules] = useState([]);
    const [error, setError] = useState(null);
    const [userProgram, setUserProgram] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const API_URL = "http://127.0.0.1:8000";
    process.env.REACT_APP_API_URL ||
    (window.location.hostname === "localhost"
      ? "http://127.0.0.1:8000"
      : "http://127.0.0.1:8000");

    const requestHeaders = {
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            const idNumber = localStorage.getItem('userIdNumber');
            if (!idNumber) {
                setError('User not logged in. Please log in to continue.');
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/profile/${idNumber}`, {
                    headers: requestHeaders,
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch user profile: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                setUserProgram(data.program);
            } catch (err) {
                console.error('Error fetching user profile:', err);
                setError(err.message || 'Failed to fetch user profile');
            }
        };

        fetchUserProfile();
    }, [API_URL]);

    useEffect(() => {
        if (!userProgram) return;

        const apiUrl =
            userProgram === 'All Programs'
                ? `${API_URL}/api/modules`
                : `${API_URL}/api/modules?program=${encodeURIComponent(userProgram)}`;

        const fetchModules = async () => {
            try {
                const response = await fetch(apiUrl, {
                    headers: requestHeaders,
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch modules: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                setModules(data);
            } catch (error) {
                console.error('Error fetching modules:', error);
                setError(error.message || 'Failed to fetch modules');
            }
        };

        fetchModules();
    }, [userProgram, API_URL]);

    const handleOpenFlashcards = async (moduleId) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/api/generate-flashcards/${moduleId}`, {
                method: 'POST',
                headers: requestHeaders,
            });
            if (!response.ok) {
                throw new Error(`Failed to generate flashcards: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            if (data.flashcards) {
                navigate(`/flashcards/${moduleId}`, { state: { flashcards: data.flashcards } });
            } else {
                throw new Error(data.message || 'Failed to generate flashcards');
            }
        } catch (err) {
            console.error('Error generating flashcards:', err);
            setError(`Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={Styles.page_container}>
            <Header isStudyHabits={true}></Header>
            <div className={Styles.content_wrapper}>
                <div className={Styles.Module_Container}>
                    <h1>Flashcards Module</h1>
                    {error && <p className={Styles.error_message}>{error}</p>}
                    {isLoading && (
                        <div className={Styles.loading_container}>
                            <div className={Styles.spinner}></div>
                            <p>Generating flashcards...</p>
                        </div>
                    )}
                    <div className={Styles.Module_Grid}>
                        {modules.length > 0 ? (
                            modules.map((module) => (
                                <div className={Styles.ModuleCard} key={module._id}>
                                    <h3>{module.title}</h3>
                                    <div className={Styles.ModuleImage}>
                                        <img
                                            src={`${API_URL}/${module.image_url}`}
                                            alt={module.title}
                                            onError={(e) => (e.target.src = '/images/fallback.jpg')}
                                        />
                                    </div>
                                    <button
                                        className={Styles.ModuleProceedBtn}
                                        onClick={() => handleOpenFlashcards(module._id)}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Loading...' : 'Proceed'}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>Please wait for the modules.</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default FlashcardsLandingPage;
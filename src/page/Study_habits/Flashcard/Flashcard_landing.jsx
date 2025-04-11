import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Styles from './Flashcardlanding_style.module.css';
import Header from '../../../Components/composables/Header';
import Footer from '../../../Components/composables/Footer';

const FlashcardsLandingPage = () => {
    const [modules, setModules] = useState([]);
    const [error, setError] = useState(null);
    const [userProgram, setUserProgram] = useState(null);
    const navigate = useNavigate();

    const API_URL =
        process.env.REACT_APP_API_URL ||
        (window.location.hostname === 'localhost'
            ? 'http://127.0.0.1:8000'
            : 'https://cbrcs.onrender.com');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const idNumber = localStorage.getItem('userIdNumber');
                if (!idNumber) {
                    setError('User not logged in');
                    return;
                }

                const response = await fetch(`${API_URL}/api/profile/${idNumber}`);
                if (!response.ok) throw new Error('Failed to fetch user profile');

                const data = await response.json();
                setUserProgram(data.program);
            } catch (err) {
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

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                setModules(data);
            })
            .catch(error => setError(error.message));
    }, [userProgram, API_URL]);

	const handleOpenFlashcards = async (moduleId) => {
		try {
			const res = await fetch(`${API_URL}/api/generate-flashcards/${moduleId}`, {
				method: 'POST',
			});
			const data = await res.json();
	
			if (res.ok) {
				navigate(`/flashcards/${moduleId}`, { state: { flashcards: data.flashcards } });
			} else {
				setError(data.message || 'Failed to generate flashcards');
			}
		} catch (err) {
			setError('Error generating flashcards. Please try again.');
		}
	};
    return (
        <div className={Styles.page_container}>
            <Header />
            <div className={Styles.content_wrapper}>
                <div className={Styles.module_container}>
                    <h2>Flashcards Module</h2>
                    {error && <p className={Styles.error_message}>{`Error: ${error}`}</p>}
                    <p>Select a module to review its flashcards.</p>
                    <div className={Styles.module_grid}>
                        {modules.length > 0 ? (
                            modules.map((module) => (
                                <div className={Styles.module_card} key={module._id}>
                                    <h3>{module.title}</h3>
                                    <img
                                        src={`${API_URL}${module.image_url}`}
                                        alt="Module"
                                        className={Styles.module_image}
                                    />
                                    <button
                                        className={Styles.flashcard_btn}
                                        onClick={() => handleOpenFlashcards(module._id)}
                                    >
                                        Proceed
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No modules available</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default FlashcardsLandingPage;
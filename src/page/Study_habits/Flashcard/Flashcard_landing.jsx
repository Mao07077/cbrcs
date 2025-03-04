import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Styles from "./Flashcardlanding_style.module.css";
import Header from '../../../Components/Header';

const FlashcardsLandingPage = () => {
    const [modules, setModules] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const userIdNumber = localStorage.getItem("userIdNumber") || "All IDs";

    useEffect(() => {
        fetch("http://localhost:8000/api/modules")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => setModules(data))
            .catch((error) => setError(error.message));
    }, []);

    const handleProceedClick = (moduleId) => {
        navigate(`/flashcards/${moduleId}`);
    };

    const filteredModules = modules.filter((module) => module.id_number === userIdNumber);

    return (
        
                 
        <div className={Styles.page_container}>
            <Header />
            <div className={Styles.module_container}>
                <h1 className={Styles.module_title}>Flashcards Modules</h1>
                <p className={Styles.module_description}>Select a module to review its flashcards.</p>
                <div className={Styles.module_grid}>
                    {error ? (
                        <p>{`Error: ${error}`}</p>
                    ) : filteredModules.length > 0 ? (
                        filteredModules.map((module) => (
                            <div className={Styles.module_card} key={module._id}>
                                <h3>{module.title}</h3>
                                <p>Click below to study flashcards for this module.</p>
                                <button className={Styles.proceed_btn} onClick={() => handleProceedClick(module._id)}>View Flashcards</button>
                            </div>
                        ))
                    ) : (
                        <p>No modules available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FlashcardsLandingPage;

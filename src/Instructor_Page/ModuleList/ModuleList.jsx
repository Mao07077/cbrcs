import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Styles from "./Module.module.css"; // Correct import for CSS Module
import InstructorHeader from "../../Components/Instructor_Header";

const ModuleList = () => {
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
        navigate(`/module/${moduleId}`);
    };

    const filteredModules = modules.filter((module) => module.id_number === userIdNumber);

    return (
        <div className={Styles.pageContainer}>
            <InstructorHeader />
            <div className={Styles.moduleContainer}>
                <h2 className={Styles.sectionTitle}>Your Top 3 Study Habits:</h2>
                <div className={Styles.habitsContainer}>
                    <div className={Styles.habitCard}><h3>Study With Friends</h3><p>Description Here</p></div>
                    <div className={Styles.habitCard}><h3>Listen To Music</h3><p>Description Here</p></div>
                    <div className={Styles.habitCard}><h3>Asking For Help</h3><p>Description Here</p></div>
                </div>
                <h1 className={Styles.moduleTitle}>Modules</h1>
                <div className={Styles.moduleGrid}>
                    {error ? (
                        <p>{`Error: ${error}`}</p>
                    ) : filteredModules.length > 0 ? (
                        filteredModules.map((module) => (
                            <div className={Styles.moduleCard} key={module._id}>
                                <h3>{module.title}</h3>
                                <p>Topic here</p>
                                <div className={Styles.moduleImage}>Image here</div>
                                <button className={Styles.proceedBtn} onClick={() => handleProceedClick(module._id)}>Proceed</button>
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

export default ModuleList;

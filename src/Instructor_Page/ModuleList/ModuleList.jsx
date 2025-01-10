import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Styles from "./Module.module.css";
import InstructorHeader from '../../Components/Instructor_Header';

const ModuleList = () => {
    const [modules, setModules] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const userIdNumber = localStorage.getItem('userIdNumber') || 'All IDs';

    useEffect(() => {
        fetch('http://localhost:8000/api/modules')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return response.json();
                } else {
                    throw new Error("Expected JSON but received non-JSON response");
                }
            })
            .then((data) => setModules(data))
            .catch((error) => setError(error.message));
    }, []);

    const handleProceedClick = (moduleId) => {
        navigate(`/module/${moduleId}`);
    };

    const filteredModules = modules.filter(module => module.id_number === userIdNumber);

    return (
        <div>
            <header className="header">
                <InstructorHeader />
            </header>
            <div className={Styles.Module_Container}>

                <div className={Styles.Notheader}>
                    <h1>Modules</h1>
                </div>
                
                 
                <div className="user-id-number">
                    <p>Current ID Number: {userIdNumber}</p>
                </div>
                <div className={Styles.Module_Grid}>
                    {error ? (
                        <p>{`Error: ${error}`}</p>
                    ) : filteredModules.length > 0 ? (
                        filteredModules.map((module) => (
                            <div className="module" key={module._id}>
                                <h3>{module.title}</h3>
                                <img src={`http://localhost:8000/${module.image_url}`} alt="Module" />
                                <br />
                                <button className="proceed-btn" onClick={() => handleProceedClick(module._id)}>
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
    );
};

export default ModuleList;

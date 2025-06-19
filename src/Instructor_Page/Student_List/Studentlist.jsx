import React, { useState, useEffect } from 'react';
import Styles from './StudentTable.module.css';
import axios from 'axios';
import DashboardModal from '../../page/Dashboard/DashboradModal.jsx';
import Header from '../../Components/composables/Header';
import Instructor_Sidebar from '../../Components/Instructor_Sidebar';
import Footer from '../../Components/composables/Footer';

const API_URL = "http://127.0.0.1:8000";
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : "http://127.0.0.1:8000");
function StudentTable() {
    const [searchQuery, setSearchQuery] = useState('');
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`${API_URL}/students`)
            .then((response) => {
                const mappedStudents = response.data.map((student) => ({
                    studentNo: student.studentNo,
                    name: student.name,
                    profile: student.profile,
                    program: student.program,
                }));
                setStudents(mappedStudents);
            })
            .catch((error) => {
                console.error('There was an error fetching the students!', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const filteredStudents = students.filter(
        (student) =>
            student.studentNo.includes(searchQuery) ||
            student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleViewDashboard = (student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedStudent(null);
    };

    return (
        <div className={Styles.Maincontainer}>
            <Header />
            <div className={Styles.Content_Wrapper}>
                <Instructor_Sidebar />
                <div className={Styles.Content}>
                    <div className={Styles.Greeting_Studentlist}>
                        <h1>Students List</h1>
                    </div>
                    <h2>Search:</h2>
                    <div className={Styles.Input}>
                        <input
                            type="text"
                            placeholder="Student No. or Name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={Styles.Search_Input}
                        />
                    </div>
                    {isLoading ? (
                        <p>Loading students...</p>
                    ) : (
                        <table className={Styles.Table}>
                            <thead>
                                <tr>
                                    <th>Profile</th>
                                    <th>Student No.</th>
                                    <th>Student Name</th>
                                    <th>Program</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((student, index) => (
                                        <tr key={index}>
                                            <td className="Center">{student.profile}</td>
                                            <td>{student.studentNo}</td>
                                            <td>{student.name}</td>
                                            <td>{student.program}</td>
                                            <td>
                                                <button
                                                    className="view-dashboard-btn"
                                                    onClick={() => handleViewDashboard(student)}
                                                >
                                                    View Dashboard
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className={Styles.No_Students}>
                                            No students found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
                {isModalOpen && selectedStudent && (
                    <DashboardModal student={selectedStudent} onClose={closeModal} />
                )}
            </div>
            <Footer />
        </div>
    );
}

export default StudentTable;
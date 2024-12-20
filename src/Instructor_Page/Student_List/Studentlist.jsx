import React, { useState, useEffect } from "react";
import Styles from "./StudentTable.module.css"; 
import InstructorHeader from "../../Components/Instructor_Header";
import axios from 'axios';
import DashboardModal from '../../page/Dashboard/DashboradModal';
 
function StudentTable() {
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [students, setStudents] = useState([]); // Student list
  const [selectedStudent, setSelectedStudent] = useState(null); // Selected student for the dashboard modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state

  useEffect(() => {
    // Fetch students from the backend
    axios
      .get("http://localhost:8000/students")
      .then((response) => {
        // Map backend response to frontend structure
        const mappedStudents = response.data.map((student) => ({
          studentNo: student.studentNo,
          name: student.name,
          profile: student.profile,
          program: student.program,
        }));
        setStudents(mappedStudents);
      })
      .catch((error) => {
        console.error("There was an error fetching the students!", error);
      });
  }, []);

  // Filter students based on search query
  const filteredStudents = students.filter(
    (student) =>
      student.studentNo.includes(searchQuery) ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDashboard = (student) => {
    setSelectedStudent(student.studentNo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  return (
    <>
      {/* Header */}
      <header className="header">
        <InstructorHeader />
      </header>

      {/* Main Content */}
      <div className={Styles.List_Container}>
        {/* Greeting */}
        <div className="greeting-studentlist">
          <h1>Students List</h1>
        </div>

        {/* Student List */}
        <div className="container">
          <h2>Search:</h2>
          <input
            type="text"
            placeholder="Student No. or Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <table className="table">
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
                    <td className="center">{student.profile}</td>
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
                  <td colSpan="5" className="no-students">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dashboard Modal */}
      {isModalOpen && (
        <DashboardModal
          studentId={selectedStudent}
          onClose={closeModal}
        />
      )}
    </>
  );
}

export default StudentTable;

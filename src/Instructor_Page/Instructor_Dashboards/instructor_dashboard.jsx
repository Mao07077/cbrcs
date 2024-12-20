import React, { useState, useEffect } from 'react';
import './InstructorDashboard.css';
import { useNavigate } from "react-router-dom";
import Modal from 'react-modal';
import InstructorHeader from '../../Components/Instructor_Header';
import CreateModule from '../Create_module/Create_module';
 

const InstructorDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    engagementRate: 0,
  });
  // const navigate = useNavigate();
  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchStats = async () => {
      const mockStats = {
        totalStudents: 40,
        engagementRate: 50,
      };
      setTimeout(() => {
        setStats(mockStats);
      }, 1000);
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const simulateBackendFetch = async () => {
      return new Promise((resolve) =>
        setTimeout(() => resolve([70, 50, 90, 60, 40]), 1000)
      );
    };

    const fetchAttendanceData = async () => {
      const data = await simulateBackendFetch();
      setAttendanceData(data);
    };

    fetchAttendanceData();
  }, []);

  return (
    <div className="dashboard-container">
      <header className="header">
        <InstructorHeader />
      </header>

      <div className="greeting-dashboard">
        <h1>Dashboard</h1>
      </div>

      <div className="statistics-container">
        <div className="stat-card">
          <h1>Total Number of Students</h1>
          <h2>{stats.totalStudents || 'Loading...'}</h2>
        </div>
        <div className="stat-card">
          <h1>Student Engagement Rate</h1>
          <h2>{stats.engagementRate ? `${stats.engagementRate}%` : 'Loading...'}</h2>
        </div>
      </div>

      <div className="Create-module">
        <button onClick={handleCreate} type="button">Create Module</button>
      </div>

      <div className="content-container">
        <div className="student-attendance">
          <h2>Student Attendance</h2>
          <div className="graph">
            {attendanceData.length > 0 ? (
              attendanceData.map((value, index) => (
                <div
                  key={index}
                  className="bar"
                  style={{
                    height: `${value}%`,
                    transition: 'height 0.5s ease-in-out',
                  }}
                  title={`Attendance: ${value}%`}
                ></div>
              ))
            ) : (
              <p>Loading attendance data...</p>
            )}
          </div>
        </div>

         
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Create Module"
        className="modal"
        overlayClassName="overlay"
      >
        <CreateModule />
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default InstructorDashboard;

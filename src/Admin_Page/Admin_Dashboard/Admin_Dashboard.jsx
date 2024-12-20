import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import style from './Admin_Dashboard.module.css'
import AdminHeader from '../../Components/Admin_Header';

const InstructorDashboard = () => {
  const [fileName, setFileName] = useState('No file chosen');
  const [isDragging, setIsDragging] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]); // State for attendance data
  const [stats, setStats] = useState({
    totalStudents: 0,
    engagementRate: 0,
  });

  // Simulating an API call for stats
  useEffect(() => {
    const fetchStats = async () => {
      // Simulate an API response with mock data
      const mockStats = {
        totalStudents: 40, // Example number of students
        engagementRate: 50, // Example engagement rate
      };
      // Simulate loading delay
      setTimeout(() => {
        setStats(mockStats);
      }, 1000);
    };

    fetchStats();
  }, []);

  // Simulate fetching attendance data
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
        <AdminHeader />
      </header>
      {/* Greeting */}
      <div className="greeting-dashboard">
        <h1>Admin's Dashboard</h1>
      </div>

      {/* Sidebar */}

      {/* Statistics Section */}
      <div className="Main_insdashboard">
        <div className="statistics-container">
          <div className="stat-card">
            <h1>Total Number of Students</h1>
            <h2>{stats.totalStudents || 'Loading...'}</h2>
          </div>
          <div className="stat-card">
            <h1> Number of Instructor/per season</h1>
            <h2>{stats.totalStudents || 'Loading...'}</h2>
          </div>
          <div className="stat-card">
            <h1>number of Enrolled course's/per season</h1>
            <h2>{stats.engagementRate ? `${stats.engagementRate}%` : 'Loading...'}</h2>
          </div>
        </div>

        {/* Content Section */}
        <div className="content-container">
          {/* Student Attendance */}
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
      </div>
    </div>
  );
};

export default InstructorDashboard;

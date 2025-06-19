import React, { useState, useEffect } from 'react';
import Styles from './InstructorDashboard.module.css';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import Header from '../../Components/composables/Header';
import Instructor_Sidebar from '../../Components/Instructor_Sidebar';
import Footer from '../../Components/composables/Footer';
import CreateModule from '../Create_module/Create_module';
import axios from 'axios'; // Add axios for API calls

const InstructorDashboard = () => {
  const navigate = useNavigate();

  const handleNavigation = (route) => {
    console.log(`Navigating to: ${route}`);
    navigate(`/${route}`);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [modules, setModules] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    engagementRate: 0, // Keep as 0 since no backend logic provided
  });
  const [isCreateModuleOpen, setIsCreateModuleOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Added for loading state

  // Fetch stats and modules from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch total students
        const studentsResponse = await axios.get('http://127.0.0.1:8000/students');
        const totalStudents = studentsResponse.data.length;

        setStats({
          totalStudents,
          engagementRate: 0, // Keep as 0 or fetch from a new endpoint if available
        });

        // Fetch modules
        const modulesResponse = await axios.get('http://127.0.0.1:8000/api/modules');
        setModules(modulesResponse.data);

        // Keep hardcoded attendance data as requested
        const mockAttendance = await new Promise((resolve) =>
          setTimeout(() => resolve([70, 50, 90, 60, 40]), 1000)
        );
        setAttendanceData(mockAttendance);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStats({ totalStudents: 'Error', engagementRate: 0 });
        setModules([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className={Styles.MainContainer}>
      <Header />
      <div className={Styles.Content_Wrapper}>
        <Instructor_Sidebar />
        <div className={Styles.Content}>
          <div className={Styles.Greeting_Dashboard}>
            <h1>Instructor Dashboard</h1>
          </div>

          <div className={Styles.Statistics_Container}>
            <div className={Styles.Stat_Card}>
              <h1>Total Number of Students</h1>
              <h2>{isLoading ? 'Loading...' : stats.totalStudents}</h2>
            </div>
            <div className={Styles.Stat_Card}>
              <h1>Student Engagement Rate</h1>
              <h2>{isLoading ? 'Loading...' : `${stats.engagementRate}%`}</h2>
            </div>
          </div>

          <div className={Styles.Create_Module}>
            <div className={Styles.AnnouncementBox}>
              <div className={Styles.AnnouncementActions}>
                <button
                  className={Styles.CreateModuleButton}
                  onClick={() => setIsCreateModuleOpen(true)}
                >
                  Create Module
                </button>
                <button
                  className={Styles.CreateModuleButton}
                  onClick={() => handleNavigation('CreatePostTest')}
                >
                  Create Posttest
                </button>
              </div>
            </div>
          </div>

          <div className={Styles.Content_Container}>
            <div className={Styles.Student_Attendance}>
              <h2>Student Attendance</h2>
              <div className={Styles.Graph}>
                {attendanceData.length > 0 ? (
                  attendanceData.map((value, index) => (
                    <div
                      key={index}
                      className={Styles.Bar}
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

            <div className={Styles.Modules_List}>
              <h2>My Modules</h2>
              {isLoading ? (
                <p>Loading modules...</p>
              ) : modules.length > 0 ? (
                modules.map((module) => (
                  <div key={module._id} className={Styles.Module}>
                    {module.title}
                  </div>
                ))
              ) : (
                <p>No modules found</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Modal for Create Module */}
      <Modal
        isOpen={isCreateModuleOpen}
        onRequestClose={() => setIsCreateModuleOpen(false)}
        className={Styles.CreateModuleModal}
        overlayClassName={Styles.ModalOverlay}
      >
        <CreateModule onClose={() => setIsCreateModuleOpen(false)} />
      </Modal>
    </div>
  );
};

export default InstructorDashboard;
import React, { useState, useEffect } from 'react';
import Styles from './InstructorDashboard.module.css';
import { useNavigate } from "react-router-dom";
import Modal from 'react-modal';
import CreateModule from '../Create_module/Create_module';
import Dashboard from '../../icon/dashboard.png'; 
import MailIcon from '../../icon/Mail.png';
import StudentsIcon from '../../icon/Students.png';
import Icon from '../../icon/actual.png';

 
const SidebarItem = ({ icon, text, onClick }) => (
  <li>
    <button className="sidebar-item" onClick={onClick}>
      <img src={icon} alt={text} className="sidebar-icon" />
      <span>{text}</span>
    </button>
  </li>
);

const InstructorDashboard = () => {
  const handleNavigation = (route) => {
    console.log(`Navigating to: ${route}`);
  
    window.location.href = `/${route}`;
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    engagementRate: 0,
  });
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
    <div className={Styles.Maincontainer}>
  <div className={Styles.Header}> 
    <div className="header-content">
        <div className="header-logo">
            <img src={Icon} alt="logo" />
        </div>
        
    </div></div>
  <nav className={Styles.Menu}> 
    <ul>
      <li>
        <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('Instructor_Dashboard')}>
          <img src={Dashboard} alt="Dashboard Icon" className={Styles.Sidebar_Icon} />
          <span>Dashboard</span>
        </buttonss>
      </li>
      <li>
        <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('mail')}>
          <img src={MailIcon} alt="Mail Icon" className={Styles.Sidebar_Icon} />
          <span>Message</span>
        </buttonss>
      </li>
      <li>
        <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('studentlist')}>
          <img src={StudentsIcon} alt="Students Icon" className={Styles.Sidebar_Icon} />
          <span>StudentList</span>
        </buttonss>
      </li>
      <li>
        <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('ModuleList')}>
          <img src={StudentsIcon} alt="Students Icon" className={Styles.Sidebar_Icon} />
          <span>Module</span>
        </buttonss>
      </li>
    </ul>
   </nav>
  <div className={Styles.Content}>
    <div className={Styles.Greeting_Dashboard}>
        <h1>Instructor Dashboard</h1>
      </div>

    <div className={Styles.Statistics_Container}>
        <div className={Styles.Stat_Card}>
          <h1>Total Number of Students</h1>
          <h2>{stats.totalStudents || 'Loading...'}</h2>
        </div>
        <div className={Styles.Stat_Card}>
          <h1>Student Engagement Rate</h1>
          <h2>{stats.engagementRate ? `${stats.engagementRate}%` : 'Loading...'}</h2>
        </div>
      </div>

      <div className={Styles.Create_Module}>
        <buttons onClick={handleCreate} type="button">Create Module</buttons>
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

         
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Create Module"
        className={Styles.Modal}
        overlayClassName="overlay"
      >
        <CreateModule />
        <button onClick={closeModal}>Close</button>
      </Modal>
</div>
</div>
  );
};

export default InstructorDashboard;

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
    <button className={Styles.Sidebar_Item} onClick={onClick}>
      <img src={icon} alt={text} className={Styles.Sidebar_Icon} />
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
  const [modules, setModules] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    engagementRate: 0,
  });

  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const mockStats = {
        totalStudents: 0, 
        engagementRate: 0, 
      };
      setTimeout(() => {
        setStats(mockStats);
      }, 1000);
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      const data = await new Promise((resolve) =>
        setTimeout(() => resolve([70, 50, 90, 60, 40]), 1000)
      );
      setAttendanceData(data);
    };
    fetchAttendanceData();
  }, []);

  useEffect(() => {
    const fetchModules = async () => {
      const mockModules = ["Module 1", "Module 2", "Module 3"];
      setTimeout(() => {
        setModules(mockModules);
      }, 1000);
    };
    fetchModules();
  }, []);

  return (
    <div className={Styles.Maincontainer}>
      <div className={Styles.Header}> 
        <div className="header-content">
          <div className="header-logo">
            <img src={Icon} alt="logo" />
          </div>
        </div>
      </div>
      

      <nav className={Styles.Menu}> 
        <ul>
          <SidebarItem icon={Dashboard} text="Dashboard" onClick={() => handleNavigation('Instructor_Dashboard')} />
          <SidebarItem icon={MailIcon} text="Message" onClick={() => handleNavigation('Message')} />
          <SidebarItem icon={StudentsIcon} text="StudentList" onClick={() => handleNavigation('studentlist')} />
          <SidebarItem icon={StudentsIcon} text="Module" onClick={() => handleNavigation('ModuleList')} />
        </ul>
      </nav>

      <div className={Styles.Content}>
        <div className={Styles.Greeting_Dashboard}>
          <h1>Instructor Dashboard</h1>
        </div>

        <div className={Styles.Statistics_Container}>
          <div className={Styles.Stat_Card}>
            <h1>Total Number of Students</h1>
            <h2>{stats.totalStudents}</h2>
          </div>
          <div className={Styles.Stat_Card}>
            <h1>Student Engagement Rate</h1>
            <h2>{stats.engagementRate}%</h2>
          </div>
        </div>

        <div className={Styles.Create_Module}>
          <div className={Styles.AnnouncementBox}>
            <div className={Styles.AnnouncementInput}>
              <input type="text" placeholder="Post announcement here" className={Styles.InputField} />
            </div>
            <hr className={Styles.Divider} />
            <div className={Styles.AnnouncementActions}>
              <input type="file" id="fileInput" style={{ display: "none" }} onChange={(e) => setSelectedFile(e.target.files[0])} />
              <button className={Styles.AttachFile} onClick={() => document.getElementById("fileInput").click()}>
                + Attach file
              </button>
              {selectedFile && <span className={Styles.FileName}>{selectedFile.name}</span>}
              <button className={Styles.PostButton}>Post</button>
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
                    style={{ height: `${value}%`, transition: 'height 0.5s ease-in-out' }}
                    title={`Attendance: ${value}%`}
                  ></div>
                ))
              ) : (
                <p>Loading attendance data...</p>
              )}
            </div>
          </div>

          <div className={Styles.Modules_List}>
            <h2>Module\Course Name</h2>
            {modules.length > 0 ? (
              modules.map((module, index) => (
                <div key={index} className={Styles.Module}>
                  {module}
                </div>
              ))
            ) : (
              <p>Loading modules...</p>
            )}
          </div>
        </div>
      
      </div>
{/* dalawang footer for sidebar at content */}
  <footer className={Styles.Footer}>
  </footer>
  <footer className={Styles.Footer}>
        <img src={Icon} alt="CBRC Logo" />
        <p>&copy; 2024 Dr. Carl Balita Review Center. All Rights Reserved.</p>
  </footer>
  
    </div>
  );
};

export default InstructorDashboard;

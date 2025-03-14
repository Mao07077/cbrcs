import React, { useState, useEffect } from "react";
import Styles from "./StudentTable.module.css";
import InstructorHeader from "../../Components/Instructor_Header";
import axios from "axios";
import DashboardModal from "../../page/Dashboard/DashboradModal";
import Dashboard from '../../icon/dashboard.png'; 
import MailIcon from '../../icon/Mail.png';
import StudentsIcon from '../../icon/Students.png';
import Icon from '../../icon/actual.png';



function StudentTable() {
  const [searchQuery, setSearchQuery] = useState(""); 
  const [students, setStudents] = useState([]); 
  const [selectedStudent, setSelectedStudent] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isLoading, setIsLoading] = useState(true); 

    const handleNavigation = (route) => {
      console.log(`Navigating to: ${route}`);
    
      window.location.href = `/${route}`;
    };

  useEffect(() => {
    axios
      .get("http://localhost:8000/students")
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
        console.error("There was an error fetching the students!", error);
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
  const SidebarItem = ({ icon, text, onClick }) => (
    <li>
      <button className="sidebar-item" onClick={onClick}>
        <img src={icon} alt={text} className="sidebar-icon" />
        <span>{text}</span>
      </button>
    </li>
  );
  
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
          <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('Message')}>
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
    <div className={Styles.Greeting_Studentlist}>
          <h1>Students List</h1>
        </div>

          <h2>Search:</h2>
          <input
            type="text"
            placeholder="Student No. or Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={Styles.Search_Input}
          />
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
                        <buttons
                          className="view-dashboard-btn"
                          onClick={() => handleViewDashboard(student)}
                        >
                          View Dashboard
                        </buttons>  
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
      

  );
}

export default StudentTable;

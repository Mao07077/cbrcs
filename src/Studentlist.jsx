import React,{ useState } from "react";
import "./StudentTable.css"; 
import { Link } from "react-router-dom";
import HomeIcon from './icon/Home.png';
import MailIcon from './icon/Mail.png';
import StudentsIcon from './icon/Students.png';
import ReportsIcon from './icon/Reports.png';
import SettingsIcon from './icon/settings.png';
import logoIcon from './icon/logo.png';

function StudentTable() {
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [students] = useState([
    { profile: "👤", studentNo: "20231001", name: "John Doe", program: "Computer Science" },
    { profile: "👤", studentNo: "20231002", name: "Jane Smith", program: "Information Technology" },
    { profile: "👤", studentNo: "20231003", name: "Mark Lee", program: "Software Engineering" },
    { profile: "👤", studentNo: "20231004", name: "Emily Davis", program: "Data Science" },
    { profile: "👤", studentNo: "20231005", name: "Chris Brown", program: "Cybersecurity" },
  ]);

  const filteredStudents = students.filter(
    (student) =>
      student.studentNo.includes(searchQuery) ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Header */}
      <header className="header">
  <div className="header-content">
    <div className="header-logo">
      <img src={logoIcon} alt="logo" />
    </div>
  </div>
</header>

      {/* Main Content */}
      <div className="List-container">
        {/* Greeting */}
        <div className="greeting-studentlist">
          <h1>Students List</h1>
        </div>

        {/* Sidebar */}
        <nav className="sidebar">
          <ul>
            <li>
              <img src={HomeIcon} alt="Home icon" className="sidebar-icon" />
              <Link to="/">Home</Link>
            </li>
            <li>
              <img src={MailIcon} alt="Mail icon" className="sidebar-icon" />
              <Link to="/mail">Mail</Link>
            </li>
            <li>
              <img src={StudentsIcon} alt="Students icon" className="sidebar-icon" />
              <Link to="/Studentlist">Students</Link>
            </li>
            <li>
              <img src={ReportsIcon} alt="Reports icon" className="sidebar-icon" />
              <Link to="/reports">Reports</Link>
            </li>
            <li>
              <img src={SettingsIcon} alt="Settings icon" className="sidebar-icon" />
              <Link to="/settings">Settings</Link>
            </li>
          </ul>
        </nav>

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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-students">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default StudentTable;
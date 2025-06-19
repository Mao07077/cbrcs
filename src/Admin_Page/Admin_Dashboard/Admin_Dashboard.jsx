import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Styles from './Admin_Dashboard.module.css';
import Admin_Sidebar from '../../Components/Admin_Sidebar';
import Footer from '../../Components/composables/FooterAdmin';
import Header from '../../Components/composables/Header';
import axios from 'axios'; // Add axios for API calls

const AdminDashboard = () => {
  const [fileName, setFileName] = useState('No file chosen');
  const [isDragging, setIsDragging] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInstructors: 0, // Updated to include instructors
  });
  const [students, setStudents] = useState([]); // State for student list
  const [instructors, setInstructors] = useState([]); // State for instructor list

  const navigate = useNavigate();

  const redirectToAdminPost = () => {
    navigate('/Adminpost');
  };

  // Fetch stats and lists from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch total accounts (students and instructors)
        const accountsResponse = await axios.get('https://g28s4zdq-8000.asse.devtunnels.ms//api/accounts');
        const accounts = accountsResponse.data.accounts;

        // Calculate total students and instructors
        const totalStudents = accounts.filter(acc => acc.role.toLowerCase() === 'student').length;
        const totalInstructors = accounts.filter(acc => acc.role.toLowerCase() === 'instructor').length;

        setStats({
          totalStudents,
          totalInstructors,
        });

        // Fetch student list
        const studentsResponse = await axios.get('https://g28s4zdq-8000.asse.devtunnels.ms//students');
        setStudents(studentsResponse.data);

        // Fetch instructor list
        const instructorsResponse = await axios.get('https://g28s4zdq-8000.asse.devtunnels.ms//instructors');
        setInstructors(instructorsResponse.data);

        // Fetch attendance data (if you have an endpoint for this)
        // Example: Replace with actual endpoint if available
        const attendanceResponse = await axios.get('https://g28s4zdq-8000.asse.devtunnels.ms//api/attendance'); // Hypothetical endpoint
        setAttendanceData(attendanceResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStats({ totalStudents: 'Error', totalInstructors: 'Error' });
        setStudents([]);
        setInstructors([]);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className={Styles.Maincontainer}>
      <Header />
      <div className={Styles.Content_Wrapper}>
        <Admin_Sidebar />
        <div className={Styles.Content}>
          <div className={Styles.Greeting_Dashboard}>
            <h1>Admin Dashboard</h1>
          </div>
          <button className={Styles.Redirect_Button} onClick={redirectToAdminPost}>
            Admin Post
          </button>
          <div className={Styles.Statistics_Container}>
            <div className={Styles.Stat_Card}>
              <h1>Total Number of Students</h1>
              <h2>{stats.totalStudents || 'Loading...'}</h2>
            </div>
            <div className={Styles.Stat_Card}>
              <h1>Total Number of Instructors</h1>
              <h2>{stats.totalInstructors || 'Loading...'}</h2>
            </div>
          </div>
          <div className={Styles.List_Students}>
            <div className={Styles.Student}>
              <h2>List of Students</h2>
              <ul>
                {students.length > 0 ? (
                  students.map(student => (
                    <li key={student.studentNo}>
                      {student.name} ({student.studentNo}) - {student.program}
                    </li>
                  ))
                ) : (
                  <li>No students found</li>
                )}
              </ul>
            </div>
            <div className={Styles.Instructor}>
              <h2>List of Instructors</h2>
              <ul>
                {instructors.length > 0 ? (
                  instructors.map(instructor => (
                    <li key={instructor.id_number}>
                      {instructor.firstname} {instructor.lastname} ({instructor.id_number})
                    </li>
                  ))
                ) : (
                  <li>No instructors found</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Styles from './profile.module.css';
import nameIcon from '../../icon/name.png';
import Icon from '../../icon/actual.png';
import NameIcon from '../../icon/name.png';
import ModuleIcon from '../../icon/module.png';
import DashboardIcon from '../../icon/dashboard.png';
import RequestIcon from '../../icon/request.png';
import HelpIcon from '../../icon/help.png';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const SidebarItem = ({ icon, text, onClick }) => (
  <li>
    <button className="sidebar-item" onClick={onClick}>
      <img src={icon} alt={text} className="sidebar-icon" />
      <span>{text}</span>
    </button>
  </li>
);
const DailyActivityBarChart = ({ dailyData }) => {
  
  const data = {
    labels: dailyData.map(item => item.day),
    datasets: [
      {
        label: 'Daily Study Hours',
        data: dailyData.map(item => item.hours),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hours',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Day',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return <Bar data={data} options={options} />;
};

const Profile = () => {
  const handleNavigation = (route) => {
    console.log(`Navigating to: ${route}`);
  
    window.location.href = `/${route}`;
  };
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState(nameIcon);

  const [dailyData, setDailyData] = useState([
    { day: 'Monday', hours: 2 },
    { day: 'Tuesday', hours: 3 },
    { day: 'Wednesday', hours: 4 },
    { day: 'Thursday', hours: 1.5 },
    { day: 'Friday', hours: 2.5 },
    { day: 'Saturday', hours: 3 },
    { day: 'Sunday', hours: 4 },
  ]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const idNumber = localStorage.getItem("userIdNumber");
        if (!idNumber) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:8000/api/profile/${idNumber}`);
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
     <div className={Styles.MainContainer}>
                <div className={Styles.Header}> 
                     <div className="header-content">
                         <div className="header-logo">
                             <img src={Icon} alt="logo" />
                         </div>
                         </div>
                     </div>
                  <nav className={Styles.Menu}> 
                      <ul>
                        <li>
                          <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('profile')}>
                            <img src={NameIcon} alt="Name Icon" className={Styles.Sidebar_Icon} />
                            <span>Profile</span>
                          </buttonss>
                        </li>
                        <li>
                          <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('module')}>
                            <img src={ModuleIcon} alt="Module Icon" className={Styles.Sidebar_Icon} />
                            <span>Module</span>
                          </buttonss>
                        </li>
                        <li>
                          <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('dashboard')}>
                            <img src={DashboardIcon} alt="Dashboard Icon" className={Styles.Sidebar_Icon} />
                            <span>Dashboard</span>
                          </buttonss>
                        </li>
                        <li>
                          <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('Request')}>
                            <img src={HelpIcon} alt="help Icon" className={Styles.Sidebar_Icon} />
                            <span>Study Habits</span>
                          </buttonss>
                        </li>
                        <li>
                          <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('settings')}>
                            <img src={RequestIcon} alt="Request Icon" className={Styles.Sidebar_Icon} />
                            <span>Request</span>
                          </buttonss>
                        </li>
                       
                      </ul>
                     </nav>
    <div className={Styles.Content}>
      
      <div className={Styles.TopSection}>
        <h2>Account Profile</h2>
      
      </div>

      {/* Profile Icon with Upload */}
      <div className={Styles.Pair}>
  <div className={Styles.IconContainer}>
    <img src={profileImage} alt="Profile Icon" />
    <input
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      style={{ display: 'none' }}
      id="profileImageUpload"
    />
    <button
      className={Styles.editButton}
      onClick={() => document.getElementById('profileImageUpload').click()}
    >
      Edit
    </button>
  </div>

  <div className={Styles.InfoCard}>
    <label>Name: {profile?.firstname} {profile?.lastname}</label>
    <label>Age: {profile?.age || "N/A"}</label>
    <label>Id Number: {profile?.id_number}</label>
    <label>Program: {profile?.program}</label>
    <div className={Styles.DateInfo}>
      <p>Date Started and End Date</p>
      <p>09/20/2004 - 03/12/2025</p>
    </div>
  </div>
</div>

      <div className={Styles.HabitsWrapper}>
  <h3 className={Styles.StudyTitle}>Your Top 3 Study Habits</h3>
  <div className={Styles.HabitCard} onClick={() => handleNavigation('/group-call')}>
    <h4 className={Styles.HabitTitle}>Learn Together</h4>
    <p className={Styles.HabitDescription}>Group Call</p>
  </div>
  <div className={Styles.HabitCard} onClick={() => handleNavigation('/scheduler')}>
    <h4 className={Styles.HabitTitle}>Scheduler</h4>
    <p className={Styles.HabitDescription}>Create your own schedule</p>
  </div>
  <div className={Styles.HabitCard} onClick={() => handleNavigation('/instructor-chat')}>
    <h4 className={Styles.HabitTitle}>Instructor Chat</h4>
    <p className={Styles.HabitDescription}>Seek guidance from teachers</p>
  </div>
</div>



      {/* Daily Activity Bar Chart */}
      <div className={Styles.chartSection}>
        <h3>Daily Activity</h3>
        <DailyActivityBarChart dailyData={dailyData} />
      </div>
    </div>
    </div>
  );
};

export default Profile;

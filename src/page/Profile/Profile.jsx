import React, { useEffect, useState } from 'react';
import Styles from './profile.module.css';

import nameIcon from '../../icon/name.png';
import Header from '../../Components/Header';

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
    <div className={Styles.profilePage}>
      <Header />

      <div className={Styles.topSection}>
        <h2>Account Profile</h2>
        <div className={Styles.dateInfo}>
          <p>Date Started and End Date</p>
          <p>09/20/2004 - 03/12/2025</p>
        </div>
      </div>

      {/* Profile Icon with Upload */}
      <div className={Styles.iconContainer}>
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

      {/* Personal Info */}
      <div className={Styles.infoCard}>
        <label>Name: {profile?.firstname} {profile?.lastname}</label>
        <label>Age: {profile?.age || "N/A"}</label>
        <label>Id Number: {profile?.id_number}</label>
        <label>Program: {profile?.program}</label>
      </div>

      {/* Study Habits */}
      <h3 className={Styles.studyTitle}>Your Top 3 Study Habits:</h3>
      <div className={Styles.habitsWrapper}>
        <div className={Styles.habitCard}>
          <h4>Study With Friends</h4>
          <p>Description Here</p>
        </div>
        <div className={Styles.habitCard}>
          <h4>Listen To Music</h4>
          <p>Description Here</p>
        </div>
        <div className={Styles.habitCard}>
          <h4>Asking For Help</h4>
          <p>Description Here</p>
        </div>
      </div>

      {/* Daily Activity Bar Chart */}
      <div className={Styles.chartSection}>
        <h3>Daily Activity</h3>
        <DailyActivityBarChart dailyData={dailyData} />
      </div>
    </div>
  );
};

export default Profile;

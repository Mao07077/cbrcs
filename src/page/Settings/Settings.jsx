import React, { useState, useEffect } from "react";
import "./settings.css";
import Header from "../../Components/Header";
const Settings = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    suffix: "",
    birthdate: "",
    email: "",
    program: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const idNumber = localStorage.getItem("userIdNumber"); // Get user ID from localStorage
      try {
        const response = await fetch(`http://localhost:8000/user/settings/${idNumber}`);
        const result = await response.json();
        if (result.success) {
          setFormData({
            firstname: result.data.firstname || "",
            middlename: result.data.middlename || "",
            lastname: result.data.lastname || "",
            suffix: result.data.suffix || "",
            birthdate: result.data.birthdate || "",
            email: result.data.email || "",
            program: result.data.program || "",
            username: result.data.username || "",
            password: "", // Don't prefill the password for security reasons
          });
        } else {
          alert("Failed to load user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Error loading user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmed = window.confirm("Are you sure you want to send the request to the admin?");
    if (confirmed) {
      const idNumber = localStorage.getItem("userIdNumber");
      try {
        const response = await fetch(`http://localhost:8000/user/settings/request/${idNumber}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),  // Send the entire formData as the body
        });
        const result = await response.json();
        if (result.success) {
          setRequestSent(true);
        } else {
          alert(`Error: ${result.detail}`);
        }
      } catch (error) {
        console.error("Error sending request:", error);
        alert("Error sending request");
      }
    }
  };
  

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <header className="header">
        <Header />
      </header>
      <div className="settings-container">
        <div className="settings-section">
          {requestSent ? (
            <div className="request-sent-message">
              Your request has been sent to the admin.
            </div>
          ) : (
            <>
              <div className="sec-box">
                <h2>General</h2>
                <div className="row">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstname"
                    placeholder="Enter first name"
                    value={formData.firstname}
                    onChange={handleChange}
                  />
                </div>
                <div className="row">
                  <label>Middle Name</label>
                  <input
                    type="text"
                    name="middlename"
                    placeholder="Enter middle name"
                    value={formData.middlename}
                    onChange={handleChange}
                  />
                </div>
                <div className="row">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastname"
                    placeholder="Enter last name"
                    value={formData.lastname}
                    onChange={handleChange}
                  />
                </div>
                <div className="row">
                  <label>Suffix</label>
                  <input
                    type="text"
                    name="suffix"
                    placeholder="Enter suffix"
                    value={formData.suffix}
                    onChange={handleChange}
                  />
                </div>
                <div className="row">
                  <label>Birthdate</label>
                  <input
                    type="text"
                    name="birthdate"
                    placeholder="Enter birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                  />
                </div>
                <div className="row">
                  <label>Email</label>
                  <input
                    type="text"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="row">
                  <label>Program</label>
                  <input
                    type="text"
                    name="program"
                    placeholder="Enter program"
                    value={formData.program}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="sec-box">
                <h2>Login Info</h2>
                <div className="row">
                  <label>Username</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="row">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="submit-button-container">
                <button type="submit" className="submit-button" onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
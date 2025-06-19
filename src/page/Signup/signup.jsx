import React, { useState } from 'react'; 
import axios from 'axios';
import './signup.css';
import Icon from '../../icon/actual.png';

const API_URL = "http://127.0.0.1:8000";
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : "http://127.0.0.1:8000");
const Signup = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        middlename: '',
        lastname: '',
        suffix: '',
        birthdate: '',
        gender: '',
        email: '',
        password: '',
        program: '',
        id_number: '',
        role: ''
    });

    const [error, setError] = useState('');

    // Common headers for axios requests
    const requestHeaders = {
        'ngrok-skip-browser-warning': 'true', // Bypasses ngrok warning page
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        console.log("Submitting signup data:", formData);
        try {
            const response = await axios.post(`${API_URL}/api/signup`, formData, {
                headers: requestHeaders, // Add headers here
            });
            console.log("Signup response:", response.data);
            if (response.data.success) {
                window.location.href = '/login';
            } else {
                setError(response.data.message || 'Signup failed.');
            }
        } catch (error) {
            console.error('Signup error:', error.response?.data || error.message);
            setError(error.response?.data?.detail || 'An error occurred during signup.');
        }
    };

    return (
        <div>
            <header className="header">
                <div className="header-content">
                    <div className="header-logo">
                        <img src={Icon} alt="actual" />
                    </div>
                </div>
            </header>

            <div className="Signup-container">
                <h2>Sign-Up</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="layer1">
                        <input type="text" name="firstname" placeholder="First Name" value={formData.firstname} onChange={handleChange} required />
                        <input type="text" name="middlename" placeholder="Middle Name" value={formData.middlename} onChange={handleChange} />
                        <input type="text" name="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleChange} required />
                        <input type="text" name="suffix" placeholder="Suffix" value={formData.suffix} onChange={handleChange} />
                    </div>
                    <div className="layer2">
                        <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} required />
                        <div className="gender">
                            <label>Gender:</label>
                            <label><input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} required /> Male</label>
                            <label><input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} required /> Female</label>
                        </div>
                        <input type="email" name="email" placeholder="E-Mail" value={formData.email} onChange={handleChange} required />
                        <select className="styled-select" name="role" value={formData.role} onChange={handleChange} required>
                            <option value="">Select Role</option>
                            <option value="Instructor">Instructor</option>
                            <option value="Student">Student</option>
                        </select>
                    </div>
                    <div className="layer3">
                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                        <input type="number" name="id_number" placeholder="ID Number" value={formData.id_number} onChange={handleChange} required />
                        {formData.role === 'Student' && (
                            <select className="styled-select" name="program" value={formData.program} onChange={handleChange} required>
                                <option value="">Select Program</option>
                                <option value="LET">LET</option>
                                <option value="Nursing">Nursing</option>
                                <option value="Civil Service">Civil Service</option>
                                <option value="OET">OET</option>
                                <option value="UPCAT">UPCAT</option>
                            </select>
                        )}
                    </div>
                    <div className="layer4">
                        <a href="/login">Already have an account</a>
                        <input type="submit" name="submit" value="Submit" />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
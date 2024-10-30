import React, { useState } from 'react';
import axios from 'axios';

const CreateUser = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        suffix: '',
        birthdate: '',
        gender: '',
        email: '',
        password: '',
        program: '',
        idNumber: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/createUser', formData);
            if (response.data.success) {
                alert('Successfully created');
                window.location.href = '/thesis/login';
            } else {
                alert('Error occurred: ' + response.data.message);
            }
        } catch (error) {
            alert('Error occurred: ' + error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
            <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} placeholder="Middle Name" />
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
            <input type="text" name="suffix" value={formData.suffix} onChange={handleChange} placeholder="Suffix" />
            <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} placeholder="Birthdate" />
            <input type="text" name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
            <input type="text" name="program" value={formData.program} onChange={handleChange} placeholder="Program" />
            <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} placeholder="ID Number" />
            <button type="submit" name="submit">Submit</button>
        </form>
    );
};

export default CreateUser;

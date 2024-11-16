import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
        const userId = localStorage.getItem('userIdNumber');

        if (!userId) {
            setError('User not logged in');
            navigate('/login');
            return;
        }

        fetch(`/api/profile/${userId}`)
            .then(response => response.json())
            .then(data => setUser(data))
            .catch(() => {
                setError('Error fetching profile data');
            });
    }, [navigate]);

    const handleLogout = () => {
        // Remove user ID from localStorage
        localStorage.removeItem('userIdNumber');

        // Redirect to login page
        navigate('/login');
    };

    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {user ? (
                <div>
                    <h2>Welcome, {user.firstname} {user.lastname}</h2>
                    <p>ID Number: {user.id_number}</p>
                    <p>Program: {user.program}</p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Profile;

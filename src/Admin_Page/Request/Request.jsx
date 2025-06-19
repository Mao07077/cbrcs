import React, { useState, useEffect } from 'react';
import AdminHeader from '../../Components/Admin_Header';
import Styles from './Request.module.css';
import Admin_Sidebar from '../../Components/Admin_Sidebar';
import Footer from '../../Components/composables/FooterAdmin';
import Header from '../../Components/composables/Header';

const API_URL = "http://127.0.0.1:8000";
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : "http://127.0.0.1:8000");
const Request = () => {
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [error, setError] = useState('');

    // Common headers for all fetch requests
    const requestHeaders = {
        'ngrok-skip-browser-warning': 'true', // Bypasses ngrok warning page
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    const handleNavigation = (route) => {
        console.log(`Navigating to: ${route}`);
        window.location.href = `/${route}`;
    };

    const fetchRequests = async () => {
        try {
            const response = await fetch(`${API_URL}/admin/requests`, {
                method: 'GET',
                headers: requestHeaders, // Add headers here
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch requests: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            if (result.success) {
                setRequests(result.data);
                setError('');
            } else {
                throw new Error(`Failed to fetch requests: ${result.detail || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
            setError(error.message);
            setRequests([]);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleView = (index) => {
        setSelectedRequest(requests[index]);
        setShowPopup(true);
    };

    const handleAccept = async () => {
        if (!selectedRequest) return;
        try {
            const response = await fetch(`${API_URL}/admin/requests/accept/${selectedRequest._id}`, {
                method: 'POST',
                headers: requestHeaders, // Add headers here
                body: JSON.stringify(selectedRequest.update_data),
            });

            if (!response.ok) {
                throw new Error(`Failed to accept request: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            if (result.success) {
                alert('Request accepted and changes applied!');
                setRequests(requests.filter((req) => req._id !== selectedRequest._id));
                setShowPopup(false);
                setError('');
            } else {
                throw new Error(`Failed to accept request: ${result.detail || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error accepting request:', error);
            setError(error.message);
            alert('Failed to apply changes.');
        }
    };

    const handleDecline = async () => {
        if (!selectedRequest) return;
        try {
            const response = await fetch(`${API_URL}/admin/requests/decline/${selectedRequest._id}`, {
                method: 'DELETE',
                headers: requestHeaders, // Add headers here
            });

            if (!response.ok) {
                throw new Error(`Failed to decline request: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            if (result.success) {
                alert('Request declined.');
                setRequests(requests.filter((req) => req._id !== selectedRequest._id));
                setShowPopup(false);
                setError('');
            } else {
                throw new Error(`Failed to decline request: ${result.detail || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error declining request:', error);
            setError(error.message);
            alert('Failed to decline request.');
        }
    };

    return (
        <div className={Styles.Maincontainer}>
            <Header />
            <div className={Styles.Content_Wrapper}>
                <Admin_Sidebar />
                <div className={Styles.Content}>
                    <div className={Styles.Greeting_Dashboard}>
                        <h1>Request List</h1>
                    </div>
                    {error && <p className={Styles.ErrorMessage}>{error}</p>}
                    <div className={Styles.Container}>
                        <table className={Styles.Table}>
                            <thead>
                                <tr>
                                    <th>Account No.</th>
                                    <th>Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.length > 0 ? (
                                    requests.map((request, index) => (
                                        <tr key={index}>
                                            <td>{request.id_number}</td>
                                            <td>{`${request.firstname} ${request.lastname}`}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleView(index)}
                                                    className={Styles.ViewButton}
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className={Styles.No_Requests}>
                                            No requests found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {showPopup && selectedRequest && (
                    <div className={Styles.PopupOverlay}>
                        <div className={Styles.PopupContent}>
                            <h2>Request Details</h2>
                            <p><strong>Account No:</strong> {selectedRequest.id_number}</p>
                            <p><strong>Current Name:</strong> {`${selectedRequest.firstname} ${selectedRequest.lastname}`}</p>
                            <p><strong>Requested First Name:</strong> {selectedRequest.update_data.firstname}</p>
                            <p><strong>Requested Last Name:</strong> {selectedRequest.update_data.lastname}</p>
                            <p><strong>Current Program:</strong> {selectedRequest.program}</p>
                            <p><strong>Requested Program:</strong> {selectedRequest.update_data.program}</p>

                            <div className={Styles.PopupActions}>
                                <button onClick={handleAccept} className={Styles.AcceptButton}>Accept</button>
                                <button onClick={handleDecline} className={Styles.DeclineButton}>Decline</button>
                                <button onClick={() => setShowPopup(false)} className={Styles.CloseButton}>Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Request;
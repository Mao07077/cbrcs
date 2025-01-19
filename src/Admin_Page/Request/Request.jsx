import React, { useState, useEffect } from "react";
import AdminHeader from '../../Components/Admin_Header';
import Styles from "./Request.module.css";

function Request() {
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);

    const fetchRequests = async () => {
        try {
            const response = await fetch("http://localhost:8000/admin/requests");
            const result = await response.json();
            if (result.success) {
                setRequests(result.data);
            } else {
                console.error("Failed to fetch requests:", result.detail);
            }
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleView = (index) => {
        console.log("Viewing request at index:", index);
        setSelectedRequest(requests[index]);
        setShowPopup(true); 
    };

    const handleAccept = async () => {
        if (!selectedRequest) return;
        console.log("Accepting request:", selectedRequest);
        try {
            const response = await fetch(`http://localhost:8000/admin/requests/accept/${selectedRequest._id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedRequest.update_data),
            });
            const result = await response.json();
            if (result.success) {
                alert("Request accepted and changes applied!");
                setSelectedRequest(null);
                setShowPopup(false); 
                fetchRequests();
            } else {
                alert("Failed to apply changes.");
            }
        } catch (error) {
            console.error("Error accepting request:", error);
        }
    };

    const handleDecline = async () => {
        if (!selectedRequest) return;
        console.log("Declining request:", selectedRequest);
        try {
            const response = await fetch(`http://localhost:8000/admin/requests/decline/${selectedRequest._id}`, {
                method: "DELETE",
            });
            const result = await response.json();
            if (result.success) {
                alert("Request declined.");
                setSelectedRequest(null);
                setShowPopup(false); 
                fetchRequests(); 
            } else {
                alert("Failed to decline request.");
            }
        } catch (error) {
            console.error("Error declining request:", error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <header className="header">
                <AdminHeader />
            </header>
            <div className={Styles.List_Container}>
                <div className={Styles.Greeting_Requestlist}>
                    <h1>Requests List</h1>
                </div>

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
                                            <button onClick={() => handleView(index)} className="view-button">
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
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Request Details</h2>
                        <p>
                            <strong>Account No:</strong> {selectedRequest.id_number}
                        </p>
                        <p>
                            <strong>Current Name:</strong> {`${selectedRequest.firstname} ${selectedRequest.lastname}`}
                        </p>
                        <p>
                            <strong>Requested First Name:</strong> {selectedRequest.update_data.firstname}
                        </p>
                        <p>
                            <strong>Requested Last Name:</strong> {selectedRequest.update_data.lastname}
                        </p>
                        <p>
                            <strong>Current Program:</strong> {selectedRequest.program}
                        </p>
                        <p>
                            <strong>Requested Program:</strong> {selectedRequest.update_data.program}
                        </p>
                        <div className="popup-actions">
                            <button onClick={handleAccept} className="accept-button">
                                Accept
                            </button>
                            <button onClick={handleDecline} className="decline-button">
                                Decline
                            </button>
                            <button onClick={() => setShowPopup(false)} className="close-button">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Request;

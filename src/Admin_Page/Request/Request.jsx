import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../icon/Admin_Header";

function Request() {
    const [requests, setRequests] = useState([
        { profile: "👤", accountNo: "20231001", name: "John Doe", program: "Computer Science", requestedChanges: { name: "Johnathan Doe", program: "Software Engineering" } },
        { profile: "👤", accountNo: "20231002", name: "Jane Smith", program: "Information Technology", requestedChanges: { name: "Jane A. Smith", program: "Data Science" } },
    ]);
    const navigate = useNavigate();

    const handleView = (index) => {
        // Implement the view functionality here
        console.log("View request at index:", index);
    };

    return (
        <>
            {/* Header */}
            <header className="header">
                <AdminHeader />
            </header>

            {/* Main Content */}
            <div className="List-container">
                {/* Greeting */}
                <div className="greeting-requestlist">
                    <h1>Requests List</h1>
                </div>

                {/* Request List */}
                <div className="container">
                    <table className="table">
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
                                        <td>{request.accountNo}</td>
                                        <td>{request.name}</td>
                                        <td>
                                            <button onClick={() => handleView(index)} className="view-button">View</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="no-requests">
                                        No requests found.
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

export default Request;

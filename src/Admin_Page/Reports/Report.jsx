import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Styles from './Report.module.css';
import Header from '../../Components/composables/Header';
import Admin_Sidebar from '../../Components/Admin_Sidebar';
import Footer from '../../Components/composables/FooterAdmin';

const API_URL = "http://127.0.0.1:8000";
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : "http://127.0.0.1:8000");
const Reports = () => {
    const [reports, setReports] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [error, setError] = useState('');
    const [selectedReport, setSelectedReport] = useState(null);

    // Common headers for all axios requests
    const requestHeaders = {
        'ngrok-skip-browser-warning': 'true', // Bypasses ngrok warning page
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    // Fetch reports from backend
    const fetchReports = async (searchQuery = '', status = 'All') => {
        try {
            const query = new URLSearchParams();
            if (searchQuery) query.append('search', searchQuery);
            if (status !== 'All') query.append('status', status);

            const response = await axios.get(`${API_URL}/api/reports?${query.toString()}`, {
                headers: requestHeaders, // Add headers here
            });
            setReports(response.data);
            setError('');
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'An error occurred while fetching reports';
            setError(errorMessage);
            console.error('Error fetching reports:', err);
        }
    };

    // Initial fetch and re-fetch on search/filter change
    useEffect(() => {
        fetchReports(search, statusFilter);
    }, [search, statusFilter]);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    // Handle status filter change
    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
    };

    // Handle status update (delete report when resolved)
    const handleStatusUpdate = async (reportId) => {
        try {
            await axios.delete(`${API_URL}/api/reports/${reportId}`, {
                headers: requestHeaders, // Add headers here
            });
            fetchReports(search, statusFilter); // Refresh reports
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'An error occurred while resolving report';
            setError(errorMessage);
            console.error('Error resolving report:', err);
        }
    };

    // Handle view report details (open modal)
    const handleViewReport = (report) => {
        setSelectedReport(report);
    };

    // Close modal
    const closeModal = () => {
        setSelectedReport(null);
    };

    return (
        <div className={Styles.Maincontainer}>
            <Header />
            <div className={Styles.Content_Wrapper}>
                <Admin_Sidebar />
                <div className={Styles.Content}>
                    <div className={Styles.Greeting_Dashboard}>
                        <h1>Report</h1>
                    </div>
                    {error && <p className={Styles.ErrorMessage}>{error}</p>}
                    <div className={Styles.ReportSearchFilter}>
                        <div className={Styles.ReportSearchContainer}>
                            <label className={Styles.ReportLabel}>Search: </label>
                            <input
                                type="text"
                                placeholder="Search..."
                                className={Styles.ReportSearchInput}
                                value={search}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div className={Styles.ReportFilterContainer}>
                            <label className={Styles.ReportLabel}>Filter by Status: </label>
                            <select
                                className={Styles.ReportFilterDropdown}
                                value={statusFilter}
                                onChange={handleStatusChange}
                            >
                                <option value="All">All</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                        </div>
                    </div>
                    <div className={Styles.ReportTableContainer}>
                        <table className={Styles.ReportTable}>
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Issue</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map((report) => (
                                    <tr key={report.id}>
                                        <td>{report.student}</td>
                                        <td>{report.issue}</td>
                                        <td>{report.date}</td>
                                        <td
                                            className={`${Styles.ReportStatus} ${
                                                Styles[report.status.replace(' ', '')]
                                            }`}
                                        >
                                            {report.status}
                                        </td>
                                        <td>
                                            <button
                                                className={Styles.ReportViewButton}
                                                onClick={() => handleViewReport(report)}
                                            >
                                                View
                                            </button>
                                            <button
                                                className={Styles.ReportResolveButton}
                                                onClick={() => handleStatusUpdate(report.id)}
                                            >
                                                Resolve
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {selectedReport && (
                        <div className={Styles.Modal}>
                            <div className={Styles.ModalContent}>
                                <h2>{selectedReport.issue}</h2>
                                <p><strong>Content:</strong> {selectedReport.content}</p>
                                {selectedReport.screenshot ? (
                                    <div className={Styles.ModalImageContainer}>
                                        <img
                                            src={`${API_URL}/${selectedReport.screenshot}`}
                                            alt="Report Screenshot"
                                            className={Styles.ModalImage}
                                        />
                                    </div>
                                ) : (
                                    <p>No screenshot available</p>
                                )}
                                <button
                                    className={Styles.ModalCloseButton}
                                    onClick={closeModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Reports;
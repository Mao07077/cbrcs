import React, { useState } from "react";
import "./Accounts.css";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../icon/Admin_Header";

function Accounts() {
    const [searchQuery, setSearchQuery] = useState(""); // Search query
    const [programFilter, setProgramFilter] = useState(""); // Program filter
    const [accounts, setAccounts] = useState([
        { profile: "👤", accountNo: "20231001", name: "John Doe", program: "Computer Science" },
        { profile: "👤", accountNo: "20231002", name: "Jane Smith", program: "Information Technology" },
        { profile: "👤", accountNo: "20231003", name: "Mark Lee", program: "Software Engineering" },
        { profile: "👤", accountNo: "20231004", name: "Emily Davis", program: "Data Science" },
        { profile: "👤", accountNo: "20231005", name: "Chris Brown", program: "Cybersecurity" },
    ]);
    const [sortOrder, setSortOrder] = useState("asc");
    const navigate = useNavigate();

    const filteredAccounts = accounts.filter(
        (account) =>
            (account.accountNo.includes(searchQuery) ||
            account.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
            account.program.toLowerCase().includes(programFilter.toLowerCase())
    );

    const handleCreate = () => {
        navigate("/signup");
    };



    const handleDelete = (index) => {
        const updatedAccounts = accounts.filter((_, i) => i !== index);
        setAccounts(updatedAccounts);
    };

    const handleSort = (key) => {
        const sortedAccounts = [...accounts].sort((a, b) => {
            if (sortOrder === "asc") {
                return a[key] > b[key] ? 1 : -1;
            } else {
                return a[key] < b[key] ? 1 : -1;
            }
        });
        setAccounts(sortedAccounts);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
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
                <div className="greeting-accountlist">
                    <h1>Accounts List</h1>
                </div>

                {/* Sidebar */}

                {/* Account List */}
                <div className="container">
                    <h2>Search:</h2>
                    <input
                        type="text"
                        placeholder="Account No. or Name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <h2>Filter by Program:</h2>
                    <input
                        type="text"
                        placeholder="Program"
                        value={programFilter}
                        onChange={(e) => setProgramFilter(e.target.value)}
                        className="filter-input"
                    />
                    <button onClick={handleCreate} className="create-button">Create Account</button>
                    <table className="table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort("profile")}>Profile</th>
                                <th onClick={() => handleSort("accountNo")}>Account No.</th>
                                <th onClick={() => handleSort("name")}>Account Name</th>
                                <th onClick={() => handleSort("program")}>Program</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAccounts.length > 0 ? (
                                filteredAccounts.map((account, index) => (
                                    <tr key={index}>
                                        <td className="center">{account.profile}</td>
                                        <td>{account.accountNo}</td>
                                        <td>{account.name}</td>
                                        <td>{account.program}</td>
                                        <td>
                                            <button onClick={() => handleDelete(index)} className="delete-button">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="no-accounts">
                                        No accounts found.
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

export default Accounts;

import React, { useState, useEffect } from "react";
import Styles from "./Accounts.module.css";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../Components/Admin_Header";

function Accounts() {
    const [searchQuery, setSearchQuery] = useState(""); // Search query
    const [roleFilter, setRoleFilter] = useState(""); // Role filter
    const [accounts, setAccounts] = useState([]);
    const [sortOrder, setSortOrder] = useState("asc");
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch accounts data from API
        const fetchAccounts = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/accounts"); // FastAPI endpoint
                if (!response.ok) {
                    throw new Error("Failed to fetch accounts");
                }
                const data = await response.json();
                setAccounts(data);
            } catch (error) {
                console.error("Error fetching accounts data:", error);
            }
        };

        fetchAccounts();
    }, []);

    const filteredAccounts = accounts.filter(
        (account) =>
            (account.accountNo.includes(searchQuery) ||
                account.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
            account.role.toLowerCase().includes(roleFilter.toLowerCase())
    );

    const handleCreate = () => {
        navigate("/signup");
    };

    const handleDelete = async (index) => {
        const accountToDelete = accounts[index];
        try {
            const response = await fetch(`http://localhost:8000/api/accounts/${accountToDelete.id}`, { method: "DELETE" });
            if (!response.ok) {
                throw new Error("Failed to delete account");
            }
            const updatedAccounts = accounts.filter((_, i) => i !== index);
            setAccounts(updatedAccounts);
        } catch (error) {
            console.error("Error deleting account:", error);
        }
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
            <div className={Styles.List_Container}>
                {/* Greeting */}
                <div className="greeting-accountlist">
                    <h1>Accounts List</h1>
                </div>

                {/* Account List */}
                <div className={Styles.Container}>
                    <h2>Search:</h2>
                    <input
                        type="text"
                        placeholder="Account No. or Name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <h2>Filter by Role:</h2>
                    <input
                        type="text"
                        placeholder="Role"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="filter-input"
                    />
                    <button onClick={handleCreate} className="create-button">Create Account</button>
                    <table className="table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort("profile")}>Profile</th>
                                <th onClick={() => handleSort("accountNo")}>Account No.</th>
                                <th onClick={() => handleSort("name")}>Account Name</th>
                                <th onClick={() => handleSort("role")}>Role</th>
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
                                        <td>{account.role}</td>
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

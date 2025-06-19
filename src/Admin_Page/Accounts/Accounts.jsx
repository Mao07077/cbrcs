import React, { useState, useEffect } from 'react';
import Styles from './Accounts.module.css';
import { useNavigate } from 'react-router-dom';
import Admin_Sidebar from '../../Components/Admin_Sidebar';
import Footer from '../../Components/composables/FooterAdmin';
import Header from '../../Components/composables/Header';

const API_URL = "https://g28s4zdq-8000.asse.devtunnels.ms/";
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "https://g28s4zdq-8000.asse.devtunnels.ms/"
    : "https://g28s4zdq-8000.asse.devtunnels.ms/");
function Accounts() {
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Common headers for all fetch requests
    const requestHeaders = {
        'ngrok-skip-browser-warning': 'true', // Bypasses ngrok warning page
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await fetch(`${API_URL}/api/accounts`, {
                    method: 'GET',
                    headers: requestHeaders, // Add headers here
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch accounts: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                console.log('Raw API response:', JSON.stringify(data, null, 2));
                const fetchedAccounts = Array.isArray(data.accounts) ? data.accounts : [];
                console.log('Processed accounts:', JSON.stringify(fetchedAccounts, null, 2));
                setAccounts(fetchedAccounts);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching accounts data:', error);
                setError(error.message);
                setAccounts([]);
                setLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    const filteredAccounts = accounts.filter(
        (account) => {
            const matchesSearch = (
                (account.accountNo && account.accountNo.includes(searchQuery)) ||
                (account.name && account.name.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            const matchesRole = roleFilter ? account.role.toLowerCase() === roleFilter.toLowerCase() : true;
            return matchesSearch && matchesRole;
        }
    );

    const handleCreate = () => {
        navigate('/signup');
    };

    const handleArchive = async (index) => {
        const accountToArchive = filteredAccounts[index];
        try {
            const response = await fetch(
                `${API_URL}/api/accounts/${accountToArchive.accountNo}/archive`,
                {
                    method: 'POST',
                    headers: requestHeaders, // Add headers here
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to archive account: ${response.status} ${response.statusText}`);
            }

            setAccounts(accounts.filter((acc) => acc.accountNo !== accountToArchive.accountNo));
        } catch (error) {
            console.error('Error archiving account:', error);
            setError(error.message);
        }
    };

    const handleSort = (key) => {
        const sortedAccounts = [...accounts].sort((a, b) => {
            const aValue = a[key] || '';
            const bValue = b[key] || '';
            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
        setAccounts(sortedAccounts);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    if (loading) {
        return (
            <div className={Styles.Maincontainer}>
                <Header />
                <div className={Styles.Content_Wrapper}>
                    <Admin_Sidebar />
                    <div className={Styles.Content}>
                        <div className={Styles.Greeting_Accountlist}>
                            <h1>Accounts List</h1>
                        </div>
                        <p>Loading accounts...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className={Styles.Maincontainer}>
                <Header />
                <div className={Styles.Content_Wrapper}>
                    <Admin_Sidebar />
                    <div className={Styles.Content}>
                        <div className={Styles.Greeting_Accountlist}>
                            <h1>Accounts List</h1>
                        </div>
                        <p>Error: {error}</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className={Styles.Maincontainer}>
            <Header />
            <div className={Styles.Content_Wrapper}>
                <Admin_Sidebar />
                <div className={Styles.Content}>
                    <div className={Styles.Greeting_Accountlist}>
                        <h1>Accounts List</h1>
                    </div>

                    <div className={Styles.Filter_Section}>
                        <div className={Styles.Search_Container}>
                            <h2>Search:</h2>
                            <input
                                type="text"
                                placeholder="Account No. or Name"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={Styles.Search_Input}
                            />
                        </div>

                        <div className={Styles.Role_Container}>
                            <h2>Filter by Role:</h2>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className={Styles.Role_Dropdown}
                            >
                                <option value="">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="student">Student</option>
                                <option value="instructor">Instructor</option>
                            </select>
                        </div>

                        <button onClick={handleCreate} className={Styles.Create_Button}>
                            Create Account
                        </button>
                    </div>

                    <table className={Styles.Table}>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('profile')}>
                                    Profile {sortOrder === 'asc' ? '↑' : '↓'}
                                </th>
                                <th onClick={() => handleSort('accountNo')}>
                                    Account No. {sortOrder === 'asc' ? '↑' : '↓'}
                                </th>
                                <th onClick={() => handleSort('name')}>
                                    Account Name {sortOrder === 'asc' ? '↑' : '↓'}
                                </th>
                                <th onClick={() => handleSort('role')}>
                                    Role {sortOrder === 'asc' ? '↑' : '↓'}
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAccounts.length > 0 ? (
                                filteredAccounts.map((account, index) => {
                                    console.log(`Rendering account ${index}:`, account);
                                    return (
                                        <tr key={account.accountNo}>
                                            <td className="center">
                                                {account.profile || 'N/A'}
                                            </td>
                                            <td>{account.accountNo}</td>
                                            <td className={Styles.NameCell}>
                                                {account.name || 'Unknown'}
                                            </td>
                                            <td>{account.role}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleArchive(index)}
                                                    className={Styles.Delete_Button}
                                                >
                                                    Archive
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className={Styles.No_Accounts}>
                                        <p>No accounts found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Accounts;
import React, { useState, useEffect } from 'react';
import Styles from './Accounts.module.css';
import { useNavigate } from 'react-router-dom';
import Admin_Sidebar from '../../Components/Admin_Sidebar';
import Footer from '../../Components/composables/FooterAdmin';
import Header from '../../Components/composables/Header';

const API_URL = process.env.REACT_APP_API_URL || 
    (window.location.hostname === "localhost" ? "http://127.0.0.1:8000" : "https://cbrcs.onrender.com");

function Accounts() {
	const [searchQuery, setSearchQuery] = useState('');
	const [roleFilter, setRoleFilter] = useState('');
	const [accounts, setAccounts] = useState([]);
	const [sortOrder, setSortOrder] = useState('asc');
	const navigate = useNavigate();

	useEffect(() => {
		const fetchAccounts = async () => {
			try {
				const response = await fetch(`${API_URL}/api/accounts`);
				if (!response.ok) {
					throw new Error('Failed to fetch accounts');
				}
				const data = await response.json();
				setAccounts(data);
			} catch (error) {
				console.error('Error fetching accounts data:', error);
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
		navigate('/signup');
	};

	const handleDelete = async (index) => {
		const accountToDelete = accounts[index];
		try {
			const response = await fetch(
				`${API_URL}/api/accounts/${accountToDelete.id}`,
				{ method: 'DELETE' }
			);
			if (!response.ok) {
				throw new Error('Failed to delete account');
			}
			const updatedAccounts = accounts.filter((_, i) => i !== index);
			setAccounts(updatedAccounts);
		} catch (error) {
			console.error('Error deleting account:', error);
		}
	};

	const handleSort = (key) => {
		const sortedAccounts = [...accounts].sort((a, b) => {
			if (sortOrder === 'asc') {
				return a[key] > b[key] ? 1 : -1;
			} else {
				return a[key] < b[key] ? 1 : -1;
			}
		});
		setAccounts(sortedAccounts);
		setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
	};

	return (
		<div className={Styles.Maincontainer}>
			<Header></Header>
			<div className={Styles.Content_Wrapper}>
				<Admin_Sidebar></Admin_Sidebar>
				<div className={Styles.Content}>
					<div className={Styles.Greeting_Accountlist}>
						<h1>Accounts List</h1>
					</div>

					{/* Filters Section */}
					<div className={Styles.Filter_Section}>
						{/* Search Bar */}
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

						{/* Role Filter Dropdown */}
						<div className={Styles.Role_Container}>
							<h2>Filter by Role:</h2>
							<select
								value={roleFilter}
								onChange={(e) => setRoleFilter(e.target.value)}
								className={Styles.Role_Dropdown}
							>
								<option value="">Select Role</option>
								<option value="Instructor">Instructor</option>
								<option value="Student">Student</option>
							</select>
						</div>

						{/* Create Account Button */}
						<button onClick={handleCreate} className={Styles.Create_Button}>
							Create Account
						</button>
					</div>
					{/* Table Section */}
					<table className={Styles.Table}>
						<thead>
							<tr>
								<th onClick={() => handleSort('profile')}>Profile</th>
								<th onClick={() => handleSort('accountNo')}>Account No.</th>
								<th onClick={() => handleSort('name')}>Account Name</th>
								<th onClick={() => handleSort('role')}>Role</th>
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
											<button
												onClick={() => handleDelete(index)}
												className="delete-button"
											>
												Delete
											</button>
										</td>
									</tr>
								))
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
			<Footer></Footer>
		</div>
	);
}

export default Accounts;
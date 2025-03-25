import React, { useState, useEffect } from 'react';
import AdminHeader from '../../Components/Admin_Header';
import Styles from './Request.module.css';
import Dashboard from '../../icon/dashboard.png';
import Icon from '../../icon/actual.png';
import Accounts from '../../icon/name.png';
import Report from '../../icon/Reports.png';
import AdminPost from '../../icon/Upload.png';
import Requests from '../../icon/request.png';

import Admin_Sidebar from '../../Components/Admin_Sidebar';
import Footer from '../../Components/composables/Footer';
import Header from '../../Components/composables/Header';

const Request = () => {
	const handleNavigation = (route) => {
		console.log(`Navigating to: ${route}`);

		window.location.href = `/${route}`;
	};
	const [requests, setRequests] = useState([
		{
			_id: '1',
			id_number: '202312345',
			firstname: 'John',
			lastname: 'Doe',
			program: 'Computer Science',
			update_data: {
				firstname: 'Johnny',
				lastname: 'Dough',
				program: 'Software Engineering',
			},
		},
		{
			_id: '2',
			id_number: '202398765',
			firstname: 'Jane',
			lastname: 'Smith',
			program: 'Information Technology',
			update_data: {
				firstname: 'Janet',
				lastname: 'Smythe',
				program: 'Data Science',
			},
		},
		{
			_id: '3',
			id_number: '202354321',
			firstname: 'Michael',
			lastname: 'Johnson',
			program: 'Cyber Security',
			update_data: {
				firstname: 'Mike',
				lastname: 'Johns',
				program: 'Network Engineering',
			},
		},
	]);

	const [selectedRequest, setSelectedRequest] = useState(null);
	const [showPopup, setShowPopup] = useState(false);

	// Function to fetch requests from the API (disabled for now)
	const fetchRequests = async () => {
		try {
			const response = await fetch('http://localhost:8000/admin/requests');
			const result = await response.json();
			if (result.success) {
				setRequests(result.data);
			} else {
				console.error('Failed to fetch requests:', result.detail);
			}
		} catch (error) {
			console.error('Error fetching requests:', error);
		}
	};

	// Disabled API fetch for testing with sample data
	useEffect(() => {
		// fetchRequests();
	}, []);

	// Handle viewing a request
	const handleView = (index) => {
		setSelectedRequest(requests[index]);
		setShowPopup(true);
	};

	// Handle accepting a request
	const handleAccept = async () => {
		if (!selectedRequest) return;

		try {
			const response = await fetch(
				`http://localhost:8000/admin/requests/accept/${selectedRequest._id}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(selectedRequest.update_data),
				}
			);
			const result = await response.json();

			if (result.success) {
				alert('Request accepted and changes applied!');
				setRequests(requests.filter((req) => req._id !== selectedRequest._id)); // Remove accepted request
				setShowPopup(false);
			} else {
				alert('Failed to apply changes.');
			}
		} catch (error) {
			console.error('Error accepting request:', error);
		}
	};

	// Handle declining a request
	const handleDecline = async () => {
		if (!selectedRequest) return;

		try {
			const response = await fetch(
				`http://localhost:8000/admin/requests/decline/${selectedRequest._id}`,
				{
					method: 'DELETE',
				}
			);
			const result = await response.json();

			if (result.success) {
				alert('Request declined.');
				setRequests(requests.filter((req) => req._id !== selectedRequest._id)); // Remove declined request
				setShowPopup(false);
			} else {
				alert('Failed to decline request.');
			}
		} catch (error) {
			console.error('Error declining request:', error);
		}
	};

	return (
		<div className={Styles.Maincontainer}>
			<Header></Header>
			<div className={Styles.Content_Wrapper}>
				<Admin_Sidebar></Admin_Sidebar>
				<div className={Styles.Content}>
					<div className={Styles.Greeting_Dashboard}>
						<h1>Request List</h1>
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
							<p>
								<strong>Account No:</strong> {selectedRequest.id_number}
							</p>
							<p>
								<strong>Current Name:</strong>{' '}
								{`${selectedRequest.firstname} ${selectedRequest.lastname}`}
							</p>
							<p>
								<strong>Requested First Name:</strong>{' '}
								{selectedRequest.update_data.firstname}
							</p>
							<p>
								<strong>Requested Last Name:</strong>{' '}
								{selectedRequest.update_data.lastname}
							</p>
							<p>
								<strong>Current Program:</strong> {selectedRequest.program}
							</p>
							<p>
								<strong>Requested Program:</strong>{' '}
								{selectedRequest.update_data.program}
							</p>

							<div className={Styles.PopupActions}>
								<button onClick={handleAccept} className={Styles.AcceptButton}>
									Accept
								</button>
								<button
									onClick={handleDecline}
									className={Styles.DeclineButton}
								>
									Decline
								</button>
								<button
									onClick={() => setShowPopup(false)}
									className={Styles.CloseButton}
								>
									Close
								</button>
							</div>
						</div>
					</div>
				)}
			</div>

			<Footer></Footer>
		</div>
	);
};

export default Request;

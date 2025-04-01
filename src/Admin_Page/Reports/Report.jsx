import React, { useState, useEffect } from 'react';
import Styles from './Report.module.css';

import Header from '../../Components/composables/Header';
import Admin_Sidebar from '../../Components/Admin_Sidebar';
import Footer from '../../Components/composables/FooterAdmin';

const Reports = () => {
	const [reports, setReports] = useState([
		{
			id: 1,
			student: 'John Doe',
			issue: 'Login issue',
			date: '2024-03-15',
			status: 'Pending',
		},
		{
			id: 2,
			student: 'Jane Smith',
			issue: 'Payment not processed',
			date: '2024-03-14',
			status: 'In Progress',
		},
		{
			id: 3,
			student: 'Mark Lee',
			issue: 'Assignment submission error',
			date: '2024-03-13',
			status: 'Resolved',
		},
	]);

	return (
		<div className={Styles.Maincontainer}>
			<Header></Header>
			<div className={Styles.Content_Wrapper}>
				<Admin_Sidebar></Admin_Sidebar>
				<div className={Styles.Content}>
					<div className={Styles.Greeting_Dashboard}>
						<h1>Report</h1>
					</div>
					<div className={Styles.ReportSearchFilter}>
						<div className={Styles.ReportSearchContainer}>
							<label className={Styles.ReportLabel}>Search: </label>
							<input
								type="text"
								placeholder="Search..."
								className={Styles.ReportSearchInput}
							/>
						</div>

						<div className={Styles.ReportFilterContainer}>
							<label className={Styles.ReportLabel}>Filter by Status: </label>
							<select className={Styles.ReportFilterDropdown}>
								<option value="">All</option>
								<option value="Pending">Pending</option>
								<option value="In Progress">In Progress</option>
								<option value="Resolved">Resolved</option>
							</select>
						</div>
					</div>

					{/* Report Table */}
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
											<button className={Styles.ReportViewButton}>View</button>
											<button className={Styles.ReportResolveButton}>
												Resolve
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<Footer></Footer>
		</div>
	);
};

export default Reports;

import React, { useState, useEffect } from "react";
import Styles from './Report.module.css';
import Dashboard from '../../icon/dashboard.png'; 
import Icon from '../../icon/actual.png';
import Accounts from '../../icon/name.png';
import Report from '../../icon/Reports.png';
import AdminPost from '../../icon/Upload.png';
import Request from '../../icon/request.png';

const SidebarItem = ({ icon, text, onClick }) => (
    <li>
      <button className="sidebar-item" onClick={onClick}>
        <img src={icon} alt={text} className="sidebar-icon" />
        <span>{text}</span>
      </button>
    </li>
  );

const Reports = () => {
    const handleNavigation = (route) => {
        console.log(`Navigating to: ${route}`);
      
        window.location.href = `/${route}`;
      };
    const [reports, setReports] = useState([
        { id: 1, student: "John Doe", issue: "Login issue", date: "2024-03-15", status: "Pending" },
        { id: 2, student: "Jane Smith", issue: "Payment not processed", date: "2024-03-14", status: "In Progress" },
        { id: 3, student: "Mark Lee", issue: "Assignment submission error", date: "2024-03-13", status: "Resolved" }
    ]);

    return (
        <div className={Styles.Maincontainer}>
    <div className={Styles.Header}> 
      <div className="header-content">
          <div className="header-logo">
              <img src={Icon} alt="logo" />
          </div>
          
      </div></div>
    <nav className={Styles.Menu}> 
      <ul>
        <li>
          <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('Admin_Dashboard')}>
            <img src={Dashboard} alt="Dashboard Icon" className={Styles.Sidebar_Icon} />
            <span>Dashboard</span>
          </buttonss>
        </li>
        <li>
          <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('Accounts')}>
            <img src={Accounts} alt="Accounts Icon" className={Styles.Sidebar_Icon} />
            <span>Accounts</span>
          </buttonss>
        </li>
        <li>
          <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('Adminpost')}>
            <img src={AdminPost} alt="Adminpost Icon" className={Styles.Sidebar_Icon} />
            <span>Uploads</span>
          </buttonss>
        </li>
        <li>
          <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('Report')}>
            <img src={Report} alt="Report Icon" className={Styles.Sidebar_Icon} />
            <span>Report</span>
          </buttonss>
        </li>
        <li>
          <buttonss className={Styles.Sidebar_Item} onClick={() => handleNavigation('Request')}>
            <img src={Request} alt="Request Icon" className={Styles.Sidebar_Icon} />
            <span>Request</span>
          </buttonss>
        </li>
      </ul>
     </nav>
    <div className={Styles.Content}>
      <div className={Styles.Greeting_Dashboard}>
              <h1>Report</h1>
            </div>
            <div className={Styles.ReportSearchFilter}>
                    <div className={Styles.ReportSearchContainer}>
                        <label className={Styles.ReportLabel}>Search: </label>
                        <input type="text" placeholder="Search..." className={Styles.ReportSearchInput} />
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
                            {reports.map(report => (
                                <tr key={report.id}>
                                    <td>{report.student}</td>
                                    <td>{report.issue}</td>
                                    <td>{report.date}</td>
                                    <td className={`${Styles.ReportStatus} ${Styles[report.status.replace(" ", "")]}`}>
                                        {report.status}
                                    </td>
                                    <td>
                                        <button className={Styles.ReportViewButton}>View</button>
                                        <button className={Styles.ReportResolveButton}>Resolve</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

    </div>
              
    );
}

export default Reports;

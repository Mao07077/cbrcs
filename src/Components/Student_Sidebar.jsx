import React from 'react'
import  './Student_Sidebar.module.css'
import nameIcon from '../icon/name.png';
import moduleIcon from '../icon/module.png';
import dashboardIcon from '../icon/dashboard.png';
import Request from '../icon/request.png';
import helpIcon from '../icon/help.png';



function Sidebar({ onClick }) {
  return (
    <nav className="sidebar">
      <ul>
        <li>
          <button className="sidebar-item" onClick={() => onClick('profile')}>
            <img src={nameIcon} alt="Name Icon" className="sidebar-icon" />
            <span>Name</span>
          </button>
        </li>
        <li>
          <button className="sidebar-item" onClick={() => onClick('module')}>
            <img src={moduleIcon} alt="Module Icon" className="sidebar-icon" />
            <span>Module</span>
          </button>
        </li>
        <li>
          <button className="sidebar-item" onClick={() => onClick('dashboard')}>
            <img src={dashboardIcon} alt="Dashboard Icon" className="sidebar-icon" />
            <span>Dashboard</span>
          </button>
        </li>
        <li>
          <button className="sidebar-item" onClick={() => onClick('settings')}>
            <img src={Request} alt="Request Icon" className="sidebar-icon" />
            <span>Request</span>
          </button>
        </li>
        <li>
          <button className="sidebar-item" onClick={() => onClick('help')}>
            <img src={helpIcon} alt="Help Icon" className="sidebar-icon" />
            <span>Help</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;
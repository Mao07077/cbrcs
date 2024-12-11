import React from 'react'
import Styles from './Student_Sidebar.module.css'
import nameIcon from '../icon/name.png';
import moduleIcon from '../icon/module.png';
import dashboardIcon from '../icon/dashboard.png';
import Request from '../icon/request.png';
import helpIcon from '../icon/help.png';

export default function Student_Sidebar() {
  return (
    <div>
              <nav className={Styles.Student_sidebar}>
    <ul>
        <button className="sidebar-item" onClick={() => navigateTo('profile')}>
            <img src={nameIcon} alt="Name Icon" />
            <span>Name</span>
        </button>
        <button className="sidebar-item" onClick={() => navigateTo('module')}>
            <img src={moduleIcon} alt="Module Icon" />
            <span>Module</span>
        </button>
        <button className="sidebar-item" onClick={() => navigateTo('dashboard')}>
            <img src={dashboardIcon} alt="Dashboard Icon" />
            <span>Dashboard</span>
        </button>
        <button className="sidebar-item" onClick={() => navigateTo('settings')}>
            <img src={Request} alt="Request Icon" />
            <span>Request</span>
        </button>
        <button className="sidebar-item" onClick={() => navigateTo('help')}>
            <img src={helpIcon} alt="Help Icon" />
            <span>Help</span>
        </button>
    </ul>
</nav>
    </div>
  )
}

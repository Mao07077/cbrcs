import React, { useEffect, useState } from 'react';
import './Header.css';
import logoIcon from '../icon/logo.png';
import nameIcon from '../icon/name.png';
import moduleIcon from '../icon/module.png';
import dashboardIcon from '../icon/dashboard.png';
import Request from '../icon/request.png';
import helpIcon from '../icon/help.png';
import { useNavigate } from 'react-router-dom';

const Header = () => {
	const nav = useNavigate();
	const handleNavigation = (route) => {
		console.log(`Navigating to: /module`);
		nav(`/module`);
	};

	return (
		<>
			<header className="header">
				<div className="header-content">
					<div className="header-logo">
						<img src={logoIcon} alt="logo" />
					</div>
				</div>
			</header>
			<div className="Main_Header">
				<nav className="Sidebar">
					<ul>
						<li onClick={() => handleNavigation('profile')}>
							<span>Profile</span>
						</li>

						<li onClick={() => handleNavigation('module')}>
							<span>Module</span>
						</li>

						<li onClick={() => handleNavigation('dashboard')}>
							<span>Dashboard</span>
						</li>
						<li onClick={() => handleNavigation('settings')}>
							<span>Request</span>
						</li>

						<li onClick={() => handleNavigation('help')}>
							<span>Help</span>
						</li>
					</ul>
				</nav>
			</div>
		</>
	);
};

export default Header;

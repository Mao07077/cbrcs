import React from 'react';
import './help.css';
import Header from '../../Components/Header';
import nameIcon from '../../icon/name.png';
import moduleIcon from '../../icon/module.png';
import dashboardIcon from '../../icon/dashboard.png';
import settingsIcon from '../../icon/settings.png';
import helpIcon from '../../icon/help.png';
import logoIcon from '../../icon/logo.png';



const HelpPage = () => {
    return (
        <div>
            <header className="header">
                <Header />
            </header>
            <main className="help-container">
                <div className="contact-box">
                    <h2>Contact Us</h2>
                </div>
            </main>
        </div>
    );
};

export default HelpPage;

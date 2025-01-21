import React, { useState, useEffect } from "react";
import AdminHeader from '../../Components/Admin_Header';
import Styles from './Report.module.css';

function Report() {

    return (
        <>
            <header className="header">
                <AdminHeader />
            </header>
            <div className={Styles.Report_Container}>
                <div className={Styles.Greeting_Report}>
                    <h1>Report</h1>
                </div>

                <div className={Styles.Container}>
                    <table className={Styles.Table}>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Report;

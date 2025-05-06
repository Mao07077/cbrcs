import React, { useState } from 'react';
import { Document, pdf } from '@react-pdf/renderer';
import Styles from './StudentReportModal.module.css';
import logo from '../../icon/actual.png'; // Logo import

function StudentReportModal({ reportData, onClose, onGeneratePDF, isGeneratingPDF, PDFDocument, formatTestData, formatStudyHabits }) {
    const [pdfError, setPdfError] = useState(null);

    const handlePrintPDF = async () => {
        try {
            setPdfError(null);
            onGeneratePDF(); // Notify parent component that PDF generation is starting

            // Generate PDF blob
            const doc = (
                <PDFDocument
                    data={reportData}
                    formatTestData={formatTestData}
                    formatStudyHabits={formatStudyHabits}
                    logo={logo}
                />
            );
            const blob = await pdf(doc).toBlob();

            // Create a URL for the blob
            const blobUrl = URL.createObjectURL(blob);

            // Open the PDF in a new window and trigger print
            const printWindow = window.open(blobUrl, '_blank');
            if (printWindow) {
                printWindow.onload = () => {
                    printWindow.focus();
                    printWindow.print();
                    // Optionally, close the window after printing (user can cancel print dialog)
                    printWindow.onafterprint = () => {
                        printWindow.close();
                        URL.revokeObjectURL(blobUrl); // Clean up
                    };
                };
            } else {
                setPdfError('Failed to open print window. Please allow pop-ups.');
            }

            // Close the modal after initiating print
            setTimeout(() => {
                onClose();
            }, 500);
        } catch (error) {
            console.error('Error generating PDF for print:', error);
            setPdfError('Failed to generate PDF for printing.');
        }
    };

    return (
        <div className={Styles.modalOverlay}>
            <div className={Styles.modalContent}>
                <button className={Styles.closeButton} onClick={onClose}>
                    ×
                </button>
                <h2>Student Report Preview</h2>
                <p>This preview shows the data that will be included in the PDF report.</p>
                {pdfError && <p className={Styles.error}>Error: {pdfError}</p>}
                <div className={Styles.reportContent}>
                    <img src={logo} alt="CBRC Logo" className={Styles.logo} />
                    <table className={Styles.testTable}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Program</th>
                                <th>Progress</th>
                                <th>Pre-Test Performance</th>
                                <th>Post-Test Performance</th>
                                <th>Recommended Study Habits</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.length > 0 ? (
                                reportData.map((student) => (
                                    <tr key={student.studentNo}>
                                        <td>{`${student.name} (${student.studentNo})`}</td>
                                        <td>{student.program}</td>
                                        <td>{`${student.progress}%`}</td>
                                        <td>{formatTestData(student.pre_tests, true)}</td>
                                        <td>{formatTestData(student.post_tests, false)}</td>
                                        <td>{formatStudyHabits(student.study_habits)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className={Styles.noData}>
                                        No student data available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className={Styles.modalActions}>
                    <button
                        onClick={onClose}
                        className={Styles.cancelButton}
                        disabled={isGeneratingPDF}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handlePrintPDF}
                        className={`${Styles.generateButton} ${isGeneratingPDF ? Styles.disabled : ''}`}
                        disabled={isGeneratingPDF}
                    >
                        {isGeneratingPDF ? 'Generating...' : 'Print PDF'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StudentReportModal;
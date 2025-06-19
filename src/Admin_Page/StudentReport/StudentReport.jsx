import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import Styles from './StudentReport.module.css';
import StudentReportModal from './StudentReportModal';
import Header from '../../Components/composables/Header';
import Admin_Sidebar from '../../Components/Admin_Sidebar';
import Footer from '../../Components/composables/Footer';

const API_URL = "http://127.0.0.1:8000";
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : "http://127.0.0.1:8000");
// Styles for react-pdf
const pdfStyles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 50,
    marginRight: 10,
  },
  headerText: {
    fontSize: 14,
    textAlign: 'center',
    flex: 1,
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  table: {
    display: 'flex',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
    alignItems: 'center',
    minHeight: 24,
  },
  tableHeader: {
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#bfbfbf',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  cell0: { width: '20%' },
  cell1: { width: '15%' },
  cell2: { width: '10%' },
  cell3: { width: '25%' },
  cell4: { width: '25%' },
  cell5: { width: '25%' },
  noData: {
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 10,
  },
});

// PDF Document Component
const PDFDocument = ({ data, formatTestData, formatStudyHabits, logo }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={pdfStyles.page}>
      <View style={pdfStyles.header}>
        <Image
          style={pdfStyles.logo}
          src={logo} // Use logo passed as prop
        />
        <Text style={pdfStyles.headerText}>Carl Balita Review Center Las Pinas Branch</Text>
      </View>
      <Text style={pdfStyles.title}>Student Report</Text>
      <View style={pdfStyles.table}>
        <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
          <Text style={[pdfStyles.tableCell, pdfStyles.cell0]}>Name</Text>
          <Text style={[pdfStyles.tableCell, pdfStyles.cell1]}>Program</Text>
          <Text style={[pdfStyles.tableCell, pdfStyles.cell2]}>Progress</Text>
          <Text style={[pdfStyles.tableCell, pdfStyles.cell3]}>Pre-Test Performance</Text>
          <Text style={[pdfStyles.tableCell, pdfStyles.cell4]}>Post-Test Performance</Text>
          <Text style={[pdfStyles.tableCell, pdfStyles.cell5]}>Recommended Study Habits</Text>
        </View>
        {data.length > 0 ? (
          data.map((student, index) => (
            <View key={index} style={pdfStyles.tableRow}>
              <Text style={[pdfStyles.tableCell, pdfStyles.cell0]}>{`${student.name} (${student.studentNo})`}</Text>
              <Text style={[pdfStyles.tableCell, pdfStyles.cell1]}>{student.program}</Text>
              <Text style={[pdfStyles.tableCell, pdfStyles.cell2]}>{`${student.progress}%`}</Text>
              <Text style={[pdfStyles.tableCell, pdfStyles.cell3]}>{formatTestData(student.pre_tests, true)}</Text>
              <Text style={[pdfStyles.tableCell, pdfStyles.cell4]}>{formatTestData(student.post_tests, false)}</Text>
              <Text style={[pdfStyles.tableCell, pdfStyles.cell5]}>{formatStudyHabits(student.study_habits)}</Text>
            </View>
          ))
        ) : (
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, pdfStyles.noData]}>No student data available.</Text>
          </View>
        )}
      </View>
    </Page>
  </Document>
);

function StudentReport() {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [programFilter, setProgramFilter] = useState('All');
    const [seasonFilter, setSeasonFilter] = useState('May 2025');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [programs, setPrograms] = useState(['All']);
    const [seasons, setSeasons] = useState(['All', 'May 2025']);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    // Fetch students and extract unique programs and seasons
    useEffect(() => {
        axios
            .get(`${API_URL}/students`)
            .then((response) => {
                const mappedStudents = response.data.map((student) => ({
                    studentNo: student.studentNo,
                    name: student.name,
                    program: student.program,
                    season: 'May 2025', // Set all students to May 2025 season
                }));
                setStudents(mappedStudents);
                setFilteredStudents(mappedStudents);
                const uniquePrograms = ['All', ...new Set(mappedStudents.map((s) => s.program))];
                setPrograms(uniquePrograms);
                setSeasons(['All', 'May 2025']);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching students:', error);
                setError('Failed to load students.');
                setIsLoading(false);
            });
    }, []);

    // Handle program, season, and search query changes
    useEffect(() => {
        let filtered = students;
        
        
        
        // Apply program filter
        if (programFilter !== 'All') {
            filtered = filtered.filter((student) => student.program === programFilter);
        }
        
        // Apply season filter
        if (seasonFilter !== 'All') {
            filtered = filtered.filter((student) => student.season === seasonFilter);
        }
        
        // Apply search query filter
        if (searchQuery.trim() !== '') {
            const query = searchQuery.trim().toLowerCase();
            filtered = filtered.filter(
                (student) =>
                    student.name.toLowerCase().includes(query) ||
                    student.studentNo.toLowerCase().includes(query)
            );
        }
        
        setFilteredStudents(filtered);
        setSelectedStudents([]);
    }, [programFilter, seasonFilter, searchQuery, students]);

    // Handle student selection
    const handleSelectStudent = (studentNo) => {
        setSelectedStudents((prev) =>
            prev.includes(studentNo)
                ? prev.filter((id) => id !== studentNo)
                : [...prev, studentNo]
        );
    };

    // Select all filtered students
    const handleSelectAll = () => {
        if (selectedStudents.length === filteredStudents.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(filteredStudents.map((student) => student.studentNo));
        }
    };

    // Fetch report data for selected students
    const fetchReportData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const reportPromises = selectedStudents.map(async (studentNo) => {
                const student = students.find((s) => s.studentNo === studentNo);
                const [dashboardResponse, habitsResponse] = await Promise.all([
                    axios.get(`${API_URL}/api/dashboard/${studentNo}`),
                    axios.get(`${API_URL}/students/${studentNo}/recommended-pages`),
                ]);
                return {
                    studentNo,
                    name: student.name,
                    program: student.program,
                    season: student.season,
                    pre_tests: dashboardResponse.data.pre_tests || [],
                    post_tests: dashboardResponse.data.post_tests || [],
                    progress: 60,
                    study_habits: habitsResponse.data.recommendedPages || [],
                };
            });
            const data = await Promise.all(reportPromises);
            setReportData(data);
            return data;
        } catch (error) {
            console.error('Error fetching report data:', error);
            setError('Failed to fetch report data.');
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    // Format test data into a string
    const formatTestData = (tests, isPreTest = true) => {
        if (!tests || tests.length === 0) {
            return 'No tests completed.';
        }
        return tests
            .map((test) => {
                const title = isPreTest ? test.pre_test_title : test.post_test_title;
                return `${title || 'Unknown'}: ${test.correct || 0}/${test.incorrect || 0}/${test.total_questions || 0} (${Math.floor((test.time_spent || 0) / 60)} min)`;
            })
            .join('; ');
    };

    // Format study habits
    const formatStudyHabits = (habits) => {
        if (!habits || habits.length === 0) {
            return 'No recommended study habits.';
        }
        return habits.join(', ');
    };

    // Handle opening the preview modal
    const handleOpenPreview = async () => {
        if (selectedStudents.length === 0) {
            setError('Please select at least one student.');
            return;
        }
        const data = await fetchReportData();
        if (data.length > 0) {
            setIsModalOpen(true);
        }
    };

    // Handle PDF generation after preview confirmation
    const handleGeneratePDF = () => {
        setIsGeneratingPDF(true);
        // The PDF is generated via PDFDownloadLink in the modal
        setIsGeneratingPDF(false);
        setIsModalOpen(false);
    };

    // Close the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setReportData([]);
    };

    return (
        <div className={Styles.MainContainer}>
            <Header />
            <div className={Styles.Content_Wrapper}>
                <Admin_Sidebar/>
                <div className={Styles.Content}>
                    <div className={Styles.Title}>
                        <h2>Student Report</h2>
                    </div>
                    <div className={Styles.FilterSection}>
                        <div className={Styles.SearchBar}>
                            <label htmlFor="searchQuery">Search Students:</label>
                            <input
                                id="searchQuery"
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name or student number..."
                                className={Styles.SearchInput}
                            />
                        </div>
                        <div className={Styles.SeasonFilter}>
                            <label htmlFor="seasonFilter">Filter by Season:</label>
                            <select
                                id="seasonFilter"
                                value={seasonFilter}
                                onChange={(e) => setSeasonFilter(e.target.value)}
                                className={Styles.FilterSelect}
                            >
                                {seasons.map((season) => (
                                    <option key={season} value={season}>
                                        {season}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={Styles.ProgramFilter}>
                            <label htmlFor="programFilter">Filter by Program:</label>
                            <select
                                id="programFilter"
                                value={programFilter}
                                onChange={(e) => setProgramFilter(e.target.value)}
                                className={Styles.FilterSelect}
                            >
                                {programs.map((program) => (
                                    <option key={program} value={program}>
                                        {program}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {isLoading ? (
                        <p>Loading students...</p>
                    ) : error ? (
                        <p className={Styles.Error}>{error}</p>
                    ) : (
                        <>
                            <div className={Styles.TableControls}>
                                <button
                                    onClick={handleSelectAll}
                                    className={Styles.SelectAllButton}
                                    disabled={filteredStudents.length === 0}
                                >
                                    {selectedStudents.length === filteredStudents.length &&
                                    filteredStudents.length > 0
                                        ? 'Deselect All'
                                        : 'Select All'}
                                </button>
                                <button
                                    onClick={handleOpenPreview}
                                    className={Styles.GeneratePDFButton}
                                    disabled={selectedStudents.length === 0}
                                >
                                    Preview
                                </button>
                            </div>
                            <table className={Styles.Table}>
                                <thead>
                                    <tr>
                                        <th>Select</th>
                                        <th>Student No.</th>
                                        <th>Name</th>
                                        <th>Program</th>
                                        <th>Season</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((student) => (
                                            <tr key={student.studentNo}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedStudents.includes(student.studentNo)}
                                                        onChange={() => handleSelectStudent(student.studentNo)}
                                                    />
                                                </td>
                                                <td>{student.studentNo}</td>
                                                <td>{student.name}</td>
                                                <td>{student.program}</td>
                                                <td>{student.season}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className={Styles.NoStudents}>
                                                No students found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </>
                    )}
                    {isModalOpen && (
                        <StudentReportModal
                            reportData={reportData}
                            onClose={closeModal}
                            onGeneratePDF={handleGeneratePDF}
                            isGeneratingPDF={isGeneratingPDF}
                            PDFDocument={PDFDocument}
                            formatTestData={formatTestData}
                            formatStudyHabits={formatStudyHabits}
                        />
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default StudentReport;
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getStudentMonitoring, 
  getStudentEnrollments, 
  getStudentRatings
} from '../../services/api';
import './Student.css';

const Monitoring = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [debugInfo, setDebugInfo] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setError('');
      setLoading(true);
      setDebugInfo('Fetching data...');
      
      console.log('🔄 Fetching data for student:', user?.id);
      
      const [reportsRes, enrollmentsRes, ratingsRes] = await Promise.all([
        getStudentMonitoring(user?.id),
        getStudentEnrollments(user?.id),
        getStudentRatings(user?.id)
      ]);
      
      const reportsData = reportsRes.data || [];
      const enrollmentsData = enrollmentsRes.data || [];
      const ratingsData = ratingsRes.data || [];

      setReports(reportsData);
      setEnrollments(enrollmentsData);
      setRatings(ratingsData);
      setLastUpdate(new Date());
      
      // Set debug info
      setDebugInfo(`
        Reports: ${reportsData.length}
        Enrollments: ${enrollmentsData.length}
        Last Update: ${new Date().toLocaleTimeString()}
      `);
      
    } catch (error) {
      console.error('❌ Error:', error);
      setError(error.message || 'Failed to load data');
      setDebugInfo(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Test with sample data
  const loadSampleData = () => {
    const sampleReports = [
      {
        id: 1,
        course_name: "Web Development",
        course_code: "DIWA2110",
        lecturer_name: "Dr. Smith",
        date_of_lecture: "2024-01-20",
        topic_taught: "React Components and Props",
        actual_students_present: 25,
        total_students_registered: 30,
        venue: "Lab 101",
        week_of_reporting: 6,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        course_name: "Database Systems",
        course_code: "DBS3010",
        lecturer_name: "Prof. Johnson",
        date_of_lecture: "2024-01-19",
        topic_taught: "SQL Advanced Queries",
        actual_students_present: 28,
        total_students_registered: 32,
        venue: "Room 205",
        week_of_reporting: 6,
        created_at: new Date().toISOString()
      }
    ];

    const sampleEnrollments = [
      {
        id: 1,
        course_name: "Web Development",
        course_code: "DIWA2110"
      },
      {
        id: 2,
        course_name: "Database Systems", 
        course_code: "DBS3010"
      }
    ];

    setReports(sampleReports);
    setEnrollments(sampleEnrollments);
    setDebugInfo('✅ Loaded sample data for testing');
  };

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id, fetchData]);

  // TEMPORARY: Show all reports without enrollment check
  const filteredReports = selectedCourse === 'all' 
    ? reports
    : reports.filter(report => report.course_code === selectedCourse);

  if (loading) {
    return (
      <div className="student-monitoring-container">
        <div className="student-loading">
          <div className="student-loading-spinner"></div>
          <p>Loading your lecture reports...</p>
          <small>{debugInfo}</small>
        </div>
      </div>
    );
  }

  return (
    <div className="student-monitoring-container">
      {/* Debug Panel */}
      <div className="debug-panel">
        <strong>🧪 Debug Information</strong>
        <div>User: {user?.id} | Role: {user?.role}</div>
        <div>Reports: {reports.length} | Enrollments: {enrollments.length} | Filtered: {filteredReports.length}</div>
        <div>{debugInfo}</div>
        <button 
          onClick={loadSampleData}
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '3px',
            marginTop: '5px',
            cursor: 'pointer'
          }}
        >
          Load Sample Data
        </button>
      </div>

      <div className="student-monitoring-header">
        <div className="student-monitoring-title-section">
          <h4>📊 Lecture Reports Monitoring</h4>
          <p className="student-monitoring-subtitle">
            View reports submitted by lecturers for your enrolled courses
          </p>
        </div>
        
        <div className="student-monitoring-controls">
          <div className="student-monitoring-stats">
            <span className="student-stat-badge">
              {reports.length} total • {filteredReports.length} filtered
            </span>
          </div>
          
          <select 
            className="student-monitoring-select"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="all">📚 All My Courses</option>
            {enrollments.map((enrollment) => (
              <option key={enrollment.course_code} value={enrollment.course_code}>
                {enrollment.course_name} ({enrollment.course_code})
              </option>
            ))}
          </select>
          
          <button 
            className="student-monitoring-refresh"
            onClick={fetchData}
            title="Refresh reports"
          >
            🔄
          </button>
        </div>
      </div>

      <div className="student-monitoring-content">
        {filteredReports.length === 0 ? (
          <div className="student-empty-state">
            <div className="student-empty-icon">📋</div>
            <h5>No Reports Available</h5>
            <p>No lecture reports found.</p>
            <div className="student-action-buttons">
              <button className="guest-btn guest-btn-primary" onClick={fetchData}>
                Refresh Data
              </button>
              <button className="guest-btn guest-btn-outline" onClick={loadSampleData}>
                Load Sample Data
              </button>
            </div>
            {error && (
              <div style={{color: 'red', marginTop: '10px'}}>
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="student-monitoring-summary">
              <p>
                📈 Showing <strong>{filteredReports.length}</strong> report(s)
              </p>
            </div>

            <div className="student-table-container">
              <table className="student-monitoring-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Lecturer</th>
                    <th>Date</th>
                    <th>Topic</th>
                    <th>Attendance</th>
                    <th>Venue</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => {
                    const attendanceRate = report.actual_students_present / report.total_students_registered;
                    const attendanceClass = attendanceRate > 0.7 ? 'high' : attendanceRate > 0.5 ? 'medium' : 'low';
                    
                    return (
                      <tr key={report.id} className="student-report-row">
                        <td>
                          <strong>{report.course_name}</strong>
                          <br />
                          <small>{report.course_code}</small>
                        </td>
                        <td>👨‍🏫 {report.lecturer_name}</td>
                        <td>{new Date(report.date_of_lecture).toLocaleDateString()}</td>
                        <td>{report.topic_taught}</td>
                        <td>
                          <span className={`student-attendance-badge ${attendanceClass}`}>
                            {report.actual_students_present}/{report.total_students_registered}
                            ({Math.round(attendanceRate * 100)}%)
                          </span>
                        </td>
                        <td>🏢 {report.venue}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Monitoring;
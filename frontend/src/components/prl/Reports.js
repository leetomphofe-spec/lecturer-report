import React, { useState, useEffect } from 'react';
import { getPRLReports, addFeedback } from '../../services/api';

const Reports = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    fetchReports();
  }, [user?.id]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError('');
      setDebugInfo('Fetching lecture reports from lecturers...');
      
      console.log('PRL Reports - Fetching lecture reports for PRL:', user);
      
      const response = await getPRLReports(user.id);
      console.log('Lecture Reports API Response:', response);
      
      const reportsData = response.data || response || [];
      setReports(reportsData);
      
      setDebugInfo(`
        PRL ID: ${user.id}
        Lecture Reports Found: ${reportsData.length}
        User Role: ${user.role}
      `);
      
    } catch (error) {
      console.error('Error fetching lecture reports:', error);
      setError(`Failed to load lecture reports: ${error.message}`);
      setDebugInfo(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      await addFeedback({
        report_id: selectedReport.id,
        prl_id: user.id,
        feedback_text: feedback
      });
      alert('Feedback submitted successfully!');
      setSelectedReport(null);
      setFeedback('');
      fetchReports(); // Refresh to see updated feedback
    } catch (error) {
      alert('Error submitting feedback');
    }
  };

  // Test function to load sample data matching your database structure
  const loadSampleData = () => {
    const sampleReports = [
      {
        id: 1,
        lecturer_id: 1,
        faculty_name: "ICT",
        class_name: "DIT-2023-A",
        week_of_reporting: "Week 6",
        date_of_lecture: "2024-01-15",
        course_name: "Web Application Development",
        course_code: "DIWA2110",
        lecturer_name: "Dr. John Smith",
        actual_students_present: 42,
        total_students_registered: 45,
        venue: "Lab 301",
        scheduled_time: "09:00-11:00",
        topic_taught: "Introduction to React and Component Architecture",
        learning_outcomes: "Understanding React components, props, and state management",
        recommendations: "More practical examples needed for state management",
        feedback_given: null,
        created_at: "2024-01-15T10:30:00Z"
      },
      {
        id: 2,
        lecturer_id: 7,
        faculty_name: "ICT",
        class_name: "DBIT-2023-A",
        week_of_reporting: "Week 4",
        date_of_lecture: "2025-09-30",
        course_name: "Web Application Development",
        course_code: "DIWA2110",
        lecturer_name: "letona",
        actual_students_present: 35,
        total_students_registered: 38,
        venue: "Room 205",
        scheduled_time: "14:00-16:00",
        topic_taught: "Database Integration with Web Applications",
        learning_outcomes: "Connecting React frontend with backend databases",
        recommendations: "Provide more examples of API integration",
        feedback_given: "Good progress on database integration concepts",
        created_at: "2025-09-30T15:45:00Z"
      },
      {
        id: 3,
        lecturer_id: 7,
        faculty_name: "FICT",
        class_name: "DBIT-2023-A",
        week_of_reporting: "Week 2",
        date_of_lecture: "2025-09-29",
        course_name: "Web Application Development",
        course_code: "DIWA2110",
        lecturer_name: "letona",
        actual_students_present: 28,
        total_students_registered: 30,
        venue: "Lab 110",
        scheduled_time: "11:00-13:00",
        topic_taught: "JavaScript Fundamentals and ES6 Features",
        learning_outcomes: "Mastering modern JavaScript syntax and features",
        recommendations: "Include more exercises on arrow functions and destructuring",
        feedback_given: null,
        created_at: "2025-09-29T12:20:00Z"
      },
      {
        id: 4,
        lecturer_id: 7,
        faculty_name: "FICT",
        class_name: "Class-ANI3010",
        week_of_reporting: "Week 3",
        date_of_lecture: "2025-09-30",
        course_name: "Web Application Development",
        course_code: "DIWA2110",
        lecturer_name: "letona",
        actual_students_present: 25,
        total_students_registered: 28,
        venue: "Room 305",
        scheduled_time: "08:00-10:00",
        topic_taught: "CSS Frameworks and Responsive Design",
        learning_outcomes: "Implementing responsive layouts with Bootstrap",
        recommendations: "More practice with grid systems needed",
        feedback_given: "Excellent coverage of responsive design principles",
        created_at: "2025-09-30T09:15:00Z"
      },
      {
        id: 5,
        lecturer_id: 7,
        faculty_name: "ICT",
        class_name: "Class-ANI3010",
        week_of_reporting: "Week 3",
        date_of_lecture: "2025-09-30",
        course_name: "database management",
        course_code: "ANI",
        lecturer_name: "letona",
        actual_students_present: 22,
        total_students_registered: 25,
        venue: "Lab 201",
        scheduled_time: "10:00-12:00",
        topic_taught: "SQL Queries and Database Design",
        learning_outcomes: "Creating and querying relational databases",
        recommendations: "Focus more on complex JOIN operations",
        feedback_given: null,
        created_at: "2025-09-30T11:30:00Z"
      }
    ];

    setReports(sampleReports);
    setDebugInfo('Loaded sample lecture report data matching database structure');
    console.log('Sample lecture reports loaded:', sampleReports);
  };

  if (loading) {
    return (
      <div className="prl-reports-container">
        <div className="loading-spinner"></div>
        <p>Loading lecture reports from lecturers...</p>
        <small className="text-muted">{debugInfo}</small>
      </div>
    );
  }

  return (
    <div className="prl-reports-container">
      {/* Debug Panel */}
      <div className="debug-panel">
        <div className="debug-actions">
          <button onClick={loadSampleData} className="btn-test">
            Load Sample Lecture Reports
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4>Lecture Reports from Lecturers</h4>
              <span className="badge bg-primary">{reports.length} reports</span>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-warning">
                  <strong>Notice:</strong> {error}
                </div>
              )}

              {reports.length === 0 ? (
                <div className="text-center py-5">
                  <h5>No Lecture Reports Found</h5>
                  <p className="text-muted">
                    This could be because:
                  </p>
                  <ul className="text-start text-muted">
                    <li>Lecturers in your stream haven't submitted any reports yet</li>
                    <li>Reports are still being processed</li>
                    <li>There might be a data loading issue</li>
                  </ul>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Faculty</th>
                        <th>Course</th>
                        <th>Lecturer</th>
                        <th>Class</th>
                        <th>Date</th>
                        <th>Week</th>
                        <th>Attendance</th>
                        <th>Topic</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((report) => (
                        <tr key={report.id}>
                          <td>{report.faculty_name}</td>
                          <td>
                            <div>
                              <strong>{report.course_code}</strong>
                            </div>
                            <small className="text-muted">{report.course_name}</small>
                          </td>
                          <td>{report.lecturer_name}</td>
                          <td>{report.class_name}</td>
                          <td>{new Date(report.date_of_lecture).toLocaleDateString()}</td>
                          <td>{report.week_of_reporting}</td>
                          <td>
                            {report.actual_students_present}/{report.total_students_registered}
                            <br />
                            <small className="text-muted">
                              ({Math.round((report.actual_students_present / report.total_students_registered) * 100)}%)
                            </small>
                          </td>
                          <td>
                            <span title={report.topic_taught}>
                              {report.topic_taught.substring(0, 25)}
                              {report.topic_taught.length > 25 ? '...' : ''}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${report.feedback_given ? 'bg-success' : 'bg-warning'}`}>
                              {report.feedback_given ? 'Reviewed' : 'Pending Review'}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn btn-primary btn-sm"
                              onClick={() => {
                                setSelectedReport(report);
                                setFeedback(report.feedback_given || '');
                              }}
                            >
                              {report.feedback_given ? 'View/Edit' : 'Review'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          {selectedReport && (
            <div className="card">
              <div className="card-header">
                <h5>
                  {selectedReport.feedback_given ? 'View/Edit Feedback' : 'Review Lecture Report'}
                </h5>
              </div>
              <div className="card-body">
                <div className="report-details mb-3">
                  <h6>Report Details</h6>
                  <p><strong>Faculty:</strong> {selectedReport.faculty_name}</p>
                  <p><strong>Course:</strong> {selectedReport.course_name} ({selectedReport.course_code})</p>
                  <p><strong>Lecturer:</strong> {selectedReport.lecturer_name}</p>
                  <p><strong>Lecturer ID:</strong> {selectedReport.lecturer_id}</p>
                  <p><strong>Class:</strong> {selectedReport.class_name}</p>
                  <p><strong>Date:</strong> {new Date(selectedReport.date_of_lecture).toLocaleDateString()}</p>
                  <p><strong>Week:</strong> {selectedReport.week_of_reporting}</p>
                  <p><strong>Venue:</strong> {selectedReport.venue}</p>
                  <p><strong>Time:</strong> {selectedReport.scheduled_time}</p>
                  <p><strong>Attendance:</strong> {selectedReport.actual_students_present}/{selectedReport.total_students_registered} students</p>
                  
                  <div className="mt-3">
                    <h6>Teaching Details</h6>
                    <p><strong>Topic Taught:</strong> {selectedReport.topic_taught}</p>
                    <p><strong>Learning Outcomes:</strong> {selectedReport.learning_outcomes}</p>
                    <p><strong>Lecturer Recommendations:</strong> {selectedReport.recommendations}</p>
                  </div>
                </div>
                
                <form onSubmit={handleSubmitFeedback}>
                  <div className="mb-3">
                    <label className="form-label">PRL Feedback</label>
                    <textarea
                      className="form-control"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows="6"
                      required
                      placeholder="Provide your feedback and recommendations for this lecture report..."
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success">
                      {selectedReport.feedback_given ? 'Update Feedback' : 'Submit Feedback'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => {
                        setSelectedReport(null);
                        setFeedback('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>

                {selectedReport.feedback_given && (
                  <div className="mt-3 p-2 bg-light rounded">
                    <small>
                      <strong>Previous Feedback:</strong> {selectedReport.feedback_given}
                    </small>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
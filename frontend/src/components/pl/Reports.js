import React, { useState, useEffect } from 'react';
import { getPLReports, getPLCourses, getPLLecturers } from '../../services/api';
import './PL.css';

const Reports = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    fetchReportsData();
  }, [user?.id]);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      setError('');
      setDebugInfo('Fetching reports data...');
      
      console.log('PL Reports - Fetching data for PL:', user);
      
      const [reportsRes, coursesRes, lecturersRes] = await Promise.all([
        getPLReports(),
        getPLCourses(),
        getPLLecturers()
      ]);

      console.log('PL Reports API Response:', reportsRes);
      console.log(' PL Courses API Response:', coursesRes);
      console.log(' PL Lecturers API Response:', lecturersRes);

      const reportsData = reportsRes.data || reportsRes || [];
      const coursesData = coursesRes.data || coursesRes || [];
      const lecturersData = lecturersRes.data || lecturersRes || [];

      setReports(reportsData);
      setCourses(coursesData);
      setLecturers(lecturersData);

      setDebugInfo(`
        PL ID: ${user.id}
        Reports: ${reportsData.length}
        Courses: ${coursesData.length}
        Lecturers: ${lecturersData.length}
      `);

    } catch (error) {
      console.error('Error fetching PL reports data:', error);
      console.error(' Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      setError(`Failed to load reports: ${error.message}`);
      setDebugInfo(`Error: ${error.message} - Status: ${error.response?.status}`);
    } finally {
      setLoading(false);
    }
  };

  // Test function to load sample data
  const loadSampleData = () => {
    const sampleReports = [
      {
        id: 1,
        course_name: "Web Development",
        course_code: "DIWA2110",
        lecturer_name: "Dr. Smith",
        date_of_lecture: "2024-01-20",
        actual_students_present: 25,
        total_students_registered: 30,
        topic_taught: "React Components and State Management",
        feedback_text: "Excellent lecture structure and student engagement. Consider adding more practical examples.",
        feedback_date: "2024-01-21",
        prl_name: "Prof. Anderson",
        stream: "Information Technology"
      },
      {
        id: 2,
        course_name: "Database Systems",
        course_code: "DBS3010",
        lecturer_name: "Prof. Johnson",
        date_of_lecture: "2024-01-19",
        actual_students_present: 28,
        total_students_registered: 32,
        topic_taught: "SQL Joins and Advanced Queries",
        feedback_text: "Good content coverage. The pace was appropriate for the complexity of the material.",
        feedback_date: "2024-01-20",
        prl_name: "Prof. Anderson",
        stream: "Information Technology"
      },
      {
        id: 3,
        course_name: "Network Security",
        course_code: "NS4010",
        lecturer_name: "Dr. Brown",
        date_of_lecture: "2024-01-18",
        actual_students_present: 22,
        total_students_registered: 25,
        topic_taught: "Cryptography Principles",
        feedback_text: null,
        feedback_date: null,
        prl_name: null,
        stream: "Cyber Security"
      },
      {
        id: 4,
        course_name: "Business Analytics",
        course_code: "BIT2010",
        lecturer_name: "Dr. Wilson",
        date_of_lecture: "2024-01-17",
        actual_students_present: 18,
        total_students_registered: 20,
        topic_taught: "Data Visualization Techniques",
        feedback_text: "Outstanding use of real-world examples. Students were highly engaged throughout.",
        feedback_date: "2024-01-18",
        prl_name: "Dr. Taylor",
        stream: "Business Information Technology"
      }
    ];

    const sampleCourses = [
      {
        id: 1,
        course_name: "Web Development",
        course_code: "DIWA2110",
        stream: "Information Technology"
      },
      {
        id: 2,
        course_name: "Database Systems",
        course_code: "DBS3010",
        stream: "Information Technology"
      }
    ];

    const sampleLecturers = [
      {
        id: 1,
        name: "Dr. Smith",
        email: "smith@luct.ac.ls",
        stream: "Information Technology"
      },
      {
        id: 2,
        name: "Prof. Johnson",
        email: "johnson@luct.ac.ls",
        stream: "Information Technology"
      }
    ];

    setReports(sampleReports);
    setCourses(sampleCourses);
    setLecturers(sampleLecturers);
    setDebugInfo(' Loaded sample data for testing');
    console.log('Sample reports loaded:', sampleReports);
  };

  // Test API connection
  const testAPIConnection = async () => {
    try {
      setDebugInfo('Testing API connection...');
      
      // Test PL reports endpoint directly
      const response = await fetch('http://localhost:5000/api/pl/reports');
      const data = await response.json();
      console.log('Direct PL Reports API Response:', { status: response.status, data });
      
      setDebugInfo(`PL Reports API: ${response.status}`);
      
    } catch (testError) {
      console.error(' API Connection Test Failed:', testError);
      setDebugInfo(`API Test Failed: ${testError.message}`);
    }
  };

  // Calculate statistics
  const calculateStats = () => {
    const totalReports = reports.length;
    const reportsWithFeedback = reports.filter(report => report.feedback_text).length;
    const feedbackRate = totalReports > 0 ? (reportsWithFeedback / totalReports) * 100 : 0;
    const uniqueStreams = new Set(reports.map(report => report.stream)).size;
    const uniqueLecturers = new Set(reports.map(report => report.lecturer_name)).size;

    return {
      totalReports,
      reportsWithFeedback,
      feedbackRate: Math.round(feedbackRate),
      uniqueStreams,
      uniqueLecturers
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="pl-reports-container">
        <div className="loading-spinner"></div>
        <p>Loading reports data...</p>
        <small className="text-muted">{debugInfo}</small>
      </div>
    );
  }

  return (
    <div className="pl-reports-container">
      {/* Debug Panel */}
      <div className="debug-panel">
        <strong>PL REPORTS DEBUG INFO</strong>
        <div>PL ID: {user?.id} | Role: {user?.role}</div>
        <div>Reports: {reports.length} | Courses: {courses.length} | Lecturers: {lecturers.length}</div>
        <div>{debugInfo}</div>
        
        <div className="debug-actions">
          <button onClick={loadSampleData} className="btn-test">
            Load Sample Data
          </button>
        </div>
      </div>



      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4>Reports with PRL Feedback</h4>
          <div>
            <span className="badge bg-primary">{reports.length} reports</span>
            {reports.some(r => r.sample_data) && (
              <span className="badge bg-info ms-2">Sample Data</span>
            )}
          </div>
        </div>
        
        <div className="card-body">
          {reports.length === 0 ? (
            <div className="text-center py-5">
              <div className="empty-state-icon"></div>

              
              <div className="mt-4">

                <button className="btn btn-outline-secondary me-2" onClick={loadSampleData}>
                   Load Sample Data
                </button>

              </div>

              {/* Show available data for reference */}
              {(courses.length > 0 || lecturers.length > 0) && (
                <div className="mt-4">
                  <div className="alert alert-info">
                    <h6>Available Data</h6>
                    <div className="row">
                      {courses.length > 0 && (
                        <div className="col-md-6">
                          <strong>Courses: {courses.length}</strong>
                          <div className="mt-2">
                            {courses.slice(0, 3).map((course, index) => (
                              <div key={index} className="mb-1">
                                <small>
                                  <strong>{course.course_code}</strong>: {course.course_name}
                                  {course.stream && <span className="text-muted"> ({course.stream})</span>}
                                </small>
                              </div>
                            ))}
                            {courses.length > 3 && (
                              <small className="text-muted">... and {courses.length - 3} more</small>
                            )}
                          </div>
                        </div>
                      )}
                      {lecturers.length > 0 && (
                        <div className="col-md-6">
                          <strong>Lecturers: {lecturers.length}</strong>
                          <div className="mt-2">
                            {lecturers.slice(0, 3).map((lecturer, index) => (
                              <div key={index} className="mb-1">
                                <small>
                                  <strong>{lecturer.name}</strong>
                                  {lecturer.stream && <span className="text-muted"> ({lecturer.stream})</span>}
                                </small>
                              </div>
                            ))}
                            {lecturers.length > 3 && (
                              <small className="text-muted">... and {lecturers.length - 3} more</small>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Statistics */}
              <div className="row mb-4">
                <div className="col-md-2">
                  <div className="stat-card-sm bg-primary">
                    <div className="stat-number">{stats.totalReports}</div>
                    <div className="stat-label">Total Reports</div>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="stat-card-sm bg-success">
                    <div className="stat-number">{stats.reportsWithFeedback}</div>
                    <div className="stat-label">With Feedback</div>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="stat-card-sm bg-info">
                    <div className="stat-number">{stats.feedbackRate}%</div>
                    <div className="stat-label">Feedback Rate</div>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="stat-card-sm bg-warning">
                    <div className="stat-number">{stats.uniqueLecturers}</div>
                    <div className="stat-label">Lecturers</div>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="stat-card-sm bg-secondary">
                    <div className="stat-number">{stats.uniqueStreams}</div>
                    <div className="stat-label">Streams</div>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="stat-card-sm bg-purple">
                    <div className="stat-number">
                      {reports.filter(r => !r.feedback_text).length}
                    </div>
                    <div className="stat-label">Pending</div>
                  </div>
                </div>
              </div>

              {/* Reports Table */}
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Course</th>
                      <th>Lecturer</th>
                      <th>Stream</th>
                      <th>Date</th>
                      <th>Attendance</th>
                      <th>Topic</th>
                      <th>PRL Feedback</th>
                      <th>PRL</th>
                      <th>Feedback Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => {
                      const attendanceRate = (report.actual_students_present / report.total_students_registered) * 100;
                      const attendanceClass = attendanceRate >= 70 ? 'success' : attendanceRate >= 50 ? 'warning' : 'danger';
                      
                      return (
                        <tr key={report.id} className={report.feedback_text ? 'table-success' : ''}>
                          <td>
                            <strong>{report.course_name}</strong>
                            <br />
                            <small className="text-muted">{report.course_code}</small>
                          </td>
                          <td> {report.lecturer_name}</td>
                          <td>
                            <span className="badge bg-secondary">{report.stream || 'N/A'}</span>
                          </td>
                          <td>
                            {new Date(report.date_of_lecture).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td>
                            <span className={`badge bg-${attendanceClass}`}>
                              {report.actual_students_present}/{report.total_students_registered}
                              <small> ({Math.round(attendanceRate)}%)</small>
                            </span>
                          </td>
                          <td>
                            <span title={report.topic_taught}>
                              {report.topic_taught.length > 40 ? 
                                report.topic_taught.substring(0, 40) + '...' : 
                                report.topic_taught
                              }
                            </span>
                          </td>
                          <td>
                            {report.feedback_text ? (
                              <div>
                                <span className="badge bg-success">✅ Provided</span>
                                <br />
                                <small 
                                  className="text-muted cursor-pointer"
                                  title={report.feedback_text}
                                  onClick={() => alert(`PRL Feedback:\n\n${report.feedback_text}`)}
                                  style={{cursor: 'pointer', textDecoration: 'underline'}}
                                >
                                  View Feedback
                                </small>
                              </div>
                            ) : (
                              <span className="badge bg-warning">Pending</span>
                            )}
                          </td>
                          <td>
                            {report.prl_name ? (
                              <small>👨‍💼 {report.prl_name}</small>
                            ) : (
                              <small className="text-muted">Not assigned</small>
                            )}
                          </td>
                          <td>
                            {report.feedback_date ? (
                              <small>
                                {new Date(report.feedback_date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </small>
                            ) : (
                              <small className="text-muted">N/A</small>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Stream Breakdown */}
              <div className="row mt-4">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h5>Stream Performance Overview</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        {Array.from(new Set(reports.map(r => r.stream))).map(stream => {
                          const streamReports = reports.filter(r => r.stream === stream);
                          const feedbackCount = streamReports.filter(r => r.feedback_text).length;
                          const feedbackRate = streamReports.length > 0 ? (feedbackCount / streamReports.length) * 100 : 0;
                          
                          return (
                            <div key={stream} className="col-md-4 mb-3">
                              <div className="card h-100">
                                <div className="card-body">
                                  <h6>{stream}</h6>
                                  <div className="stream-stats">
                                    <div className="stat-item">
                                      <span className="label">Reports:</span>
                                      <span className="value">{streamReports.length}</span>
                                    </div>
                                    <div className="stat-item">
                                      <span className="label">With Feedback:</span>
                                      <span className="value">{feedbackCount}</span>
                                    </div>
                                    <div className="stat-item">
                                      <span className="label">Feedback Rate:</span>
                                      <span className="value">{Math.round(feedbackRate)}%</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
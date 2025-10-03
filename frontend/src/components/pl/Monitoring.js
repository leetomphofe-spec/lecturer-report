import React, { useState, useEffect } from 'react';
import { getPLReports, getPLCourses } from '../../services/api';
import './PL.css';

const Monitoring = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo('Fetching data...');


      const [reportsRes, coursesRes] = await Promise.all([
        getPLReports().catch(err => {
          console.error('getPLReports failed:', err);
          throw new Error(`Reports: ${err.message}`);
        }),
        getPLCourses().catch(err => {
          console.error(' getPLCourses failed:', err);
          throw new Error(`Courses: ${err.message}`);
        })
      ]);

      console.log('Reports response:', reportsRes);
      console.log('Courses response:', coursesRes);

      // Handle different response structures
      const reportsData = reportsRes?.data || reportsRes || [];
      const coursesData = coursesRes?.data || coursesRes || [];

      setReports(Array.isArray(reportsData) ? reportsData : []);
      setCourses(Array.isArray(coursesData) ? coursesData : []);

      setDebugInfo(`
        Reports: ${reportsData.length} items
        Courses: ${coursesData.length} items
        Last updated: ${new Date().toLocaleTimeString()}
      `);

    } catch (error) {
      console.error('Error in fetchData:', error);
      setError(error.message || 'Failed to load monitoring data');
      setReports([]);
      setCourses([]);
      setDebugInfo(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Load sample data for testing
  const loadSampleData = () => {
    const sampleReports = [
      {
        id: 1,
        course_name: "Web Development",
        lecturer_name: "Dr. Smith",
        lecturer_id: "LEC001",
        date_of_lecture: "2024-01-20",
        actual_students_present: 25,
        total_students_registered: 30,
        feedback_text: "Good session with active participation",
        topic_taught: "React Components"
      },
      {
        id: 2,
        course_name: "Database Systems",
        lecturer_name: "Prof. Johnson",
        lecturer_id: "LEC002",
        date_of_lecture: "2024-01-19",
        actual_students_present: 28,
        total_students_registered: 32,
        feedback_text: "",
        topic_taught: "SQL Queries"
      },
      {
        id: 3,
        course_name: "Network Security",
        lecturer_name: "Dr. Brown",
        lecturer_id: "LEC003",
        date_of_lecture: "2024-01-18",
        actual_students_present: 22,
        total_students_registered: 25,
        feedback_text: "Excellent practical examples",
        topic_taught: "Cryptography"
      }
    ];

    const sampleCourses = [
      {
        id: 1,
        course_name: "Web Development",
        course_code: "DIWA2110",
        assigned_lecturer_id: "LEC001"
      },
      {
        id: 2,
        course_name: "Database Systems",
        course_code: "DBS3010",
        assigned_lecturer_id: "LEC002"
      },
      {
        id: 3,
        course_name: "Network Security",
        course_code: "NS4010",
        assigned_lecturer_id: "LEC003"
      },
      {
        id: 4,
        course_name: "Business Analytics",
        course_code: "BIT2010",
        assigned_lecturer_id: ""
      }
    ];

    setReports(sampleReports);
    setCourses(sampleCourses);
    setDebugInfo('✅ Loaded sample data for testing');
    console.log('Sample data loaded');
  };

  // Calculate statistics safely
  const totalLecturers = new Set(
    reports
      .filter(report => report?.lecturer_id)
      .map(report => report.lecturer_id)
  ).size;

  const totalCourses = courses?.length || 0;
  const totalReports = reports?.length || 0;
  const reportsWithFeedback = reports.filter(report => 
    report?.feedback_text && report.feedback_text.trim() !== ''
  ).length;

  const feedbackRate = totalReports > 0 ? 
    ((reportsWithFeedback / totalReports) * 100).toFixed(1) : 0;
  
  const activeCourses = courses.filter(c => 
    c?.assigned_lecturer_id && c.assigned_lecturer_id !== ''
  ).length;

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading monitoring data...</p>
          <small className="text-muted">{debugInfo}</small>
        </div>
      </div>
    );
  }

  return (
    <div className="monitoring-container">
      {/* Debug Panel */}
      <div className="debug-panel">
        <strong> MONITORING DEBUG INFO</strong>
        <div>Reports: {reports.length} | Courses: {courses.length}</div>
        <div>{debugInfo}</div>
        <div className="debug-actions mt-2">
          <button onClick={loadSampleData} className="btn btn-sm btn-outline-success me-2">
         Load Sample Data
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-warning d-flex justify-content-between align-items-center">
        </div>
      )}

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0"> Program Monitoring Dashboard</h4>
          <div>
            {reports.some(r => r.sample_data) && (
              <span className="badge bg-info me-2">Sample Data</span>
            )}
            <span className="badge bg-secondary">Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
        
        <div className="card-body">
          {/* Statistics Cards */}
          <div className="row">
            <div className="col-md-3">
              <div className="card text-white bg-primary mb-3">
                <div className="card-body">
                  <h5 className="card-title">Total Courses</h5>
                  <p className="card-text display-6">{totalCourses}</p>
                  <small>{activeCourses} active</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-success mb-3">
                <div className="card-body">
                  <h5 className="card-title">Total Lecturers</h5>
                  <p className="card-text display-6">{totalLecturers}</p>
                  <small>Across all streams</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-info mb-3">
                <div className="card-body">
                  <h5 className="card-title">Total Reports</h5>
                  <p className="card-text display-6">{totalReports}</p>
                  <small>Lecture submissions</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-warning mb-3">
                <div className="card-body">
                  <h5 className="card-title">Reports with Feedback</h5>
                  <p className="card-text display-6">{reportsWithFeedback}</p>
                  <small>{feedbackRate}% feedback rate</small>
                </div>
              </div>
            </div>
          </div>

          {/* Program Overview */}
          <div className="mt-4">
            <h5>Program Overview</h5>
            <div className="row">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">Recent Activity</h6>
                  </div>
                  <div className="card-body">
                    {reports.length > 0 ? (
                      <ul className="list-group">
                        {reports.slice(0, 5).map((report) => (
                          <li key={report.id} className="list-group-item">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <strong>{report.course_name || 'Unnamed Course'}</strong>
                                <br />
                                <small className="text-muted">
                                  {report.lecturer_name || 'Unknown Lecturer'}
                                </small>
                                <br />
                                <small className="text-muted">
                                  {report.date_of_lecture ? 
                                    new Date(report.date_of_lecture).toLocaleDateString() : 
                                    'Date not available'
                                  }
                                </small>
                              </div>
                              <span className={`badge ${report.feedback_text ? 'bg-success' : 'bg-secondary'}`}>
                                {report.feedback_text ? '✅' : ''}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-3">
                        <p className="text-muted">No recent activity found</p>
                        <small>No lecture reports have been submitted yet</small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <strong>Feedback Rate:</strong>
                      <div className="progress mt-1">
                        <div 
                          className="progress-bar bg-success" 
                          style={{ width: `${feedbackRate}%` }}
                        >
                          {feedbackRate}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <strong>Active Courses:</strong>
                      <div className="mt-1">
                        <span className="badge bg-primary">{activeCourses} / {totalCourses}</span>
                        <small className="text-muted ms-2">
                          ({totalCourses > 0 ? Math.round((activeCourses / totalCourses) * 100) : 0}% assigned)
                        </small>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <strong>Reporting Compliance:</strong>
                      <div className="mt-1">
                        <span className={`badge ${totalReports > 0 ? 'bg-success' : 'bg-warning'}`}>
                          {totalReports > 0 ? ' Active' : ' No Data'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-top">
                      <small className="text-muted">
                        <strong>Data Summary:</strong><br />
                        • {reports.length} reports across {totalLecturers} lecturers<br />
                        • {reportsWithFeedback} reports with PRL feedback<br />
                        • {courses.length} courses in the system
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Insights */}
          {reports.length > 0 && (
            <div className="mt-4">
              <div className="card">
                <div className="card-header">
                  <h6 className="mb-0"> Performance Insights</h6>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="text-center">
                        <div className="h4 text-primary">{Math.round(feedbackRate)}%</div>
                        <small className="text-muted">Feedback Completion Rate</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-center">
                        <div className="h4 text-success">
                          {reports.reduce((acc, report) => acc + report.actual_students_present, 0)}
                        </div>
                        <small className="text-muted">Total Students Attended</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-center">
                        <div className="h4 text-info">
                          {Math.round(reports.reduce((acc, report) => {
                            const rate = report.actual_students_present / report.total_students_registered;
                            return acc + (isNaN(rate) ? 0 : rate);
                          }, 0) / reports.length * 100)}%
                        </div>
                        <small className="text-muted">Average Attendance Rate</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Monitoring;
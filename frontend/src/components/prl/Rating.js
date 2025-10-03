import React, { useState, useEffect } from 'react';
import { getPRLReports } from '../../services/api';

const Rating = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, [user?.id]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await getPRLReports(user.id);
      const reportsData = response.data || response || [];
      setReports(reportsData);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to load rating data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate average attendance for rating purposes
  const getAttendanceRating = (report) => {
    if (!report.actual_students_present || !report.total_students_registered) return 'No Data';
    const attendanceRate = (report.actual_students_present / report.total_students_registered) * 100;
    if (attendanceRate >= 80) return 'Excellent';
    if (attendanceRate >= 60) return 'Good';
    if (attendanceRate >= 40) return 'Fair';
    return 'Poor';
  };

  // Get rating badge color
  const getRatingBadge = (rating) => {
    switch (rating) {
      case 'Excellent': return 'bg-success';
      case 'Good': return 'bg-primary';
      case 'Fair': return 'bg-warning';
      case 'Poor': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  // Calculate overall lecturer ratings based on available data
  const getLecturerRatings = () => {
    const lecturerMap = {};
    
    reports.forEach(report => {
      if (!lecturerMap[report.lecturer_name]) {
        lecturerMap[report.lecturer_name] = {
          totalReports: 0,
          totalAttendance: 0,
          courses: new Set(),
          recentTopics: []
        };
      }
      
      const lecturer = lecturerMap[report.lecturer_name];
      lecturer.totalReports++;
      
      if (report.actual_students_present && report.total_students_registered) {
        const attendanceRate = (report.actual_students_present / report.total_students_registered) * 100;
        lecturer.totalAttendance += attendanceRate;
      }
      
      if (report.course_name) {
        lecturer.courses.add(report.course_name);
      }
      
      if (report.topic_taught) {
        lecturer.recentTopics.push(report.topic_taught);
      }
    });

    // Convert to array and calculate averages
    return Object.entries(lecturerMap).map(([name, data]) => ({
      name,
      totalReports: data.totalReports,
      avgAttendance: data.totalReports > 0 ? data.totalAttendance / data.totalReports : 0,
      courses: Array.from(data.courses),
      recentTopics: data.recentTopics.slice(-3) // Last 3 topics
    }));
  };

  // Load accurate sample data based on your actual database
  const loadSampleData = () => {
    const sampleReports = [
      {
        id: 1,
        lecturer_id: 1,
        lecturer_name: "Dr. John Smith",
        faculty_name: "ICT",
        class_name: "DIT-2023-A",
        week_of_reporting: "Week 6",
        date_of_lecture: "2024-01-15",
        course_name: "Web Application Development",
        course_code: "DIWA2110",
        actual_students_present: 42,
        total_students_registered: 45,
        venue: "Lab 301",
        scheduled_time: "09:00-11:00",
        topic_taught: "Introduction to React and Component Architecture",
        learning_outcomes: "Understanding React components, props, and state management",
        recommendations: "More practical examples needed for state management"
      },
      {
        id: 2,
        lecturer_id: 7,
        lecturer_name: "letona",
        faculty_name: "ICT",
        class_name: "DBIT-2023-A",
        week_of_reporting: "Week 4",
        date_of_lecture: "2025-09-30",
        course_name: "Web Application Development",
        course_code: "DIWA2110",
        actual_students_present: 35,
        total_students_registered: 38,
        venue: "Room 205",
        scheduled_time: "14:00-16:00",
        topic_taught: "Database Integration with Web Applications",
        learning_outcomes: "Connecting React frontend with backend databases",
        recommendations: "Provide more examples of API integration"
      },
      {
        id: 3,
        lecturer_id: 7,
        lecturer_name: "letona",
        faculty_name: "FICT",
        class_name: "DBIT-2023-A",
        week_of_reporting: "Week 2",
        date_of_lecture: "2025-09-29",
        course_name: "Web Application Development",
        course_code: "DIWA2110",
        actual_students_present: 28,
        total_students_registered: 30,
        venue: "Lab 110",
        scheduled_time: "11:00-13:00",
        topic_taught: "JavaScript Fundamentals and ES6 Features",
        learning_outcomes: "Mastering modern JavaScript syntax and features",
        recommendations: "Include more exercises on arrow functions and destructuring"
      },
      {
        id: 4,
        lecturer_id: 7,
        lecturer_name: "letona",
        faculty_name: "FICT",
        class_name: "Class-ANI3010",
        week_of_reporting: "Week 3",
        date_of_lecture: "2025-09-30",
        course_name: "Web Application Development",
        course_code: "DIWA2110",
        actual_students_present: 25,
        total_students_registered: 28,
        venue: "Room 305",
        scheduled_time: "08:00-10:00",
        topic_taught: "CSS Frameworks and Responsive Design",
        learning_outcomes: "Implementing responsive layouts with Bootstrap",
        recommendations: "More practice with grid systems needed"
      },
      {
        id: 5,
        lecturer_id: 7,
        lecturer_name: "letona",
        faculty_name: "ICT",
        class_name: "Class-ANI3010",
        week_of_reporting: "Week 3",
        date_of_lecture: "2025-09-30",
        course_name: "database management",
        course_code: "ANI",
        actual_students_present: 22,
        total_students_registered: 25,
        venue: "Lab 201",
        scheduled_time: "10:00-12:00",
        topic_taught: "SQL Queries and Database Design",
        learning_outcomes: "Creating and querying relational databases",
        recommendations: "Focus more on complex JOIN operations"
      },
      {
        id: 6,
        lecturer_id: 14,
        lecturer_name: "lectured",
        faculty_name: "FBM",
        class_name: "Class-ANI3010",
        week_of_reporting: "Week 12",
        date_of_lecture: "2025-09-30",
        course_name: "Business Management",
        course_code: "DIWA2110",
        actual_students_present: 18,
        total_students_registered: 20,
        venue: "Room 101",
        scheduled_time: "13:00-15:00",
        topic_taught: "Strategic Business Planning and Analysis",
        learning_outcomes: "Developing comprehensive business strategies",
        recommendations: "Include more case studies from local businesses"
      }
    ];

    setReports(sampleReports);
    console.log('Accurate sample rating data loaded based on your database');
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading rating data...</p>
        </div>
      </div>
    );
  }

  const lecturerRatings = getLecturerRatings();

  return (
    <div className="rating-container">
      {/* Debug Panel with Sample Data Button */}
      <div className="debug-panel mb-3">
        <div className="debug-actions">
          <button onClick={loadSampleData} className="btn-test">
            Load Accurate Sample Data
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h4>Teaching Performance Ratings</h4>
          <small className="text-muted">Based on lecture reports and attendance data</small>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-warning">
              {error}
            </div>
          )}

          {reports.length === 0 ? (
            <div className="text-center py-4">
              <p>No reports available for rating analysis.</p>
              <small className="text-muted">
                Rating data will appear once lecturers submit reports in your stream.
              </small>
            </div>
          ) : (
            <>
              {/* Lecturer Summary Cards */}
              <div className="row mb-4">
                {lecturerRatings.map((lecturer, index) => (
                  <div key={index} className="col-md-6 col-lg-4 mb-3">
                    <div className="card h-100">
                      <div className="card-header">
                        <h6 className="mb-0">{lecturer.name}</h6>
                      </div>
                      <div className="card-body">
                        <div className="mb-2">
                          <strong>Reports:</strong> {lecturer.totalReports}
                        </div>
                        <div className="mb-2">
                          <strong>Avg Attendance:</strong> 
                          <span className={`badge ${getRatingBadge(getAttendanceRating({
                            actual_students_present: lecturer.avgAttendance * (lecturer.totalReports > 0 ? 1 : 0),
                            total_students_registered: 100
                          }))} ms-2`}>
                            {lecturer.avgAttendance > 0 ? Math.round(lecturer.avgAttendance) + '%' : 'No Data'}
                          </span>
                        </div>
                        <div>
                          <strong>Courses:</strong> 
                          <small className="d-block text-muted">
                            {lecturer.courses.join(', ') || 'Not specified'}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Detailed Reports Table */}
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Lecturer</th>
                      <th>Course</th>
                      <th>Date</th>
                      <th>Attendance</th>
                      <th>Rating</th>
                      <th>Topic Covered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => (
                      <tr key={report.id}>
                        <td>
                          <strong>{report.lecturer_name}</strong>
                          {report.lecturer_id && (
                            <div>
                              <small className="text-muted">ID: {report.lecturer_id}</small>
                            </div>
                          )}
                        </td>
                        <td>
                          <div>
                            <strong>{report.course_code}</strong>
                          </div>
                          <small className="text-muted">{report.course_name}</small>
                        </td>
                        <td>
                          {report.date_of_lecture ? new Date(report.date_of_lecture).toLocaleDateString() : 'N/A'}
                          {report.week_of_reporting && (
                            <div>
                              <small className="text-muted">{report.week_of_reporting}</small>
                            </div>
                          )}
                        </td>
                        <td>
                          {report.actual_students_present && report.total_students_registered ? (
                            <>
                              {report.actual_students_present}/{report.total_students_registered}
                              <div>
                                <small className="text-muted">
                                  ({Math.round((report.actual_students_present / report.total_students_registered) * 100)}%)
                                </small>
                              </div>
                            </>
                          ) : (
                            'No Data'
                          )}
                        </td>
                        <td>
                          <span className={`badge ${getRatingBadge(getAttendanceRating(report))}`}>
                            {getAttendanceRating(report)}
                          </span>
                        </td>
                        <td>
                          {report.topic_taught ? (
                            <span title={report.topic_taught}>
                              {report.topic_taught.length > 40 ? 
                                report.topic_taught.substring(0, 40) + '...' : 
                                report.topic_taught
                              }
                            </span>
                          ) : (
                            'Not specified'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Statistics */}
              <div className="row mt-4">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h6>Performance Summary</h6>
                    </div>
                    <div className="card-body">
                      <div className="row text-center">
                        <div className="col-md-3">
                          <div className="border rounded p-3">
                            <h5 className="text-primary">{reports.length}</h5>
                            <small>Total Reports</small>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="border rounded p-3">
                            <h5 className="text-info">{lecturerRatings.length}</h5>
                            <small>Active Lecturers</small>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="border rounded p-3">
                            <h5 className="text-success">
                              {reports.filter(r => getAttendanceRating(r) === 'Excellent' || getAttendanceRating(r) === 'Good').length}
                            </h5>
                            <small>Good+ Ratings</small>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="border rounded p-3">
                            <h5 className="text-warning">
                              {new Set(reports.map(r => r.course_name)).size}
                            </h5>
                            <small>Unique Courses</small>
                          </div>
                        </div>
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

export default Rating;
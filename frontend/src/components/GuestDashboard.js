import React, { useState, useEffect } from 'react';
import { getGuestDashboard, searchReports } from '../services/api';
import { Link } from 'react-router-dom';
import '../styles/GuestDashboard.css';

const GuestDashboard = () => {
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReports: 0,
    totalLecturers: 0,
    totalCourses: 0,
    avgAttendance: 0
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await getGuestDashboard();
      setReports(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (reportsData) => {
    const totalReports = reportsData.length;
    const uniqueLecturers = new Set(reportsData.map(report => report.lecturer_name)).size;
    const uniqueCourses = new Set(reportsData.map(report => report.course_name)).size;
    
    const totalAttendance = reportsData.reduce((sum, report) => 
      sum + (report.actual_students_present / report.total_students_registered), 0);
    const avgAttendance = totalReports > 0 ? (totalAttendance / totalReports * 100).toFixed(1) : 0;

    setStats({
      totalReports,
      totalLecturers: uniqueLecturers,
      totalCourses: uniqueCourses,
      avgAttendance
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await searchReports(searchQuery);
      setReports(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    fetchReports();
  };

  if (loading) return (
    <div className="guest-loading-container">
      <div className="guest-loading-spinner"></div>
      <p>Loading LUCT Reporting System...</p>
    </div>
  );

  return (
    <div className="guest-dashboard">
      {/* Hero Section */}
      <div className="guest-hero">
        <div className="guest-hero-content">
          <h1 className="guest-hero-title">
            LUCT Reporting System
          </h1>
          <div className="guest-hero-actions">
            <Link to="/login" className="guest-btn guest-btn-primary">
               Login
            </Link>
            <Link to="/register" className="guest-btn guest-btn-outline">
              register
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="guest-stats-section">
        <div className="container">
          <h2 className="guest-section-title">System Overview</h2>
          <div className="guest-stats-grid">
            <div className="guest-stat-card">
              <div className="guest-stat-icon"></div>
              <div className="guest-stat-number">{stats.totalReports}</div>
              <div className="guest-stat-label">Lecture Reports</div>
            </div>
            <div className="guest-stat-card">
              <div className="guest-stat-icon"></div>
              <div className="guest-stat-number">{stats.totalLecturers}</div>
              <div className="guest-stat-label">Active Lecturers</div>
            </div>
            <div className="guest-stat-card">
              <div className="guest-stat-icon"></div>
              <div className="guest-stat-number">{stats.totalCourses}</div>
              <div className="guest-stat-label">Courses</div>
            </div>
            <div className="guest-stat-card">
              <div className="guest-stat-icon"></div>
              <div className="guest-stat-number">{stats.avgAttendance}%</div>
              <div className="guest-stat-label">Avg Attendance</div>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Section */}
      <div className="guest-reports-section">
        <div className="container">
          <div className="guest-reports-header">
            <div className="guest-reports-title-section">
              <h2 className="guest-section-title">Recent Lecture Reports</h2>
              <p className="guest-section-subtitle">
                Browse through the latest lecture reports submitted by our faculty members
              </p>
            </div>
            
            <form onSubmit={handleSearch} className="guest-search-form">
              <div className="guest-search-input-group">
                <input
                  type="text"
                  className="guest-search-input"
                  placeholder="Search by course, lecturer, topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="guest-search-btn">
                  Search
                </button>
                {searchQuery && (
                  <button 
                    type="button" 
                    className="guest-reset-btn"
                    onClick={handleResetSearch}
                  >
                    Reset
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="guest-reports-container">
            {reports.length === 0 ? (
              <div className="guest-empty-state">
                <div className="guest-empty-icon"></div>
                <h3>No Reports Found</h3>
                <p>No lecture reports match your search criteria. Try a different search term.</p>
                <button 
                  className="guest-btn guest-btn-primary"
                  onClick={handleResetSearch}
                >
                  Show All Reports
                </button>
              </div>
            ) : (
              <div className="guest-table-container">
                <table className="guest-reports-table">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Lecturer</th>
                      <th>Class</th>
                      <th>Topic Covered</th>
                      <th>Date</th>
                      <th>Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => (
                      <tr key={report.id} className="guest-report-row">
                        <td>
                          <div className="guest-course-info">
                            <strong>{report.course_name}</strong>
                            <span className="guest-course-code">{report.course_code}</span>
                          </div>
                        </td>
                        <td>
                          <div className="guest-lecturer-info">
                            {report.lecturer_name}
                          </div>
                        </td>
                        <td>
                          <span className="guest-class-badge">{report.class_name}</span>
                        </td>
                        <td>
                          <div className="guest-topic-info">
                            {report.topic_taught}
                          </div>
                        </td>
                        <td>
                          <div className="guest-date-info">
                            {new Date(report.date_of_lecture).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </td>
                        <td>
                          <div className="guest-attendance-info">
                            <span className={`guest-attendance-badge ${
                              (report.actual_students_present / report.total_students_registered) > 0.7 ? 'high' :
                              (report.actual_students_present / report.total_students_registered) > 0.5 ? 'medium' : 'low'
                            }`}>
                              {report.actual_students_present}/{report.total_students_registered}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="guest-features-section">
            <h2 className="guest-section-title">System Features</h2>
            <div className="guest-features-grid">
              <div className="guest-feature-card">
                <div className="guest-feature-icon"></div>
                <h4>Lecture Reporting</h4>
                <p>Lecturers can easily submit detailed reports for each lecture session with attendance and topic coverage.</p>
              </div>
              <div className="guest-feature-card">
                <div className="guest-feature-icon"></div>
                <h4>Real-time Monitoring</h4>
                <p>Monitor teaching activities, attendance trends, and academic performance across all programs.</p>
              </div>
              <div className="guest-feature-card">
                <div className="guest-feature-icon"></div>
                <h4>Quality Rating</h4>
                <p>Students can rate lectures and provide feedback to help improve teaching quality.</p>
              </div>
              
            </div>
          </div>

          {/* User Roles Section */}
          <div className="guest-roles-section">
            <h2 className="guest-section-title">User Roles</h2>
            <div className="guest-roles-grid">
              <div className="guest-role-card">
                <h4>Students</h4>
                <ul>
                  <li>View lecture reports</li>
                  <li>Rate lectures</li>
                  <li>Monitor course progress</li>
                  <li>Enroll in classes</li>
                </ul>
              </div>
              <div className="guest-role-card">
                <h4>Lecturers</h4>
                <ul>
                  <li>Submit lecture reports</li>
                  <li>Manage classes</li>
                  <li>View student ratings</li>
                  <li>Monitor reporting statistics</li>
                </ul>
              </div>
              <div className="guest-role-card">
                <h4> Principal Lecturers</h4>
                <ul>
                  <li>Review reports in their stream</li>
                  <li>Provide feedback to lecturers</li>
                  <li>Monitor teaching quality</li>
                  <li>Stream analytics</li>
                </ul>
              </div>
              <div className="guest-role-card">
                <h4> Program Leaders</h4>
                <ul>
                  <li>Manage courses and classes</li>
                  <li>Assign lecturers</li>
                  <li>View PRL feedback</li>
                  <li>Program-wide analytics</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestDashboard;
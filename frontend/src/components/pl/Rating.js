import React, { useState, useEffect } from 'react';
import { getPLReports } from '../../services/api';
import './PL.css';

const Rating = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo('Fetching rating data...');

      console.log('Fetching reports for rating analytics...');
      
      const response = await getPLReports();
      console.log('📈 Rating API response:', response);

      const reportsData = response?.data || response || [];
      setReports(Array.isArray(reportsData) ? reportsData : []);
      
      setDebugInfo(`Loaded ${reportsData.length} reports for analysis`);

    } catch (error) {
      console.error('❌ Error fetching rating data:', error);
      setError(`Failed to load rating data: ${error.message}`);
      setReports([]);
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
        feedback_text: "Excellent student engagement",
        topic_taught: "React Components"
      },
      {
        id: 2,
        course_name: "Web Development",
        lecturer_name: "Dr. letona",
        lecturer_id: "LEC001",
        date_of_lecture: "2024-01-27",
        actual_students_present: 28,
        total_students_registered: 30,
        feedback_text: "xcvb",
        topic_taught: "State Management"
      },
      {
        id: 3,
        course_name: "Database Systems",
        lecturer_name: "Prof. Johnson",
        lecturer_id: "LEC002",
        date_of_lecture: "2024-01-19",
        actual_students_present: 22,
        total_students_registered: 32,
        feedback_text: "",
        topic_taught: "SQL Basics"
      },
      {
        id: 4,
        course_name: "Database Systems",
        lecturer_name: "Prof. Johnson",
        lecturer_id: "LEC002",
        date_of_lecture: "2024-01-26",
        actual_students_present: 26,
        total_students_registered: 32,
        feedback_text: "Improved student participation",
        topic_taught: "Database Design"
      },
      {
        id: 5,
        course_name: "Network Security",
        lecturer_name: "Dr. Brown",
        lecturer_id: "LEC003",
        date_of_lecture: "2024-01-18",
        actual_students_present: 18,
        total_students_registered: 25,
        feedback_text: "Complex topic well explained",
        topic_taught: "Cryptography"
      },
      {
        id: 6,
        course_name: "Business Analytics",
        lecturer_name: "Dr. Wilson",
        lecturer_id: "LEC004",
        date_of_lecture: "2024-01-17",
        actual_students_present: 20,
        total_students_registered: 22,
        feedback_text: "Outstanding real-world applications",
        topic_taught: "Data Visualization"
      }
    ];

    setReports(sampleReports);
    setDebugInfo('✅ Loaded sample rating data for testing');
    console.log('🧪 Sample rating data loaded:', sampleReports);
  };

  // Calculate program-wide statistics safely
  const totalAttendance = reports.reduce((sum, report) => 
    sum + (report.actual_students_present || 0), 0);
  
  const totalCapacity = reports.reduce((sum, report) => 
    sum + (report.total_students_registered || 0), 0);
  
  const overallAttendanceRate = totalCapacity > 0 ? 
    (totalAttendance / totalCapacity * 100).toFixed(1) : 0;

  const totalLectures = reports.length;
  const reportsWithFeedback = reports.filter(r => r.feedback_text && r.feedback_text.trim() !== '').length;
  const feedbackCoverage = totalLectures > 0 ? Math.round((reportsWithFeedback / totalLectures) * 100) : 0;

  // Get unique lecturers with their performance data
  const lecturerPerformance = Array.from(new Set(reports.map(r => r.lecturer_name)))
    .filter(lecturer => lecturer) // Remove null/undefined
    .map(lecturer => {
      const lecturerReports = reports.filter(r => r.lecturer_name === lecturer);
      const totalLecturerAttendance = lecturerReports.reduce((sum, r) => 
        sum + (r.actual_students_present || 0), 0);
      const totalLecturerCapacity = lecturerReports.reduce((sum, r) => 
        sum + (r.total_students_registered || 0), 0);
      
      const avgAttendance = totalLecturerCapacity > 0 ? 
        (totalLecturerAttendance / totalLecturerCapacity * 100) : 0;
      
      const feedbackCount = lecturerReports.filter(r => 
        r.feedback_text && r.feedback_text.trim() !== ''
      ).length;

      // Performance rating based on multiple factors
      const attendanceScore = avgAttendance / 100;
      const feedbackScore = lecturerReports.length > 0 ? feedbackCount / lecturerReports.length : 0;
      const consistencyScore = Math.min(lecturerReports.length / 5, 1); // Bonus for more reports
      
      const overallScore = (attendanceScore * 0.6 + feedbackScore * 0.3 + consistencyScore * 0.1) * 100;

      return {
        name: lecturer,
        reportsCount: lecturerReports.length,
        avgAttendance,
        feedbackCount,
        overallScore,
        performanceLevel: overallScore >= 80 ? 'Excellent' :
                         overallScore >= 70 ? 'Good' :
                         overallScore >= 60 ? 'Satisfactory' : 'Needs Improvement'
      };
    })
    .sort((a, b) => b.overallScore - a.overallScore); // Sort by performance

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading rating analytics...</p>
          <small className="text-muted">{debugInfo}</small>
        </div>
      </div>
    );
  }

  return (
    <div className="rating-container">
      {/* Debug Panel */}
      <div className="debug-panel">
        <strong>📊 RATING ANALYTICS DEBUG</strong>
        <div>Reports: {reports.length} | Lecturers: {lecturerPerformance.length}</div>
        <div>{debugInfo}</div>
        <div className="debug-actions mt-2">
          <button onClick={loadSampleData} className="btn btn-sm btn-outline-success me-2">
            🧪 Load Sample Data
          </button>
          <button onClick={fetchReports} className="btn btn-sm btn-outline-primary">
            🔄 Refresh Data
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0">📈 Program-wide Rating & Analytics</h4>
          <div>
            {reports.some(r => r.sample_data) && (
              <span className="badge bg-info me-2">Sample Data</span>
            )}
            <span className="badge bg-secondary">Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
        
        <div className="card-body">
          {/* Key Metrics */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card bg-primary text-white">
                <div className="card-body text-center">
                  <h5>Overall Attendance Rate</h5>
                  <div className="display-4">{overallAttendanceRate}%</div>
                  <small>
                    {totalAttendance} / {totalCapacity} students
                  </small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-success text-white">
                <div className="card-body text-center">
                  <h5>Total Lectures</h5>
                  <div className="display-4">{totalLectures}</div>
                  <small>Across all courses</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-info text-white">
                <div className="card-body text-center">
                  <h5>Feedback Coverage</h5>
                  <div className="display-4">{feedbackCoverage}%</div>
                  <small>
                    {reportsWithFeedback} / {totalLectures} reports
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Distribution */}
          {lecturerPerformance.length > 0 && (
            <div className="row mb-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">🎯 Performance Distribution</h6>
                  </div>
                  <div className="card-body">
                    <div className="row text-center">
                      <div className="col-md-3">
                        <div className="text-success">
                          <div className="h3">
                            {lecturerPerformance.filter(l => l.performanceLevel === 'Excellent').length}
                          </div>
                          <small>Excellent</small>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="text-primary">
                          <div className="h3">
                            {lecturerPerformance.filter(l => l.performanceLevel === 'Good').length}
                          </div>
                          <small>Good</small>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="text-warning">
                          <div className="h3">
                            {lecturerPerformance.filter(l => l.performanceLevel === 'Satisfactory').length}
                          </div>
                          <small>Satisfactory</small>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="text-danger">
                          <div className="h3">
                            {lecturerPerformance.filter(l => l.performanceLevel === 'Needs Improvement').length}
                          </div>
                          <small>Needs Improvement</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lecturer Performance Table */}
          <h5>👨‍🏫 Lecturer Performance Overview</h5>
          {lecturerPerformance.length === 0 ? (
            <div className="text-center py-5"> </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Lecturer</th>
                    <th>Total Reports</th>
                    <th>Avg Attendance</th>
                    <th>Feedback Received</th>
                    <th>Overall Score</th>
                    <th>Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {lecturerPerformance.map((lecturer, index) => (
                    <tr key={lecturer.name}>
                      <td>
                        <strong>{lecturer.name}</strong>
                      </td>
                      <td>
                        <span className="badge bg-secondary">{lecturer.reportsCount}</span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
                            <div 
                              className={`progress-bar ${
                                lecturer.avgAttendance >= 80 ? 'bg-success' :
                                lecturer.avgAttendance >= 60 ? 'bg-primary' :
                                lecturer.avgAttendance >= 40 ? 'bg-warning' : 'bg-danger'
                              }`}
                              style={{ width: `${Math.min(lecturer.avgAttendance, 100)}%` }}
                            ></div>
                          </div>
                          <span>{lecturer.avgAttendance.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-info">
                          {lecturer.feedbackCount} / {lecturer.reportsCount}
                        </span>
                      </td>
                      <td>
                        <strong>{lecturer.overallScore.toFixed(1)}%</strong>
                      </td>
                      <td>
                        <span className={`badge ${
                          lecturer.performanceLevel === 'Excellent' ? 'bg-success' :
                          lecturer.performanceLevel === 'Good' ? 'bg-primary' :
                          lecturer.performanceLevel === 'Satisfactory' ? 'bg-warning' : 'bg-danger'
                        }`}>
                          {lecturer.performanceLevel}
                          {index === 0 && lecturerPerformance.length > 1 && ''}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Additional Insights */}
          {lecturerPerformance.length > 0 && (
            <div className="row mt-4">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0"> Quick Insights</h6>
                  </div>
                  <div className="card-body">
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <strong>Top Performer:</strong> {lecturerPerformance[0]?.name} 
                        <span className="badge bg-success ms-2">🏆</span>
                      </li>
                      <li className="mb-2">
                        <strong>Average Lecturer Score:</strong> {(
                          lecturerPerformance.reduce((sum, l) => sum + l.overallScore, 0) / 
                          lecturerPerformance.length
                        ).toFixed(1)}%
                      </li>
                      <li className="mb-2">
                        <strong>Total Lecturers Analyzed:</strong> {lecturerPerformance.length}
                      </li>
                      <li>
                        <strong>Data Period:</strong> Based on {totalLectures} lecture reports
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">Recommendations</h6>
                  </div>
                  <div className="card-body">
                    {lecturerPerformance.some(l => l.performanceLevel === 'Needs Improvement') ? (
                      <ul className="list-unstyled">
                        <li className="mb-1">• Consider additional training for lecturers with lower scores</li>
                        <li className="mb-1">• Review feedback mechanisms for better coverage</li>
                        <li className="mb-1">• Share best practices from top performers</li>
                      </ul>
                    ) : (
                      <p className="text-success mb-0">
                        <strong> Excellent program performance!</strong><br />
                        All lecturers are meeting or exceeding expectations.
                      </p>
                    )}
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

export default Rating;
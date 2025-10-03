import React, { useState, useEffect } from 'react';
import { getLecturerReports } from '../../services/api';
import './Lecturer.css'; // Import the CSS

const Reports = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await getLecturerReports(user.id);
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading reports...</div>;

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h4>My Reports</h4>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>
      <div className="card-body">
        {reports.length === 0 ? (
          <p>No reports submitted yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Class</th>
                  <th>Week</th>
                  <th>Date</th>
                  <th>Attendance</th>
                  <th>Topic</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.course_name}</td>
                    <td>{report.class_name}</td>
                    <td>{report.week_of_reporting}</td>
                    <td>{new Date(report.date_of_lecture).toLocaleDateString()}</td>
                    <td>{report.actual_students_present}/{report.total_students_registered}</td>
                    <td>{report.topic_taught}</td>
                    <td>{new Date(report.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
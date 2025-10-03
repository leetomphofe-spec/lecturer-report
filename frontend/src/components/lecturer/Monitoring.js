import React, { useState, useEffect } from 'react';
import { getLecturerMonitoring } from '../../services/api';
import './Lecturer.css'; // Import the CSS

const Monitoring = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getLecturerMonitoring(user.id);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading monitoring data...</div>;
  if (!stats) return <div>No data available</div>;

  return (
    <div className="card">
      <div className="card-header">
        <h4>Reporting Statistics</h4>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-3">
            <div className="card text-white bg-primary mb-3">
              <div className="card-body">
                <h5 className="card-title">Total Reports</h5>
                <p className="card-text display-6">{stats.total_reports || 0}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-success mb-3">
              <div className="card-body">
                <h5 className="card-title">Avg Attendance</h5>
                <p className="card-text display-6">
                  {stats.avg_attendance ? Math.round(stats.avg_attendance) : 0}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-info mb-3">
              <div className="card-body">
                <h5 className="card-title">First Report</h5>
                <p className="card-text">
                  {stats.first_report ? new Date(stats.first_report).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-warning mb-3">
              <div className="card-body">
                <h5 className="card-title">Last Report</h5>
                <p className="card-text">
                  {stats.last_report ? new Date(stats.last_report).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;
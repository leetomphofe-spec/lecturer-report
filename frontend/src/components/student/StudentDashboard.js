import React, { useState } from 'react';
import { logout } from '../../utils/auth';
import Monitoring from './Monitoring';
import Rating from './Rating';
import Enrollment from './Enrollment';
import './Student.css'; // Import the Student CSS

const StudentDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="student-dashboard">
      {/* Main Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark student-navbar">
        <div className="container">
          <span className="navbar-brand">Student Dashboard</span>
          
          {/* Navigation Links */}
          <div className="navbar-collapse">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <button 
                  className={`nav-link student-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  📊 Dashboard
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link student-nav-btn ${activeTab === 'enrollment' ? 'active' : ''}`}
                  onClick={() => setActiveTab('enrollment')}
                >
                  📚 My Classes
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link student-nav-btn ${activeTab === 'monitoring' ? 'active' : ''}`}
                  onClick={() => setActiveTab('monitoring')}
                >
                  📈 Monitoring
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link student-nav-btn ${activeTab === 'rating' ? 'active' : ''}`}
                  onClick={() => setActiveTab('rating')}
                >
                  ⭐ Rating
                </button>
              </li>
            </ul>
          </div>

          {/* User Info and Logout */}
          <div className="navbar-nav ms-auto">
            <span className="navbar-text me-3">Welcome, {user?.name}</span>
            <button className="btn student-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="container mt-4">
        <div className="student-content-area">
          {activeTab === 'dashboard' && (
            <div className="student-dashboard-overview student-fade-in">
              <div className="student-dashboard-header">
                <h4>👋 Welcome, {user?.name}</h4>
              </div>
              <div className="student-dashboard-body">
                <p>Welcome to your Student Dashboard. Here's what you can do:</p>
                <ul>
                  <li>📚 Enroll in and manage your classes</li>
                  <li>📈 Monitor lecture reports from your enrolled classes</li>
                  <li>⭐ Rate lectures and provide feedback to lecturers</li>
                  <li>📊 Track your course progress and attendance</li>
                  <li>👨‍🏫 View lecturer information and contact details</li>
                  <li>📋 Access learning materials and resources</li>
                </ul>
                
                <div className="row mt-4">
                  <div className="col-md-6">
                    <div className="card bg-light border-0">
                      <div className="card-body">
                        <h5 className="card-title">🎯 Quick Stats</h5>
                        <div className="row text-center">
                          <div className="col-4">
                            <div className="text-primary fw-bold fs-3">4</div>
                            <small className="text-muted">Courses</small>
                          </div>
                          <div className="col-4">
                            <div className="text-success fw-bold fs-3">12</div>
                            <small className="text-muted">Reports</small>
                          </div>
                          <div className="col-4">
                            <div className="text-info fw-bold fs-3">8</div>
                            <small className="text-muted">Ratings</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card bg-light border-0">
                      <div className="card-body">
                        <h5 className="card-title">📅 Recent Activity</h5>
                        <div className="small">
                          <div className="mb-2">✅ Enrolled in Web Development</div>
                          <div className="mb-2">📊 3 new lecture reports available</div>
                          <div className="mb-2">⭐ 2 lectures pending your rating</div>
                          <div className="mb-2">🎓 92% overall attendance rate</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'enrollment' && <Enrollment user={user} />}
          {activeTab === 'monitoring' && <Monitoring user={user} />}
          {activeTab === 'rating' && <Rating user={user} />}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
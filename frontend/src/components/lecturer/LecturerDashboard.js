import React, { useState } from 'react';
import { logout } from '../../utils/auth';
import Classes from './Classes';
import Reports from './Reports';
import ReportForm from './ReportForm';
import Monitoring from './Monitoring';
import Rating from './Rating';
import './Lecturer.css'; // Import the CSS

const LecturerDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="lecturer-dashboard">
      {/* Main Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark lecturer-navbar">
        <div className="container">
          <span className="navbar-brand">Lecturer Dashboard</span>
          
          {/* Navigation Links */}
          <div className="navbar-collapse">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <button 
                  className={`nav-link lecturer-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  Dashboard
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link lecturer-nav-btn ${activeTab === 'classes' ? 'active' : ''}`}
                  onClick={() => setActiveTab('classes')}
                >
                  My Classes
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link lecturer-nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reports')}
                >
                 Reports
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link lecturer-nav-btn ${activeTab === 'new-report' ? 'active' : ''}`}
                  onClick={() => setActiveTab('new-report')}
                >
                   New Report
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link lecturer-nav-btn ${activeTab === 'monitoring' ? 'active' : ''}`}
                  onClick={() => setActiveTab('monitoring')}
                >
                   Monitoring
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link lecturer-nav-btn ${activeTab === 'rating' ? 'active' : ''}`}
                  onClick={() => setActiveTab('rating')}
                >
                  Ratings
                </button>
              </li>
            </ul>
          </div>

          {/* User Info and Logout */}
          <div className="navbar-nav ms-auto">
            <span className="navbar-text me-3">Welcome, {user?.name}</span>
            <button className="btn lecturer-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="container mt-4">
        <div className="lecturer-content-area">
          {activeTab === 'dashboard' && (
            <div className="lecturer-dashboard-overview lecturer-fade-in">
              <div className="lecturer-dashboard-header">
                <h4> Welcome, {user?.name}</h4>
              </div>
              <div className="lecturer-dashboard-body">
                <p>Welcome to your Lecturer Dashboard. Here's what you can do:</p>
                <ul>
                  <li> Manage your classes and view student enrollment</li>
                  <li> Create and submit lecture reports</li>
                  <li> View and manage your submitted reports</li>
                  <li> Monitor your reporting statistics and performance</li>
                  <li> View student ratings and feedback</li>
                  <li> Track student attendance and progress</li>
                </ul>
                
                <div className="row mt-4">
                  <div className="col-md-6">
                    <div className="card bg-light border-0">
                      <div className="card-body">
                        <h5 className="card-title"> Quick Stats</h5>
                        <div className="row text-center">
                          <div className="col-4">
                            <div className="text-primary fw-bold fs-3">5</div>
                            <small className="text-muted">Classes</small>
                          </div>
                          <div className="col-4">
                            <div className="text-success fw-bold fs-3">24</div>
                            <small className="text-muted">Reports</small>
                          </div>
                          <div className="col-4">
                            <div className="text-info fw-bold fs-3">4.2</div>
                            <small className="text-muted">Avg Rating</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card bg-light border-0">
                      <div className="card-body">
                        <h5 className="card-title"> Recent Activity</h5>
                        <div className="small">
                          <div className="mb-2">Submitted Web Development report</div>
                          <div className="mb-2"> 15 students attended last lecture</div>
                          <div className="mb-2"> Received 4 new ratings</div>
                          <div className="mb-2"> 3 students enrolled in Database Systems</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'classes' && <Classes user={user} />}
          {activeTab === 'reports' && <Reports user={user} />}
          {activeTab === 'new-report' && <ReportForm user={user} />}
          {activeTab === 'monitoring' && <Monitoring user={user} />}
          {activeTab === 'rating' && <Rating user={user} />}
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboard;
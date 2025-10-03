import React, { useState } from 'react';
import { logout } from '../../utils/auth';
import Courses from './Courses';
import Reports from './Reports';
import Monitoring from './Monitoring';
import Rating from './Rating';
import Classes from './Classes';
import './PRL.css'; // Import the PRL CSS

const PRLDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'courses', name: 'Courses' },
    { id: 'reports', name: 'Reports' },
    { id: 'monitoring', name: 'Monitoring' },
    { id: 'rating', name: 'Rating' },
    { id: 'classes', name: 'Classes' }
  ];

  return (
    <div className="prl-dashboard">
      {/* Main Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark prl-navbar">
        <div className="container">
          <span className="navbar-brand">Principal Lecturer Dashboard</span>
          
          {/* Navigation Links */}
          <div className="navbar-collapse">
            <ul className="navbar-nav me-auto">
              {tabs.map(tab => (
                <li key={tab.id} className="nav-item">
                  <button 
                    className={`nav-link prl-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* User Info and Logout */}
          <div className="navbar-nav ms-auto">
            <span className="navbar-text me-3">Welcome, {user?.name}</span>
            <button className="btn prl-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="container mt-4">
        <div className="prl-content-area">
          {activeTab === 'dashboard' && (
            <div className="prl-dashboard-overview prl-fade-in">
              <div className="prl-dashboard-header">
                <h4>Welcome, {user?.name}</h4>
              </div>
              <div className="prl-dashboard-body">
                <p>Welcome to your Principal Lecturer Dashboard. Here's what you can manage in your academic stream:</p>
                <ul>
                  <li>View courses and lectures in your stream</li>
                  <li>Review lecture reports and provide feedback</li>
                  <li>Monitor teaching activities and performance</li>
                  <li>Analyze teaching quality ratings</li>
                  <li>Oversee class assignments and management</li>
                  <li>Track lecturer performance metrics</li>
                  <li>Generate stream-wide analytics</li>
                  <li>Provide guidance and recommendations</li>
                </ul>
                
                <div className="row mt-4">
                  <div className="col-md-6">
                    <div className="card bg-light border-0">
                      <div className="card-body">
                        <h5 className="card-title">Quick Stats</h5>
                        <div className="row text-center">
                          <div className="col-4">
                            <div className="text-primary fw-bold fs-3">8</div>
                            <small className="text-muted">Courses</small>
                          </div>
                          <div className="col-4">
                            <div className="text-success fw-bold fs-3">6</div>
                            <small className="text-muted">Lecturers</small>
                          </div>
                          <div className="col-4">
                            <div className="text-info fw-bold fs-3">18</div>
                            <small className="text-muted">Classes</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card bg-light border-0">
                      <div className="card-body">
                        <h5 className="card-title">Recent Activity</h5>
                        <div className="small">
                          <div className="mb-2">• 3 new reports submitted</div>
                          <div className="mb-2">• 2 feedback requests pending</div>
                          <div className="mb-2">• 85% average attendance rate</div>
                          <div className="mb-2">• 4.2 average teaching rating</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-12">
                    <div className="card bg-primary text-white">
                      <div className="card-body">
                        <h5 className="card-title">Quick Actions</h5>
                        <div className="row text-center">
                          <div className="col-md-3 mb-2">
                            <button 
                              className="btn btn-light btn-sm w-100"
                              onClick={() => setActiveTab('reports')}
                            >
                              Review Reports
                            </button>
                          </div>
                          <div className="col-md-3 mb-2">
                            <button 
                              className="btn btn-light btn-sm w-100"
                              onClick={() => setActiveTab('monitoring')}
                            >
                              View Analytics
                            </button>
                          </div>
                          <div className="col-md-3 mb-2">
                            <button 
                              className="btn btn-light btn-sm w-100"
                              onClick={() => setActiveTab('courses')}
                            >
                              Check Courses
                            </button>
                          </div>
                          <div className="col-md-3 mb-2">
                            <button 
                              className="btn btn-light btn-sm w-100"
                              onClick={() => setActiveTab('rating')}
                            >
                              See Ratings
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'courses' && <Courses user={user} />}
          {activeTab === 'reports' && <Reports user={user} />}
          {activeTab === 'monitoring' && <Monitoring user={user} />}
          {activeTab === 'rating' && <Rating user={user} />}
          {activeTab === 'classes' && <Classes user={user} />}
        </div>
      </div>
    </div>
  );
};

export default PRLDashboard;
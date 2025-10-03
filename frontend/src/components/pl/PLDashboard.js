import React, { useState } from 'react';
import { logout } from '../../utils/auth';
import Courses from './Courses';
import Reports from './Reports';
import Monitoring from './Monitoring';
import Classes from './Classes';
import Lectures from './Lectures';
import Rating from './Rating';
import ClassManagement from './ClassManagement';
import './PL.css'; // Import the PL CSS

const PLDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'courses', name: 'Courses' },
    { id: 'class-management', name: 'Class Management' },
    { id: 'reports', name: 'Reports' },
    { id: 'monitoring', name: 'Monitoring' },
    { id: 'classes', name: 'Classes' },
    { id: 'lectures', name: 'Lectures' },
    { id: 'rating', name: 'Rating' }
  ];

  return (
    <div className="pl-dashboard">
      {/* Main Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark pl-navbar">
        <div className="container">
          <span className="navbar-brand">Program Leader Dashboard</span>
          
          {/* Navigation Links */}
          <div className="navbar-collapse">
            <ul className="navbar-nav me-auto">
              {tabs.map(tab => (
                <li key={tab.id} className="nav-item">
                  <button 
                    className={`nav-link pl-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
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
            <button className="btn pl-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="container mt-4">
        <div className="pl-content-area">
          {activeTab === 'dashboard' && (
            <div className="pl-dashboard-overview pl-fade-in">
              <div className="pl-dashboard-header">
                <h4>Welcome, {user?.name}</h4>
              </div>
              <div className="pl-dashboard-body">
                <p>Welcome to the Program Leader Dashboard. Here's what you can manage:</p>
                <ul>
                  <li>Manage courses and assign lecturers</li>
                  <li>Assign classes to lecturers</li>
                  <li>View reports with PRL feedback</li>
                  <li>Monitor overall program performance</li>
                  <li>Manage classes and lecturers</li>
                  <li>Review rating data across the program</li>
                  <li>Track program analytics and metrics</li>
                  <li>Monitor lecturer performance</li>
                </ul>
                
                <div className="row mt-4">
                  <div className="col-md-6">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h5>Quick Stats</h5>
                        <div className="row text-center">
                          <div className="col-4">
                            <div className="text-primary fw-bold fs-3">12</div>
                            <small className="text-muted">Courses</small>
                          </div>
                          <div className="col-4">
                            <div className="text-success fw-bold fs-3">8</div>
                            <small className="text-muted">Lecturers</small>
                          </div>
                          <div className="col-4">
                            <div className="text-info fw-bold fs-3">25</div>
                            <small className="text-muted">Classes</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h5>Recent Activity</h5>
                        <div className="small">
                          <div>• New course added: Web Development</div>
                          <div>• 5 reports submitted today</div>
                          <div>• 3 classes assigned to lecturers</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'courses' && <Courses user={user} />}
          {activeTab === 'class-management' && <ClassManagement user={user} />}
          {activeTab === 'reports' && <Reports user={user} />}
          {activeTab === 'monitoring' && <Monitoring user={user} />}
          {activeTab === 'classes' && <Classes user={user} />}
          {activeTab === 'lectures' && <Lectures user={user} />}
          {activeTab === 'rating' && <Rating user={user} />}
        </div>
      </div>
    </div>
  );
};

export default PLDashboard;
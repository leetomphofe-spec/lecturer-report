import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GuestDashboard from './components/GuestDashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import StudentDashboard from './components/student/StudentDashboard';
import LecturerDashboard from './components/lecturer/LecturerDashboard';
import PRLDashboard from './components/prl/PRLDashboard';
import PLDashboard from './components/pl/PLDashboard';
import { getCurrentUser } from './utils/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <p>Loading LUCT Reporting System...</p>
    </div>
  );

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<GuestDashboard />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          
          {/* Protected Routes */}
          <Route 
            path="/student" 
            element={user?.role === 'student' ? <StudentDashboard user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/lecturer" 
            element={user?.role === 'lecturer' ? <LecturerDashboard user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/prl" 
            element={user?.role === 'prl' ? <PRLDashboard user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/pl" 
            element={user?.role === 'pl' ? <PLDashboard user={user} /> : <Navigate to="/login" />} 
          />
        </Routes>
        
        {/* Footer */}
        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-section">
              <h4>LUCT Reporting System</h4>
            </div>
            
            
            <div className="footer-section">
              <h5>User Roles</h5>
              <ul>
                <li>Students, Lecturers</li>
                <li>PRL and PL </li>
                <li></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h5>Contact Info</h5>
              <div className="contact-info">
                <p> Limkokwing University, Lesotho</p>
                <p>+266 2231 2132</p>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 Limkokwing University of Creative Technology - Lesotho. All rights reserved.</p>
            
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
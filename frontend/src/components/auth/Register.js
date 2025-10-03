import React, { useState } from 'react';
import { register } from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import './auth.css';

const Register = ({ setUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    faculty: 'ICT'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await register(formData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      // Redirect based on role
      switch(user.role) {
        case 'student':
          navigate('/student');
          break;
        case 'lecturer':
          navigate('/lecturer');
          break;
        case 'prl':
          navigate('/prl');
          break;
        case 'pl':
          navigate('/pl');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      alert('Registration failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="guest-layout">
      {/* Hero Section */}
      <div className="guest-hero">
        <div className="guest-hero-content">
          <h1 className="guest-hero-title">
            LUCT Reporting System
          </h1>
          <div className="guest-hero-actions">
            <Link to="/login" className="guest-btn guest-btn-outline">
              Login
            </Link>

          </div>
        </div>
      </div>

      {/* Register Form Section */}
      <div className="auth-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="auth-card">
                <div className="auth-header">
                  <h3>Create Account</h3>
                  <p>Join our educational platform</p>
                </div>
                <div className="auth-body">
                  <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Create a strong password"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Role</label>
                      <select
                        className="form-control"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                      >
                        <option value="student">Student</option>
                        <option value="lecturer">Lecturer</option>
                        <option value="prl">Principal Lecturer</option>
                        <option value="pl">Program Leader</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Faculty</label>
                      <select
                        className="form-control"
                        name="faculty"
                        value={formData.faculty}
                        onChange={handleChange}
                        required
                      >
                        <option value="ICT">Faculty of Information & Communication Technology</option>
                        <option value="Business">Faculty of Business</option>
                        <option value="Law">Faculty of Law</option>
                        <option value="Education">Faculty of Education</option>
                        <option value="Health">Faculty of Health Sciences</option>
                        <option value="Engineering">Faculty of Engineering</option>
                      </select>
                    </div>
                    <button 
                      type="submit" 
                      className="auth-btn"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="loading-dots">Creating Account</span>
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  </form>
                  <div className="auth-link">
                    <p>Already have an account? <a href="/login">Sign in here</a></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
import React, { useState } from 'react';
import { login } from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import './auth.css';

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
      const response = await login(formData);
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
      alert('Login failed: ' + (error.response?.data?.message || error.message));
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

            <Link to="/register" className="guest-btn guest-btn-outline">
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="auth-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="auth-card">
                <div className="auth-header">
                  <h3>Welcome Back</h3>
                  <p>Sign in to your account</p>
                </div>
                <div className="auth-body">
                  <form onSubmit={handleSubmit} className="auth-form">
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
                        placeholder="Enter your password"
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="auth-btn"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="loading-dots">Login In</span>
                        </>
                      ) : (
                        'Login'
                      )}
                    </button>
                  </form>
                  <div className="auth-link">
                    <p>Don't have an account? <a href="/register">Create one here</a></p>
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

export default Login;
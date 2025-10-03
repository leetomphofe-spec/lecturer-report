import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

// Create Auth Context
const AuthContext = React.createContext();

// Auth Provider Component (should be in a separate file, but including for context)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const login = (userData) => {
    setUser(userData);
    setUserRole(userData.role);
  };

  const logout = () => {
    setUser(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Main Navbar Component
const Navbar = () => {
  const { user, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenu(false);
  };

  // Student Navigation Links
  const studentLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/monitoring', label: 'Monitoring', icon: '👀' },
    { path: '/rating', label: 'Rating', icon: '⭐' },
    { path: '/reports', label: 'My Reports', icon: '📋' }
  ];

  // Lecturer Navigation Links
  const lecturerLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/classes', label: 'My Classes', icon: '🏫' },
    { path: '/reports', label: 'Reports', icon: '📋' },
    { path: '/create-report', label: 'Create Report', icon: '✏️' },
    { path: '/monitoring', label: 'Monitoring', icon: '👀' },
    { path: '/rating', label: 'Rating', icon: '⭐' }
  ];

  // Principal Lecturer Navigation Links
  const principalLecturerLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/courses', label: 'Courses', icon: '📚' },
    { path: '/reports', label: 'Reports', icon: '📋' },
    { path: '/monitoring', label: 'Monitoring', icon: '👀' },
    { path: '/rating', label: 'Rating', icon: '⭐' },
    { path: '/classes', label: 'Classes', icon: '🏫' }
  ];

  // Program Leader Navigation Links
  const programLeaderLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/courses', label: 'Courses', icon: '📚' },
    { path: '/reports', label: 'Reports', icon: '📋' },
    { path: '/monitoring', label: 'Monitoring', icon: '👀' },
    { path: '/classes', label: 'Classes', icon: '🏫' },
    { path: '/lecturers', label: 'Lecturers', icon: '👨‍🏫' },
    { path: '/rating', label: 'Rating', icon: '⭐' }
  ];

  // Get navigation links based on user role
  const getNavLinks = () => {
    switch (userRole) {
      case 'student':
        return studentLinks;
      case 'lecturer':
        return lecturerLinks;
      case 'principal_lecturer':
        return principalLecturerLinks;
      case 'program_leader':
        return programLeaderLinks;
      default:
        return [];
    }
  };

  // Get user display name and role label
  const getUserDisplayInfo = () => {
    const roleLabels = {
      student: 'Student',
      lecturer: 'Lecturer',
      principal_lecturer: 'Principal Lecturer',
      program_leader: 'Program Leader'
    };

    return {
      name: user?.name || user?.email || 'User',
      role: roleLabels[userRole] || 'Unknown Role'
    };
  };

  const { name, role } = getUserDisplayInfo();
  const navLinks = getNavLinks();

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo/Brand */}
        <Link to="/dashboard" className="nav-logo" onClick={closeMobileMenu}>
          <span className="logo-icon">🎓</span>
          LUCT Reporting System
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="nav-toggle" onClick={toggleMobileMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        {/* Navigation Links */}
        <ul className={`nav-menu ${isMobileMenuOpen ? 'nav-menu-active' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.path} className="nav-item">
              <Link
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="nav-icon">{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* User Info and Logout */}
        <div className="nav-user-section">
          <div className="user-info">
            <span className="user-name">{name}</span>
            <span className="user-role">{role}</span>
          </div>
          <button 
            className="logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            <span className="logout-icon">🚪</span>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
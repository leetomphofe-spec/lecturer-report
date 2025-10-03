import React, { useState, useEffect } from 'react';
import { getPLCourses } from '../../services/api';

const Courses = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setError(null);
      setLoading(true);
      
      if (!user || !user.id) {
        throw new Error('User information not available');
      }

      const response = await getPLCourses(user.id);
      
      // Handle different response structures
      if (response && response.data) {
        setCourses(response.data);
      } else if (Array.isArray(response)) {
        setCourses(response);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error fetching PL courses:', error);
      setError(error.message || 'Failed to load courses');
      setCourses([]); // Reset courses on error
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-4">Loading PL courses...</div>;
  
  if (error) return (
    <div className="alert alert-danger" role="alert">
      Error: {error}
      <button 
        className="btn btn-sm btn-outline-danger ms-3"
        onClick={fetchCourses}
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h4>Program Leader Courses</h4>
        <span className="badge bg-primary">{courses.length} courses</span>
      </div>
      <div className="card-body">
        {courses.length === 0 ? (
          <div className="text-center p-4">
            <p>No courses found in your program.</p>
            <button 
              className="btn btn-primary"
              onClick={fetchCourses}
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Program</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id || course.course_id}>
                    <td>{course.course_code}</td>
                    <td>{course.course_name}</td>
                    <td>{course.program || course.stream || 'N/A'}</td>
                    <td>
                      {course.assigned_lecturer_id ? (
                        <span className="badge bg-success">Assigned</span>
                      ) : (
                        <span className="badge bg-warning">Not Assigned</span>
                      )}
                    </td>
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

export default Courses;
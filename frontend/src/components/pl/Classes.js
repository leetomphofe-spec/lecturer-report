import React, { useState, useEffect } from 'react';
import { getPLCourses } from '../../services/api';
import './PL.css'; // Import the PL CSS

const Classes = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await getPLCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading classes data...</div>;

  return (
    <div className="card">
      <div className="card-header">
        <h4>Program Classes Overview</h4>
      </div>
      <div className="card-body">
        <div className="row">
          {courses.map((course) => (
            <div key={course.id} className="col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{course.course_name}</h5>
                  <p className="card-text">
                    <strong>Code:</strong> {course.course_code}<br/>
                    <strong>Stream:</strong> {course.stream}<br/>
                    <strong>Lecturer:</strong> {course.lecturer_name || 'Not Assigned'}<br/>
                    <strong>Status:</strong> 
                    <span className={`badge ${course.assigned_lecturer_id ? 'bg-success' : 'bg-warning'}`}>
                      {course.assigned_lecturer_id ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Classes;
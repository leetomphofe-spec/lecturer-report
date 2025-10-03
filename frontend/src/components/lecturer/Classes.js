import React, { useState, useEffect } from 'react';
import { getLecturerAssignedClasses } from '../../services/api';
import './Lecturer.css'; // Import the CSS

const Classes = ({ user }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await getLecturerAssignedClasses(user.id);
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading classes...</div>;

  return (
    <div className="card">
      <div className="card-header">
        <h4>My Assigned Classes</h4>
      </div>
      <div className="card-body">
        {classes.length === 0 ? (
          <div className="alert alert-info">
            <p>No classes assigned to you yet. Please contact the Program Leader.</p>
          </div>
        ) : (
          <div className="row">
            {classes.map((cls) => (
              <div key={cls.id} className="col-md-6 mb-3">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{cls.course_name}</h5>
                    <p className="card-text">
                      <strong>Class:</strong> {cls.class_name}<br/>
                      <strong>Course Code:</strong> {cls.course_code}<br/>
                      <strong>Venue:</strong> {cls.venue}<br/>
                      <strong>Total Students:</strong> {cls.total_students}<br/>
                      <strong>Enrolled Students:</strong> {cls.enrolled_students || 0}<br/>
                      <strong>Semester:</strong> {cls.semester}<br/>
                      <strong>Academic Year:</strong> {cls.academic_year}
                    </p>
                  </div>
                  <div className="card-footer">
                    <small className="text-muted">
                      Assigned by Program Leader
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Classes;
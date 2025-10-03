import React, { useState, useEffect } from 'react';
import { getAvailableClasses, getStudentEnrollments, enrollStudent, unenrollStudent } from '../../services/api';
import './Student.css'; // Import the Student CSS

const Enrollment = ({ user }) => {
  const [availableClasses, setAvailableClasses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [classesRes, enrollmentsRes] = await Promise.all([
        getAvailableClasses(),
        getStudentEnrollments(user.id)
      ]);
      
      setAvailableClasses(classesRes.data);
      setEnrollments(enrollmentsRes.data);
    } catch (error) {
      console.error('Error fetching enrollment data:', error);
      setError('Failed to load enrollment data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (classItem) => {
    try {
      setError('');
      await enrollStudent({
        student_id: user.id,
        course_id: classItem.course_id // Using course_id instead of class_id
      });
      alert(`Successfully enrolled in ${classItem.course_name}!`);
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || 'Error enrolling in course';
      setError(message);
      alert(message);
    }
  };

  const handleUnenroll = async (enrollmentId, courseName) => {
    if (window.confirm(`Are you sure you want to unenroll from ${courseName}?`)) {
      try {
        setError('');
        await unenrollStudent(enrollmentId);
        alert(`Successfully unenrolled from ${courseName}!`);
        fetchData();
      } catch (error) {
        setError('Error unenrolling from course');
        alert('Error unenrolling from course');
      }
    }
  };

  if (loading) return (
    <div className="container mt-4">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading enrollment data...</p>
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4>My Enrolled Courses</h4>
              <span className="badge bg-primary">{enrollments.length} enrolled</span>
            </div>
            <div className="card-body">
              {enrollments.length === 0 ? (
                <div className="text-center text-muted">
                  <p>You are not enrolled in any courses yet.</p>
                  <p>Browse available courses on the right to get started.</p>
                </div>
              ) : (
                <div className="list-group">
                  {enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{enrollment.course_name} ({enrollment.course_code})</h6>
                          <p className="mb-1 small">
                            <strong>Class:</strong> {enrollment.class_name}<br/>
                            <strong>Lecturer:</strong> {enrollment.lecturer_name || 'Not assigned'}<br/>
                            <strong>Venue:</strong> {enrollment.venue}<br/>
                            <strong>Semester:</strong> {enrollment.semester}
                          </p>
                        </div>
                        <button
                          className="btn btn-outline-danger btn-sm ms-2"
                          onClick={() => handleUnenroll(enrollment.id, enrollment.course_name)}
                          title="Unenroll from this course"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4>Available Courses</h4>
              <span className="badge bg-success">{availableClasses.length} available</span>
            </div>
            <div className="card-body">
              {availableClasses.length === 0 ? (
                <div className="text-center text-muted">
                  <p>No courses available for enrollment at the moment.</p>
                  <p>Please check back later or contact your program leader.</p>
                </div>
              ) : (
                <div className="list-group">
                  {availableClasses.map((classItem) => {
                    const isEnrolled = enrollments.some(e => e.course_id === classItem.course_id);
                    return (
                      <div key={classItem.course_id} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <h6 className="mb-1">{classItem.course_name} ({classItem.course_code})</h6>
                            <p className="mb-1 small">
                              <strong>Class:</strong> {classItem.class_name}<br/>
                              <strong>Lecturer:</strong> {classItem.lecturer_name || 'Not assigned'}<br/>
                              <strong>Venue:</strong> {classItem.venue}<br/>
                              <strong>Semester:</strong> {classItem.semester}<br/>
                              <strong>Year:</strong> {classItem.academic_year}
                            </p>
                          </div>
                          <button
                            className={`btn btn-sm ${isEnrolled ? 'btn-success' : 'btn-primary'}`}
                            onClick={() => handleEnroll(classItem)}
                            disabled={isEnrolled}
                            title={isEnrolled ? 'Already enrolled' : 'Enroll in this course'}
                          >
                            {isEnrolled ? '✓ Enrolled' : 'Enroll'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enrollment;
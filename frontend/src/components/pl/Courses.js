import React, { useState, useEffect } from 'react';
import { getPLCourses, addCourse, assignLecturer, getPLLecturers } from '../../services/api';
import './PL.css'; // Import the PL CSS

const Courses = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    course_code: '',
    course_name: '',
    stream: 'Software Development'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, lecturersRes] = await Promise.all([
        getPLCourses(),
        getPLLecturers()
      ]);
      setCourses(coursesRes.data);
      setLecturers(lecturersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      await addCourse(newCourse);
      alert('Course added successfully!');
      setShowAddForm(false);
      setNewCourse({ course_code: '', course_name: '', stream: 'Software Development' });
      fetchData();
    } catch (error) {
      alert('Error adding course');
    }
  };

  const handleAssignLecturer = async (courseId, lecturerId) => {
    try {
      await assignLecturer({ course_id: courseId, lecturer_id: lecturerId });
      alert('Lecturer assigned successfully!');
      fetchData();
    } catch (error) {
      alert('Error assigning lecturer');
    }
  };

  if (loading) return <div>Loading courses...</div>;

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h4>Course Management</h4>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add New Course'}
        </button>
      </div>
      <div className="card-body">
        {showAddForm && (
          <div className="card mb-4">
            <div className="card-body">
              <h5>Add New Course</h5>
              <form onSubmit={handleAddCourse}>
                <div className="row">
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Course Code</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newCourse.course_code}
                        onChange={(e) => setNewCourse({...newCourse, course_code: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Course Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newCourse.course_name}
                        onChange={(e) => setNewCourse({...newCourse, course_name: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Stream</label>
                      <select
                        className="form-control"
                        value={newCourse.stream}
                        onChange={(e) => setNewCourse({...newCourse, stream: e.target.value})}
                      >
                        <option value="Software Development">Software Development</option>
                        <option value="Networking">Networking</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Business IT">Business IT</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn btn-success">Add Course</button>
              </form>
            </div>
          </div>
        )}

        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Stream</th>
                <th>Assigned Lecturer</th>

              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.course_code}</td>
                  <td>{course.course_name}</td>
                  <td>{course.stream}</td>
                  <td>
                    {course.lecturer_name || 'Not Assigned'}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Courses;
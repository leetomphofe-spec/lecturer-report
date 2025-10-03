import React, { useState, useEffect } from 'react';
import { getPLClasses, assignClassToLecturer, getPLLecturers } from '../../services/api';
import './PL.css'; // Import the PL CSS

const ClassManagement = ({ user }) => {
  const [classes, setClasses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [classesRes, lecturersRes] = await Promise.all([
        getPLClasses(),
        getPLLecturers()
      ]);
      setClasses(classesRes.data);
      setLecturers(lecturersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignLecturer = async (classId, lecturerId) => {
    try {
      await assignClassToLecturer({
        class_id: classId,
        lecturer_id: lecturerId
      });
      alert('Class assigned to lecturer successfully!');
      fetchData(); // Refresh data
    } catch (error) {
      alert('Error assigning class to lecturer');
    }
  };

  if (loading) return <div>Loading class data...</div>;

  return (
    <div className="card">
      <div className="card-header">
        <h4>Class Management</h4>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Class Name</th>
                <th>Course</th>
                <th>Venue</th>
                <th>Semester</th>
                <th>Assigned Lecturer</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((classItem) => (
                <tr key={classItem.id}>
                  <td>{classItem.class_name}</td>
                  <td>{classItem.course_name} ({classItem.course_code})</td>
                  <td>{classItem.venue}</td>
                  <td>{classItem.semester}</td>
                  <td>
                    {classItem.lecturer_name || 
                      <span className="text-danger">Not Assigned</span>
                    }
                  </td>
                  <td>
                    <select 
                      className="form-select form-select-sm"
                      value={classItem.lecturer_id || ''}
                      onChange={(e) => handleAssignLecturer(classItem.id, e.target.value)}
                    >
                      <option value="">Assign Lecturer</option>
                      {lecturers.map((lecturer) => (
                        <option key={lecturer.id} value={lecturer.id}>
                          {lecturer.name}
                        </option>
                      ))}
                    </select>
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

export default ClassManagement;
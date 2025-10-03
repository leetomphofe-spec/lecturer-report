import React, { useState, useEffect } from 'react';
import { getPLLecturers } from '../../services/api';
import './PL.css'; // Import the PL CSS

const Lectures = ({ user }) => {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLecturers();
  }, []);

  const fetchLecturers = async () => {
    try {
      const response = await getPLLecturers();
      setLecturers(response.data);
    } catch (error) {
      console.error('Error fetching lecturers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading lecturers...</div>;

  return (
    <div className="card">
      <div className="card-header">
        <h4>Lecturer Management</h4>
      </div>
      <div className="card-body">
        {lecturers.length === 0 ? (
          <p>No lecturers found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Faculty</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lecturers.map((lecturer) => (
                  <tr key={lecturer.id}>
                    <td>{lecturer.name}</td>
                    <td>{lecturer.email}</td>
                    <td>{lecturer.faculty}</td>
                    <td>
                      <span className="badge bg-success">Active</span>
                    </td>
                    <td>
                      <button className="btn btn-primary btn-sm me-1">View</button>
                      <button className="btn btn-warning btn-sm">Edit</button>
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

export default Lectures;
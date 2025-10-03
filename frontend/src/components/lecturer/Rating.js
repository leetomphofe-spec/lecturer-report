import React, { useState, useEffect } from 'react';
import { getLecturerRatings } from '../../services/api';
import './Lecturer.css'; // Import the CSS

const Rating = ({ user }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const response = await getLecturerRatings(user.id);
      setRatings(response.data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading ratings...</div>;

  const averageRating = ratings.length > 0 
    ? (ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length).toFixed(1)
    : 0;

  return (
    <div className="card">
      <div className="card-header">
        <h4>Student Ratings</h4>
      </div>
      <div className="card-body">
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card bg-light">
              <div className="card-body text-center">
                <h5>Average Rating</h5>
                <div className="display-4 text-primary">{averageRating}/5</div>
                <p className="text-muted">Based on {ratings.length} rating(s)</p>
              </div>
            </div>
          </div>
        </div>

        <h5>Recent Ratings</h5>
        {ratings.length === 0 ? (
          <p>No ratings yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {ratings.map((rating) => (
                  <tr key={rating.id}>
                    <td>{rating.student_name}</td>
                    <td>
                      <span className="badge bg-primary">{rating.rating}/5</span>
                    </td>
                    <td>{rating.comment || 'No comment'}</td>
                    <td>{new Date(rating.created_at).toLocaleDateString()}</td>
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

export default Rating;
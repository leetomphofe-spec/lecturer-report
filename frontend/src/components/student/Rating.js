import React, { useState, useEffect } from 'react';
import { getStudentMonitoring, submitRating, getStudentRatings } from '../../services/api';
import './Student.css'; // Import the Student CSS

const Rating = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [ratingForm, setRatingForm] = useState({
    rating: 5,
    comment: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [reportsRes, ratingsRes] = await Promise.all([
        getStudentMonitoring(user.id),
        getStudentRatings(user.id)
      ]);
      setReports(reportsRes.data || []);
      setRatings(ratingsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await submitRating({
        report_id: selectedReport.id,
        student_id: user.id,
        lecturer_id: selectedReport.lecturer_id,
        ...ratingForm
      });
      alert('Rating submitted successfully!');
      setSelectedReport(null);
      setRatingForm({ rating: 5, comment: '' });
      fetchData();
    } catch (error) {
      console.error('Error submitting rating:', error);
      setError('Failed to submit rating. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading rating data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3>Rate Lectures</h3>
      
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>Available Reports for Rating</h5>
              <button className="btn btn-sm btn-outline-primary" onClick={fetchData}>
                Refresh
              </button>
            </div>
            <div className="card-body">
              {reports.length === 0 ? (
                <div className="text-center text-muted py-3">
                  <p>No reports available for rating.</p>
                  <p>Reports will appear here when lecturers submit them for your courses.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Course</th>
                        <th>Lecturer</th>
                        <th>Date</th>
                        <th>Topic</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((report) => {
                        const alreadyRated = ratings.some(r => r.report_id === report.id);
                        return (
                          <tr key={report.id}>
                            <td>{report.course_name}</td>
                            <td>{report.lecturer_name}</td>
                            <td>{new Date(report.date_of_lecture).toLocaleDateString()}</td>
                            <td>
                              {report.topic_taught.length > 50 
                                ? report.topic_taught.substring(0, 50) + '...' 
                                : report.topic_taught}
                            </td>
                            <td>
                              <button 
                                className={`btn btn-sm ${alreadyRated ? 'btn-success' : 'btn-primary'}`}
                                onClick={() => setSelectedReport(report)}
                                disabled={alreadyRated}
                                title={alreadyRated ? 'Already rated' : 'Rate this lecture'}
                              >
                                {alreadyRated ? 'Rated' : 'Rate'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          {selectedReport && (
            <div className="card">
              <div className="card-header">
                <h5>Rate: {selectedReport.course_name}</h5>
              </div>
              <div className="card-body">
                <p><strong>Lecturer:</strong> {selectedReport.lecturer_name}</p>
                <p><strong>Date:</strong> {new Date(selectedReport.date_of_lecture).toLocaleDateString()}</p>
                <p><strong>Topic:</strong> {selectedReport.topic_taught}</p>
                
                <form onSubmit={handleSubmitRating}>
                  <div className="mb-3">
                    <label className="form-label">Rating (1-5)</label>
                    <select 
                      className="form-control"
                      value={ratingForm.rating}
                      onChange={(e) => setRatingForm({...ratingForm, rating: parseInt(e.target.value)})}
                    >
                      {[1,2,3,4,5].map(num => (
                        <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Comment (Optional)</label>
                    <textarea
                      className="form-control"
                      value={ratingForm.comment}
                      onChange={(e) => setRatingForm({...ratingForm, comment: e.target.value})}
                      rows="3"
                      placeholder="Share your feedback about this lecture..."
                    />
                  </div>
                  <button type="submit" className="btn btn-success">Submit Rating</button>
                  <button 
                    type="button" 
                    className="btn btn-secondary ms-2"
                    onClick={() => setSelectedReport(null)}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="card mt-3">
            <div className="card-header">
              <h5>My Ratings ({ratings.length})</h5>
            </div>
            <div className="card-body">
              {ratings.length === 0 ? (
                <p className="text-muted">You haven't rated any lectures yet.</p>
              ) : (
                ratings.map((rating) => (
                  <div key={rating.id} className="mb-2 p-2 border rounded">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <strong>Rating: {rating.rating}/5</strong>
                        {rating.comment && (
                          <p className="mb-1 mt-1">{rating.comment}</p>
                        )}
                        <small className="text-muted">
                          {new Date(rating.created_at).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rating;
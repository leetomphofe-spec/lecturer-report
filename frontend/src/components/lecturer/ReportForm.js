import React, { useState } from 'react';
import { submitReport } from '../../services/api';
import './Lecturer.css'; // Import the CSS


const ReportForm = ({ user }) => {
  const [formData, setFormData] = useState({
    faculty_name: 'ICT',
    class_name: '',
    week_of_reporting: '',
    date_of_lecture: '',
    course_name: '',
    course_code: '',
    lecturer_name: user?.name || '',
    actual_students_present: '',
    total_students_registered: '',
    venue: '',
    scheduled_time: '',
    topic_taught: '',
    learning_outcomes: '',
    recommendations: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Submitting report with data:', formData);
      
      // Prepare submission data with proper formatting
      const submissionData = {
        lecturer_id: user.id,
        faculty_name: formData.faculty_name,
        class_name: formData.class_name,
        week_of_reporting: formData.week_of_reporting,
        date_of_lecture: formData.date_of_lecture,
        course_name: formData.course_name,
        course_code: formData.course_code,
        lecturer_name: formData.lecturer_name || user.name,
        actual_students_present: formData.actual_students_present ? parseInt(formData.actual_students_present) : 0,
        total_students_registered: formData.total_students_registered ? parseInt(formData.total_students_registered) : 0,
        venue: formData.venue,
        scheduled_time: formData.scheduled_time,
        topic_taught: formData.topic_taught,
        learning_outcomes: formData.learning_outcomes,
        recommendations: formData.recommendations || null
      };

      console.log('Final submission data:', submissionData);

      const result = await submitReport(submissionData);
      console.log('Report submitted successfully:', result.data);
      
      alert('Report submitted successfully!');
      
      // Reset form but keep lecturer info
      setFormData({
        faculty_name: 'ICT',
        class_name: '',
        week_of_reporting: '',
        date_of_lecture: '',
        course_name: '',
        course_code: '',
        lecturer_name: user?.name || '',
        actual_students_present: '',
        total_students_registered: '',
        venue: '',
        scheduled_time: '',
        topic_taught: '',
        learning_outcomes: '',
        recommendations: ''
      });
      
    } catch (error) {
      console.error('Error submitting report:', error);
      console.error('Error response:', error.response);
      
      let errorMessage = 'Error submitting report';
      
      if (error.response?.data?.error === 'Missing required fields') {
        errorMessage = `Missing required fields: ${error.response.data.missingFields.join(', ')}`;
      } else if (error.response?.data?.details) {
        errorMessage = `Error: ${error.response.data.details}`;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    const requiredFields = [
      'faculty_name', 'class_name', 'week_of_reporting', 'date_of_lecture',
      'course_name', 'course_code', 'lecturer_name', 'actual_students_present',
      'total_students_registered', 'venue', 'scheduled_time', 'topic_taught', 'learning_outcomes'
    ];
    
    return requiredFields.every(field => {
      const value = formData[field];
      return value !== undefined && value !== null && value !== '';
    });
  };

  return (
    <div className="card">
      // Replace the main card structure with:
<div className="report-form-container">
  <div className="report-form-header">
    <h4>Submit Lecture Report</h4>
    {!isFormValid() && (
      <small className="text-warning">Please fill all required fields (*)</small>
    )}
  </div>
  <div className="report-form-body">
    {/* Rest of your form */}
  </div>
</div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Faculty Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="faculty_name"
                  value={formData.faculty_name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Class Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="class_name"
                  value={formData.class_name}
                  onChange={handleChange}
                  placeholder="e.g., DIT-2023-A"
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Week of Reporting *</label>
                <input
                  type="text"
                  className="form-control"
                  name="week_of_reporting"
                  value={formData.week_of_reporting}
                  onChange={handleChange}
                  placeholder="e.g., Week 6"
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Date of Lecture *</label>
                <input
                  type="date"
                  className="form-control"
                  name="date_of_lecture"
                  value={formData.date_of_lecture}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Course Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="course_name"
                  value={formData.course_name}
                  onChange={handleChange}
                  placeholder="e.g., Web Application Development"
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Course Code *</label>
                <input
                  type="text"
                  className="form-control"
                  name="course_code"
                  value={formData.course_code}
                  onChange={handleChange}
                  placeholder="e.g., DIWA2110"
                  required
                />
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Lecturer's Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="lecturer_name"
                  value={formData.lecturer_name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Actual Students Present *</label>
                <input
                  type="number"
                  className="form-control"
                  name="actual_students_present"
                  value={formData.actual_students_present}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Total Students Registered *</label>
                <input
                  type="number"
                  className="form-control"
                  name="total_students_registered"
                  value={formData.total_students_registered}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Venue *</label>
                <input
                  type="text"
                  className="form-control"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="e.g., Lab 301"
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Scheduled Time *</label>
                <input
                  type="time"
                  className="form-control"
                  name="scheduled_time"
                  value={formData.scheduled_time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Topic Taught *</label>
            <textarea
              className="form-control"
              name="topic_taught"
              value={formData.topic_taught}
              onChange={handleChange}
              rows="3"
              placeholder="What topic was covered in this lecture?"
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Learning Outcomes *</label>
            <textarea
              className="form-control"
              name="learning_outcomes"
              value={formData.learning_outcomes}
              onChange={handleChange}
              rows="3"
              placeholder="What should students be able to do after this lecture?"
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Recommendations (Optional)</label>
            <textarea
              className="form-control"
              name="recommendations"
              value={formData.recommendations}
              onChange={handleChange}
              rows="3"
              placeholder="Any recommendations or follow-up actions..."
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-lg"
            disabled={loading || !isFormValid()}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Submitting...
              </>
            ) : (
              'Submit Report'
            )}
          </button>

          {!isFormValid() && (
            <div className="alert alert-warning mt-3">
              Please fill all required fields (marked with *) before submitting.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ReportForm;
import React, { useState, useEffect } from 'react';
import { getPLCourses, getPLClasses } from '../../services/api';
import './PRL.css'; // Using existing PRL.css file

const Classes = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    fetchCourses();
  }, [user?.id]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError('');
      setDebugInfo('Fetching courses...');
      
      console.log('🎯 PL Classes - Fetching data for Program Leader:', user);
      
      // Use getPLCourses since it exists in your API
      const response = await getPLCourses(user.id);
      console.log('📊 PL Courses API Response:', response);
      
      const coursesData = response?.data || response || [];
      setCourses(coursesData);
      
      setDebugInfo(`
        Program Leader ID: ${user.id}
        Courses Found: ${coursesData.length}
        User Role: ${user.role}
      `);
      
      // If no courses found, try to get all courses using getPLClasses
      if (coursesData.length === 0) {
        console.log('🔍 No courses found, checking all classes...');
        try {
          const classesResponse = await getPLClasses(user.id);
          const allData = classesResponse?.data || classesResponse || [];
          setAllCourses(allData);
          console.log('📋 All available classes data:', allData);
        } catch (monitoringError) {
          console.log('⚠️ Could not fetch classes data:', monitoringError);
        }
      }
      
    } catch (error) {
      console.error('❌ Error fetching PL courses:', error);
      setError(`Failed to load courses: ${error.message}`);
      setDebugInfo(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test function to load sample data
  const loadSampleData = () => {
    const sampleCourses = [
      {
        id: 1,
        course_name: "Web Development",
        course_code: "DIWA2110",
        program: "Bachelor of Information Technology",
        stream: "Information Technology",
        assigned_lecturer_id: 101,
        assigned_lecturer_name: "Dr. Smith",
        student_count: 45,
        active: true,
        semester: "Spring 2024"
      },
      {
        id: 2,
        course_name: "Database Systems", 
        course_code: "DBS3010",
        program: "Bachelor of Information Technology",
        stream: "Information Technology",
        assigned_lecturer_id: 102,
        assigned_lecturer_name: "Prof. Johnson",
        student_count: 38,
        active: true,
        semester: "Spring 2024"
      },
      {
        id: 3,
        course_name: "Network Security",
        course_code: "NS4010",
        program: "Bachelor of Cyber Security",
        stream: "Cyber Security",
        assigned_lecturer_id: null,
        assigned_lecturer_name: null,
        student_count: 25,
        active: false,
        semester: "Spring 2024"
      }
    ];

    setCourses(sampleCourses);
    setDebugInfo('✅ Loaded sample data for testing');
    console.log('🧪 Sample courses loaded:', sampleCourses);
  };

  if (loading) {
    return (
      <div className="prl-classes-container">
        <div className="loading-spinner"></div>
        <p>Loading classes data...</p>
        <small className="text-muted">{debugInfo}</small>
      </div>
    );
  }

  return (
    <div className="prl-classes-container">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4>🏫 Classes in My Programs</h4>
          <div>
            <span className="badge bg-primary">{courses.length} classes</span>
          </div>
        </div>
        
        <div className="card-body">
          {error && (
            <div className="alert alert-warning">
              <strong>⚠️ Notice:</strong> {error}
            </div>
          )}

          {courses.length === 0 ? (
            <div className="text-center py-5">
              <div className="empty-state-icon">🏫</div>
              <h5>No Classes Found in Your Programs</h5>
              <p className="text-muted">
                This could be because:
              </p>
              <ul className="text-start text-muted">
                <li>You haven't been assigned to any academic programs</li>
                <li>No courses are assigned to your programs</li>
                <li>There might be a data loading issue</li>
              </ul>
              
              <div className="mt-4">
                <button onClick={fetchCourses} className="btn btn-primary me-2">
                  🔄 Try Again
                </button>
                <button onClick={loadSampleData} className="btn btn-outline-secondary">
                  🧪 Use Sample Data
                </button>
              </div>

              {/* Show all available data for debugging */}
              {allCourses.length > 0 && (
                <div className="mt-4">
                  <h6>📋 All Available Data (for debugging):</h6>
                  <pre className="debug-pre">
                    {JSON.stringify(allCourses, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="row">
                {courses.map((course) => (
                  <div key={course.id} className="col-md-6 col-lg-4 mb-4">
                    <div className={`card h-100 ${course.assigned_lecturer_id ? 'border-success' : 'border-warning'}`}>
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <strong>{course.course_code}</strong>
                        <span className={`badge ${course.assigned_lecturer_id ? 'bg-success' : 'bg-warning'}`}>
                          {course.assigned_lecturer_id ? '🟢 Active' : '🟡 Unassigned'}
                        </span>
                      </div>
                      <div className="card-body">
                        <h5 className="card-title">{course.course_name}</h5>
                        
                        <div className="course-details">
                          <div className="detail-item">
                            <span className="label">Program:</span>
                            <span className="value">{course.program || course.stream || 'Not specified'}</span>
                          </div>
                          
                          <div className="detail-item">
                            <span className="label">Lecturer:</span>
                            <span className="value">
                              {course.assigned_lecturer_name || 'Not assigned'}
                            </span>
                          </div>
                          
                          {course.student_count !== undefined && (
                            <div className="detail-item">
                              <span className="label">Students:</span>
                              <span className="value">{course.student_count}</span>
                            </div>
                          )}
                          
                          {course.semester && (
                            <div className="detail-item">
                              <span className="label">Semester:</span>
                              <span className="value">{course.semester}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="card-footer">
                        <small className="text-muted">
                          Course ID: {course.id}
                          {course.assigned_lecturer_id && ` • Lecturer ID: ${course.assigned_lecturer_id}`}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Stats */}
              <div className="row mt-4">
                <div className="col-12">
                  <div className="summary-stats">
                    <div className="stat-card">
                      <div className="stat-number">{courses.length}</div>
                      <div className="stat-label">Total Courses</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">
                        {courses.filter(c => c.assigned_lecturer_id).length}
                      </div>
                      <div className="stat-label">Active Courses</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">
                        {courses.filter(c => !c.assigned_lecturer_id).length}
                      </div>
                      <div className="stat-label">Unassigned</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Classes;
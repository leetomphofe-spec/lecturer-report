import axios from 'axios';

const API = axios.create({ 
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request logging
API.interceptors.request.use((config) => {
  console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response logging
API.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error(`API Error: ${error.response?.status}`, error.response?.data);
    return Promise.reject(error);
  }
);

// Add the missing functions here:
export const healthCheck = () => {
  console.log('🏥 Checking API health...');
  return API.get('/health');
};

export const getAllCourses = () => {
  console.log('📚 Fetching all courses...');
  return API.get('/courses');
};

// Your existing exports...
export const getGuestDashboard = () => API.get('/guest/dashboard');
export const searchReports = (query) => API.get(`/guest/search?query=${query}`);
export const login = (userData) => API.post('/auth/login', userData);
export const register = (userData) => API.post('/auth/register', userData);

// Student endpoints
export const getStudentMonitoring = (studentId) => {
  console.log('Fetching student monitoring for:', studentId);
  return API.get(`/student/monitoring/${studentId}`);
};
export const submitRating = (ratingData) => {
  console.log('Submitting rating:', ratingData);
  return API.post('/student/rating', ratingData);
};
export const getStudentRatings = (studentId) => {
  console.log('Fetching student ratings for:', studentId);
  return API.get(`/student/ratings/${studentId}`);
};
export const getStudentEnrollments = (studentId) => {
  console.log('Fetching student enrollments for:', studentId);
  return API.get(`/student/enrollments/${studentId}`);
};

// Lecturer endpoints
export const getLecturerClasses = (lecturerId) => API.get(`/lecturer/classes/${lecturerId}`);
export const getLecturerReports = (lecturerId) => API.get(`/lecturer/reports/${lecturerId}`);
export const submitReport = (reportData) => API.post('/lecturer/reports', reportData);
export const getLecturerMonitoring = (lecturerId) => API.get(`/lecturer/monitoring/${lecturerId}`);
export const getLecturerRatings = (lecturerId) => API.get(`/lecturer/ratings/${lecturerId}`);
export const getLecturerAssignedClasses = (lecturerId) => API.get(`/lecturer/assigned-classes/${lecturerId}`);

// PRL endpoints
export const getPRLCourses = (prlId) => API.get(`/prl/courses/${prlId}`);
export const getPRLReports = (prlId) => API.get(`/prl/reports/${prlId}`);
export const addFeedback = (feedbackData) => API.post('/prl/feedback', feedbackData);
export const getPRLMonitoring = (prlId) => API.get(`/prl/monitoring/${prlId}`);

// PL endpoints
export const getPLCourses = () => API.get('/pl/courses');
export const addCourse = (courseData) => API.post('/pl/courses', courseData);
export const assignLecturer = (assignmentData) => API.post('/pl/assign-lecturer', assignmentData);

// In services/api.js - Add this function if it doesn't exist
export const getPLReports = async (programLeaderId) => {
  try {
    const response = await api.get(`/program-leader/${programLeaderId}/reports`);
    return response;
  } catch (error) {
    throw error;
  }
};
export const getPLLecturers = () => API.get('/pl/lecturers');
export const getPLClasses = () => API.get('/pl/classes');
export const assignClassToLecturer = (assignmentData) => API.post('/pl/assign-class', assignmentData);

// Enrollment endpoints
export const getAvailableClasses = () => API.get('/enrollments/available-classes');
export const enrollStudent = (enrollmentData) => API.post('/enrollments/enroll', enrollmentData);
export const unenrollStudent = (enrollmentId) => API.delete(`/enrollments/enroll/${enrollmentId}`);

export default API;
const pool = require('../config/database');

class Report {
  static async create(reportData) {
    const {
      lecturer_id, faculty_name, class_name, week_of_reporting, date_of_lecture,
      course_name, course_code, lecturer_name, actual_students_present,
      total_students_registered, venue, scheduled_time, topic_taught,
      learning_outcomes, recommendations
    } = reportData;

    const query = `
      INSERT INTO reports (
        lecturer_id, faculty_name, class_name, week_of_reporting, date_of_lecture,
        course_name, course_code, lecturer_name, actual_students_present,
        total_students_registered, venue, scheduled_time, topic_taught,
        learning_outcomes, recommendations
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
      RETURNING *
    `;
    
    const values = [
      lecturer_id, faculty_name, class_name, week_of_reporting, date_of_lecture,
      course_name, course_code, lecturer_name, actual_students_present,
      total_students_registered, venue, scheduled_time, topic_taught,
      learning_outcomes, recommendations
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByLecturerId(lecturerId) {
    const query = 'SELECT * FROM reports WHERE lecturer_id = $1 ORDER BY created_at DESC';
    
    try {
      const result = await pool.query(query, [lecturerId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    const query = `
      SELECT r.*, u.name as lecturer_name 
      FROM reports r 
      JOIN users u ON r.lecturer_id = u.id 
      WHERE r.id = $1
    `;
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    const query = `
      SELECT r.*, u.name as lecturer_name 
      FROM reports r 
      JOIN users u ON r.lecturer_id = u.id 
      ORDER BY r.created_at DESC
    `;
    
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async findByStream(stream) {
    const query = `
      SELECT r.*, u.name as lecturer_name 
      FROM reports r 
      JOIN users u ON r.lecturer_id = u.id 
      JOIN courses c ON r.course_code = c.course_code 
      WHERE c.stream = $1 
      ORDER BY r.created_at DESC
    `;
    
    try {
      const result = await pool.query(query, [stream]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async getLecturerStats(lecturerId) {
    const query = `
      SELECT 
        COUNT(*) as total_reports,
        AVG(actual_students_present) as avg_attendance,
        MIN(date_of_lecture) as first_report,
        MAX(date_of_lecture) as last_report
      FROM reports 
      WHERE lecturer_id = $1
    `;
    
    try {
      const result = await pool.query(query, [lecturerId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getStreamStats(stream) {
    const query = `
      SELECT 
        COUNT(DISTINCT r.lecturer_id) as total_lecturers,
        COUNT(r.id) as total_reports,
        AVG(r.actual_students_present) as avg_attendance
      FROM reports r 
      JOIN courses c ON r.course_code = c.course_code 
      WHERE c.stream = $1
    `;
    
    try {
      const result = await pool.query(query, [stream]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async search(query) {
    const searchQuery = `
      SELECT r.*, u.name as lecturer_name 
      FROM reports r 
      JOIN users u ON r.lecturer_id = u.id 
      WHERE r.course_name ILIKE $1 OR r.topic_taught ILIKE $1 OR u.name ILIKE $1
      ORDER BY r.created_at DESC
      LIMIT 10
    `;
    
    try {
      const result = await pool.query(searchQuery, [`%${query}%`]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Report;
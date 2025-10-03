const pool = require('../config/database');

class Rating {
  static async create(ratingData) {
    const { report_id, student_id, lecturer_id, rating, comment } = ratingData;
    const query = `
      INSERT INTO ratings (report_id, student_id, lecturer_id, rating, comment) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;
    const values = [report_id, student_id, lecturer_id, rating, comment];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByStudentId(studentId) {
    const query = 'SELECT * FROM ratings WHERE student_id = $1 ORDER BY created_at DESC';
    
    try {
      const result = await pool.query(query, [studentId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async findByLecturerId(lecturerId) {
    const query = `
      SELECT r.*, u.name as student_name 
      FROM ratings r 
      JOIN users u ON r.student_id = u.id 
      WHERE r.lecturer_id = $1 
      ORDER BY r.created_at DESC
    `;
    
    try {
      const result = await pool.query(query, [lecturerId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async findByReportId(reportId) {
    const query = 'SELECT * FROM ratings WHERE report_id = $1 ORDER BY created_at DESC';
    
    try {
      const result = await pool.query(query, [reportId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async getAverageRating(lecturerId) {
    const query = 'SELECT AVG(rating) as average_rating FROM ratings WHERE lecturer_id = $1';
    
    try {
      const result = await pool.query(query, [lecturerId]);
      return result.rows[0].average_rating;
    } catch (error) {
      throw error;
    }
  }

  static async getRatingStats(lecturerId) {
    const query = `
      SELECT 
        COUNT(*) as total_ratings,
        AVG(rating) as average_rating,
        COUNT(DISTINCT student_id) as unique_students
      FROM ratings 
      WHERE lecturer_id = $1
    `;
    
    try {
      const result = await pool.query(query, [lecturerId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async hasRated(reportId, studentId) {
    const query = 'SELECT * FROM ratings WHERE report_id = $1 AND student_id = $2';
    
    try {
      const result = await pool.query(query, [reportId, studentId]);
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Rating;
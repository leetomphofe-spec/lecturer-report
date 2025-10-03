const pool = require('../config/database');

class Feedback {
  static async create(feedbackData) {
    const { report_id, prl_id, feedback_text } = feedbackData;
    const query = `
      INSERT INTO feedback (report_id, prl_id, feedback_text) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    const values = [report_id, prl_id, feedback_text];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByReportId(reportId) {
    const query = `
      SELECT f.*, u.name as prl_name 
      FROM feedback f 
      JOIN users u ON f.prl_id = u.id 
      WHERE f.report_id = $1 
      ORDER BY f.created_at DESC
    `;
    
    try {
      const result = await pool.query(query, [reportId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByPRLId(prlId) {
    const query = `
      SELECT f.*, r.course_name, r.lecturer_name 
      FROM feedback f 
      JOIN reports r ON f.report_id = r.id 
      WHERE f.prl_id = $1 
      ORDER BY f.created_at DESC
    `;
    
    try {
      const result = await pool.query(query, [prlId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async update(feedbackId, feedbackText) {
    const query = 'UPDATE feedback SET feedback_text = $1 WHERE id = $2 RETURNING *';
    
    try {
      const result = await pool.query(query, [feedbackText, feedbackId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(feedbackId) {
    const query = 'DELETE FROM feedback WHERE id = $1 RETURNING *';
    
    try {
      const result = await pool.query(query, [feedbackId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getReportsWithFeedback() {
    const query = `
      SELECT r.*, u.name as lecturer_name, f.feedback_text, f.created_at as feedback_date
      FROM reports r 
      JOIN users u ON r.lecturer_id = u.id 
      LEFT JOIN feedback f ON r.id = f.report_id 
      ORDER BY r.created_at DESC
    `;
    
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Feedback;
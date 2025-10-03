const pool = require('../config/database');

class Course {
  static async create(courseData) {
    const { course_code, course_name, stream } = courseData;
    const query = `
      INSERT INTO courses (course_code, course_name, stream) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    const values = [course_code, course_name, stream];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    const query = `
      SELECT c.*, u.name as lecturer_name 
      FROM courses c 
      LEFT JOIN users u ON c.assigned_lecturer_id = u.id
      ORDER BY c.course_name
    `;
    
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async findByStream(stream) {
    const query = 'SELECT * FROM courses WHERE stream = $1';
    
    try {
      const result = await pool.query(query, [stream]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    const query = 'SELECT * FROM courses WHERE id = $1';
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByCode(courseCode) {
    const query = 'SELECT * FROM courses WHERE course_code = $1';
    
    try {
      const result = await pool.query(query, [courseCode]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async assignLecturer(courseId, lecturerId) {
    const query = 'UPDATE courses SET assigned_lecturer_id = $1 WHERE id = $2 RETURNING *';
    
    try {
      const result = await pool.query(query, [lecturerId, courseId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(courseId, updateData) {
    const { course_name, stream } = updateData;
    const query = 'UPDATE courses SET course_name = $1, stream = $2 WHERE id = $3 RETURNING *';
    
    try {
      const result = await pool.query(query, [course_name, stream, courseId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(courseId) {
    const query = 'DELETE FROM courses WHERE id = $1 RETURNING *';
    
    try {
      const result = await pool.query(query, [courseId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Course;
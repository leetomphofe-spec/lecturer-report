const pool = require('../config/database');

class User {
  static async create(userData) {
    const { email, password, role, name, faculty, stream } = userData;
    const query = `
      INSERT INTO users (email, password, role, name, faculty, stream) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id, email, role, name, faculty, stream, created_at
    `;
    const values = [email, password, role, name, faculty, stream];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    
    try {
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    const query = 'SELECT id, email, role, name, faculty, stream, created_at FROM users WHERE id = $1';
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByRole(role) {
    const query = 'SELECT id, email, role, name, faculty, stream FROM users WHERE role = $1';
    
    try {
      const result = await pool.query(query, [role]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, updateData) {
    const { name, faculty, stream } = updateData;
    const query = `
      UPDATE users 
      SET name = $1, faculty = $2, stream = $3 
      WHERE id = $4 
      RETURNING id, email, role, name, faculty, stream
    `;
    const values = [name, faculty, stream, id];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
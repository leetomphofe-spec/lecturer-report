const express = require('express');
const auth = require('../middleware/auth');
const pool = require('../config/database');
const router = express.Router();

// Get courses under PRL's stream
router.get('/courses/:prlId', auth, async (req, res) => {
  try {
    const user = await pool.query('SELECT stream FROM users WHERE id = $1', [req.params.prlId]);
    const courses = await pool.query(
      'SELECT * FROM courses WHERE stream = $1',
      [user.rows[0].stream]
    );
    res.json(courses.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get reports for PRL's stream
router.get('/reports/:prlId', auth, async (req, res) => {
  try {
    const user = await pool.query('SELECT stream FROM users WHERE id = $1', [req.params.prlId]);
    const reports = await pool.query(`
      SELECT r.*, u.name as lecturer_name 
      FROM reports r 
      JOIN users u ON r.lecturer_id = u.id 
      JOIN courses c ON r.course_code = c.course_code 
      WHERE c.stream = $1 
      ORDER BY r.created_at DESC
    `, [user.rows[0].stream]);
    res.json(reports.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add feedback to report
router.post('/feedback', auth, async (req, res) => {
  try {
    const { report_id, prl_id, feedback_text } = req.body;
    
    const result = await pool.query(
      'INSERT INTO feedback (report_id, prl_id, feedback_text) VALUES ($1, $2, $3) RETURNING *',
      [report_id, prl_id, feedback_text]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PRL monitoring - get stream statistics
router.get('/monitoring/:prlId', auth, async (req, res) => {
  try {
    console.log('Fetching monitoring stats for PRL:', req.params.prlId);
    
    // Get PRL's stream
    const user = await pool.query('SELECT stream FROM users WHERE id = $1', [req.params.prlId]);
    const stream = user.rows[0]?.stream;
    
    if (!stream) {
      return res.status(400).json({ error: 'PRL stream not found' });
    }
    
    const stats = await pool.query(`
      SELECT 
        COUNT(DISTINCT r.lecturer_id) as total_lecturers,
        COUNT(r.id) as total_reports,
        AVG(r.actual_students_present) as avg_attendance,
        COUNT(DISTINCT r.course_code) as total_courses
      FROM reports r 
      JOIN courses c ON r.course_code = c.course_code 
      WHERE c.stream = $1
    `, [stream]);
    
    console.log('PRL stats for stream', stream, ':', stats.rows[0]);
    res.json(stats.rows[0]);
  } catch (err) {
    console.error('Error fetching PRL monitoring:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
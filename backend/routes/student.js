const express = require('express');
const auth = require('../middleware/auth');
const pool = require('../config/database');
const router = express.Router();

// Student monitoring - view reports from enrolled courses
router.get('/monitoring/:studentId', auth, async (req, res) => {
  try {
    console.log('Fetching monitoring data for student:', req.params.studentId);
    
    const reports = await pool.query(`
      SELECT r.*, u.name as lecturer_name 
      FROM reports r 
      JOIN users u ON r.lecturer_id = u.id 
      WHERE r.course_code IN (
        SELECT c.course_code 
        FROM student_classes sc 
        JOIN courses c ON sc.course_id = c.id 
        WHERE sc.student_id = $1
      )
      ORDER BY r.date_of_lecture DESC
    `, [req.params.studentId]);
    
    console.log('Found reports for student:', reports.rows.length);
    res.json(reports.rows);
  } catch (err) {
    console.error('Error fetching student monitoring:', err);
    res.status(500).json({ error: err.message });
  }
});

// Submit rating
router.post('/rating', auth, async (req, res) => {
  try {
    const { report_id, student_id, lecturer_id, rating, comment } = req.body;
    
    const result = await pool.query(
      'INSERT INTO ratings (report_id, student_id, lecturer_id, rating, comment) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [report_id, student_id, lecturer_id, rating, comment]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get student ratings
router.get('/ratings/:studentId', auth, async (req, res) => {
  try {
    const ratings = await pool.query(
      'SELECT * FROM ratings WHERE student_id = $1 ORDER BY created_at DESC',
      [req.params.studentId]
    );
    res.json(ratings.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get student enrollments - ADD THIS ENDPOINT
router.get('/enrollments/:studentId', auth, async (req, res) => {
  try {
    console.log('Fetching enrollments for student:', req.params.studentId);
    
    const enrollments = await pool.query(`
      SELECT 
        sc.*, 
        c.course_name, 
        c.course_code,
        u.name as lecturer_name,
        'Class-' || c.course_code as class_name,
        'Lab 301' as venue,
        'Semester 1' as semester
      FROM student_classes sc
      JOIN courses c ON sc.course_id = c.id
      LEFT JOIN users u ON c.assigned_lecturer_id = u.id
      WHERE sc.student_id = $1
      ORDER BY c.course_name
    `, [req.params.studentId]);
    
    console.log('Found enrollments:', enrollments.rows.length);
    res.json(enrollments.rows);
  } catch (err) {
    console.error('Error fetching student enrollments:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
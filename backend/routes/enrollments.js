const express = require('express');
const auth = require('../middleware/auth');
const pool = require('../config/database');
const router = express.Router();

// Get available classes for student enrollment - USING EXISTING student_classes TABLE
router.get('/available-classes', auth, async (req, res) => {
  try {
    console.log('Fetching available classes...');
    
    // Since we don't have enhanced classes table, we'll use courses and existing data
    const classes = await pool.query(`
      SELECT 
        c.id as course_id,
        c.course_name,
        c.course_code,
        u.id as lecturer_id,
        u.name as lecturer_name,
        'Class-' || c.course_code as class_name,
        'Lab 301' as venue,
        'Semester 1' as semester,
        '2023-2024' as academic_year
      FROM courses c
      JOIN users u ON c.assigned_lecturer_id = u.id
      WHERE c.assigned_lecturer_id IS NOT NULL
      ORDER BY c.course_name
    `);
    
    console.log('Available classes found:', classes.rows.length);
    res.json(classes.rows);
  } catch (err) {
    console.error('Error fetching available classes:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get student's enrolled classes - USING EXISTING student_classes TABLE
router.get('/student/:studentId', auth, async (req, res) => {
  try {
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
    
    res.json(enrollments.rows);
  } catch (err) {
    console.error('Error fetching student enrollments:', err);
    res.status(500).json({ error: err.message });
  }
});

// Enroll student in class - USING EXISTING student_classes TABLE
router.post('/enroll', auth, async (req, res) => {
  try {
    const { student_id, class_id, course_id } = req.body;
    console.log('Enrolling student:', { student_id, class_id, course_id });
    
    // Since we don't have class_id in the original schema, we'll use course_id
    const result = await pool.query(
      'INSERT INTO student_classes (student_id, course_id) VALUES ($1, $2) RETURNING *',
      [student_id, course_id]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Enrollment error:', err);
    if (err.code === '23505') {
      res.status(400).json({ message: 'Already enrolled in this course' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Unenroll student from class
router.delete('/enroll/:enrollmentId', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM student_classes WHERE id = $1', [req.params.enrollmentId]);
    res.json({ message: 'Successfully unenrolled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
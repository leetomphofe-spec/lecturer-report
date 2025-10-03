const express = require('express');
const auth = require('../middleware/auth');
const pool = require('../config/database');
const router = express.Router();

// Get lecturer's assigned classes
router.get('/assigned-classes/:lecturerId', auth, async (req, res) => {
  try {
    console.log('Fetching assigned classes for lecturer:', req.params.lecturerId);
    
    const classes = await pool.query(`
      SELECT 
        c.id,
        c.course_name,
        c.course_code,
        'Class-' || c.course_code as class_name,
        'Lab 301' as venue,
        40 as total_students,
        COUNT(sc.student_id) as enrolled_students,
        'Semester 1' as semester,
        '2023-2024' as academic_year
      FROM courses c
      LEFT JOIN student_classes sc ON c.id = sc.course_id
      WHERE c.assigned_lecturer_id = $1
      GROUP BY c.id, c.course_name, c.course_code
      ORDER BY c.course_name
    `, [req.params.lecturerId]);
    
    console.log('Assigned classes found:', classes.rows.length);
    res.json(classes.rows);
  } catch (err) {
    console.error('Error fetching assigned classes:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get lecturer's reports
router.get('/reports/:lecturerId', auth, async (req, res) => {
  try {
    const reports = await pool.query(
      'SELECT * FROM reports WHERE lecturer_id = $1 ORDER BY created_at DESC',
      [req.params.lecturerId]
    );
    res.json(reports.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit report
router.post('/reports', auth, async (req, res) => {
  try {
    console.log('Received report submission request');
    console.log('Request body:', req.body);
    
    const {
      lecturer_id, faculty_name, class_name, week_of_reporting, date_of_lecture,
      course_name, course_code, lecturer_name, actual_students_present,
      total_students_registered, venue, scheduled_time, topic_taught,
      learning_outcomes, recommendations
    } = req.body;

    // Validate required fields
    const requiredFields = [
      'lecturer_id', 'faculty_name', 'class_name', 'week_of_reporting', 'date_of_lecture',
      'course_name', 'course_code', 'lecturer_name', 'actual_students_present',
      'total_students_registered', 'venue', 'scheduled_time', 'topic_taught', 'learning_outcomes'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return res.status(400).json({ 
        error: 'Missing required fields',
        missingFields: missingFields
      });
    }

    // Convert numbers and handle null recommendations
    const actualStudents = parseInt(actual_students_present) || 0;
    const totalStudents = parseInt(total_students_registered) || 0;
    const finalRecommendations = recommendations || null;

    const result = await pool.query(
      `INSERT INTO reports (
        lecturer_id, faculty_name, class_name, week_of_reporting, date_of_lecture,
        course_name, course_code, lecturer_name, actual_students_present,
        total_students_registered, venue, scheduled_time, topic_taught,
        learning_outcomes, recommendations
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
      [
        lecturer_id, 
        faculty_name, 
        class_name, 
        week_of_reporting, 
        date_of_lecture,
        course_name, 
        course_code, 
        lecturer_name, 
        actualStudents,
        totalStudents,
        venue, 
        scheduled_time, 
        topic_taught,
        learning_outcomes, 
        finalRecommendations
      ]
    );

    console.log('Report submitted successfully:', result.rows[0]);
    res.json(result.rows[0]);
    
  } catch (err) {
    console.error('Database error submitting report:', err);
    res.status(500).json({ 
      error: 'Database error',
      details: err.message,
      code: err.code
    });
  }
});

// Lecturer monitoring - get reporting statistics
router.get('/monitoring/:lecturerId', auth, async (req, res) => {
  try {
    console.log('Fetching monitoring stats for lecturer:', req.params.lecturerId);
    
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_reports,
        AVG(actual_students_present) as avg_attendance,
        MIN(date_of_lecture) as first_report,
        MAX(date_of_lecture) as last_report,
        SUM(actual_students_present) as total_students_taught
      FROM reports 
      WHERE lecturer_id = $1
    `, [req.params.lecturerId]);
    
    console.log('Lecturer stats:', stats.rows[0]);
    res.json(stats.rows[0]);
  } catch (err) {
    console.error('Error fetching lecturer monitoring:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get lecturer ratings
router.get('/ratings/:lecturerId', auth, async (req, res) => {
  try {
    const ratings = await pool.query(
      `SELECT r.*, u.name as student_name 
       FROM ratings r 
       JOIN users u ON r.student_id = u.id 
       WHERE r.lecturer_id = $1 
       ORDER BY r.created_at DESC`,
      [req.params.lecturerId]
    );
    res.json(ratings.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
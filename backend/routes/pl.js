const express = require('express');
const auth = require('../middleware/auth');
const pool = require('../config/database');
const router = express.Router();

// Get all courses for PL management
router.get('/courses', auth, async (req, res) => {
  try {
    const courses = await pool.query(`
      SELECT c.*, u.name as lecturer_name 
      FROM courses c 
      LEFT JOIN users u ON c.assigned_lecturer_id = u.id
    `);
    res.json(courses.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all classes (courses) for PL management
router.get('/classes', auth, async (req, res) => {
  try {
    const classes = await pool.query(`
      SELECT 
        c.id,
        c.course_name,
        c.course_code,
        'Class-' || c.course_code as class_name,
        'Lab 301' as venue,
        'Semester 1' as semester,
        u.name as lecturer_name,
        u.id as lecturer_id
      FROM courses c
      LEFT JOIN users u ON c.assigned_lecturer_id = u.id
      ORDER BY c.course_name
    `);
    res.json(classes.rows);
  } catch (err) {
    console.error('Error fetching PL classes:', err);
    res.status(500).json({ error: err.message });
  }
});

// Assign course to lecturer (this acts as class assignment)
router.post('/assign-class', auth, async (req, res) => {
  try {
    const { class_id, lecturer_id } = req.body;
    console.log('Assigning course to lecturer:', { class_id, lecturer_id });
    
    // class_id here is actually course_id from the courses table
    const result = await pool.query(
      'UPDATE courses SET assigned_lecturer_id = $1 WHERE id = $2 RETURNING *',
      [lecturer_id, class_id]
    );
    
    console.log('Course assigned successfully:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error assigning course:', err);
    res.status(500).json({ error: err.message });
  }
});

// Backend route example (Node.js/Express)
router.get('/program-leader/:id/reports', async (req, res) => {
  try {
    const programLeaderId = req.params.id;
    
    // Get program leader's program
    const programLeader = await ProgramLeader.findById(programLeaderId);
    if (!programLeader) {
      return res.status(404).json({ error: 'Program leader not found' });
    }
    
    // Get reports for courses in their program
    const reports = await LectureReport.find()
      .populate('course_id')
      .where('course_id.program').equals(programLeader.program)
      .populate('lecturer_id', 'name');
    
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new course
router.post('/courses', auth, async (req, res) => {
  try {
    const { course_code, course_name, stream } = req.body;
    
    const result = await pool.query(
      'INSERT INTO courses (course_code, course_name, stream) VALUES ($1, $2, $3) RETURNING *',
      [course_code, course_name, stream]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all lecturers
router.get('/lecturers', auth, async (req, res) => {
  try {
    const lecturers = await pool.query(
      'SELECT id, name, email, faculty FROM users WHERE role = $1',
      ['lecturer']
    );
    res.json(lecturers.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PL monitoring - get program statistics
router.get('/monitoring', auth, async (req, res) => {
  try {
    console.log('Fetching monitoring stats for PL');
    
    const stats = await pool.query(`
      SELECT 
        COUNT(DISTINCT r.lecturer_id) as total_lecturers,
        COUNT(r.id) as total_reports,
        AVG(r.actual_students_present) as avg_attendance,
        COUNT(DISTINCT c.id) as total_courses,
        COUNT(DISTINCT u.id) as total_students,
        COUNT(DISTINCT f.id) as total_feedback
      FROM reports r 
      LEFT JOIN courses c ON r.course_code = c.course_code
      LEFT JOIN users u ON u.role = 'student'
      LEFT JOIN feedback f ON f.report_id = r.id
    `);
    
    console.log('PL stats:', stats.rows[0]);
    res.json(stats.rows[0]);
  } catch (err) {
    console.error('Error fetching PL monitoring:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
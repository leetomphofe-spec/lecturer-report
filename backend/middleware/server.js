const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/student', require('./routes/student'));
app.use('/api/lecturer', require('./routes/lecturer'));
app.use('/api/prl', require('./routes/prl'));
app.use('/api/pl', require('./routes/pl'));
app.use('/api/guest', require('./routes/guest'));

// Guest dashboard - public data
app.get('/api/guest/dashboard', async (req, res) => {
  try {
    const pool = require('./config/database');
    const reports = await pool.query(`
      SELECT r.*, u.name as lecturer_name 
      FROM reports r 
      JOIN users u ON r.lecturer_id = u.id 
      WHERE r.lecturer_name IS NOT NULL 
      ORDER BY r.created_at DESC 
      LIMIT 10
    `);
    res.json(reports.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running successfully!' });
});

// Add this with other route imports
const exportRoutes = require('./routes/export');

// Add this with other route uses
app.use('/api/export', exportRoutes);

// Routes - IMPORTANT: Order matters!
app.use('/api/auth', require('./routes/auth'));
app.use('/api/guest', require('./routes/guest'));
app.use('/api/enrollments', require('./routes/enrollments'));
app.use('/api/student', require('./routes/student'));
app.use('/api/lecturer', require('./routes/lecturer'));
app.use('/api/prl', require('./routes/prl'));
app.use('/api/pl', require('./routes/pl'));

// Guest dashboard - public data (keep this as fallback)
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
    console.error('Error in guest dashboard:', err);
    res.status(500).json({ error: err.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'LUCT Reporting System API is running'
  });
});

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log('=================================');
  console.log('🚀 LUCT Reporting System Server');
  console.log('=================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Database: ${process.env.DATABASE_URL ? 'Connected' : 'Configuring...'}`);
  console.log('=================================');
  console.log('Available endpoints:');
  console.log(`  GET  /api/test - Server test`);
  console.log(`  GET  /api/health - Health check`);
  console.log(`  GET  /api/guest/dashboard - Guest data`);
  console.log(`  POST /api/auth/login - User login`);
  console.log(`  POST /api/auth/register - User registration`);
  console.log(`  GET  /api/student/monitoring/:id - Student monitoring`);
  console.log(`  GET  /api/lecturer/reports/:id - Lecturer reports`);
  console.log(`  GET  /api/prl/courses/:id - PRL courses`);
  console.log(`  GET  /api/pl/courses - PL courses`);
  console.log(`  GET  /api/enrollments/available-classes - Available classes`);
  console.log('=================================');
});
const express = require('express');
const { Report } = require('../models');
const router = express.Router();

// Public reports for guest dashboard
router.get('/reports', async (req, res) => {
  try {
    const reports = await Report.findAll();
    res.json(reports.slice(0, 20)); // Limit for guest view
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search functionality for guests
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const results = await Report.search(query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
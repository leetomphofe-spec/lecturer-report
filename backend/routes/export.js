const express = require('express');
const ExcelJS = require('exceljs');
const router = express.Router();
const auth = require('../middleware/auth');
const Report = require('../models/Report');
const Course = require('../models/Course');

// Export reports to Excel
router.get('/reports/excel', auth, async (req, res) => {
  try {
    const { startDate, endDate, courseCode, lecturerName } = req.query;
    let filter = {};

    // Build filter based on user role and query parameters
    if (req.user.role === 'lecturer') {
      filter.lecturerName = req.user.name;
    } else if (req.user.role === 'prl') {
      // PRL can see reports from their stream
      // Add stream filtering logic here
    }

    if (startDate && endDate) {
      filter.dateOfLecture = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (courseCode) {
      filter.courseCode = courseCode;
    }

    if (lecturerName) {
      filter.lecturerName = lecturerName;
    }

    const reports = await Report.find(filter).populate('courseId').sort({ dateOfLecture: -1 });

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Lecture Reports');

    // Define columns
    worksheet.columns = [
      { header: 'Faculty Name', key: 'facultyName', width: 20 },
      { header: 'Class Name', key: 'className', width: 15 },
      { header: 'Week of Reporting', key: 'weekOfReporting', width: 15 },
      { header: 'Date of Lecture', key: 'dateOfLecture', width: 15 },
      { header: 'Course Name', key: 'courseName', width: 25 },
      { header: 'Course Code', key: 'courseCode', width: 15 },
      { header: 'Lecturer Name', key: 'lecturerName', width: 20 },
      { header: 'Students Present', key: 'actualStudents', width: 15 },
      { header: 'Total Students', key: 'totalStudents', width: 15 },
      { header: 'Venue', key: 'venue', width: 15 },
      { header: 'Scheduled Time', key: 'scheduledTime', width: 15 },
      { header: 'Topic Taught', key: 'topicTaught', width: 30 },
      { header: 'Learning Outcomes', key: 'learningOutcomes', width: 40 },
      { header: 'Recommendations', key: 'recommendations', width: 40 }
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6E6FA' }
    };

    // Export courses to Excel
router.get('/courses/excel', auth, async (req, res) => {
  try {
    const courses = await Course.find().populate('lecturer').sort({ courseCode: 1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Courses');

    worksheet.columns = [
      { header: 'Course Code', key: 'courseCode', width: 15 },
      { header: 'Course Name', key: 'courseName', width: 30 },
      { header: 'Lecturer', key: 'lecturerName', width: 20 },
      { header: 'Stream', key: 'stream', width: 15 },
      { header: 'Credits', key: 'credits', width: 10 }
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6E6FA' }
    };

    courses.forEach(course => {
      worksheet.addRow({
        courseCode: course.courseCode,
        courseName: course.courseName,
        lecturerName: course.lecturer?.name || 'Not assigned',
        stream: course.stream,
        credits: course.credits
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=courses.xlsx');

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Courses export error:', error);
    res.status(500).json({ message: 'Error generating courses Excel file' });
  }
});

    // Add data rows
    reports.forEach(report => {
      worksheet.addRow({
        facultyName: report.facultyName,
        className: report.className,
        weekOfReporting: report.weekOfReporting,
        dateOfLecture: report.dateOfLecture.toISOString().split('T')[0],
        courseName: report.courseName,
        courseCode: report.courseCode,
        lecturerName: report.lecturerName,
        actualStudents: report.actualStudents,
        totalStudents: report.totalStudents,
        venue: report.venue,
        scheduledTime: report.scheduledTime,
        topicTaught: report.topicTaught,
        learningOutcomes: report.learningOutcomes,
        recommendations: report.recommendations
      });
    });

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=lecture-reports.xlsx');

    // Write to response
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Excel export error:', error);
    res.status(500).json({ message: 'Error generating Excel file' });
  }
});

module.exports = router;
// Import necessary modules
const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Route to handle POST requests to /api/students
router.post('/', async (req, res) => {
  try {
    // Extract student data from request body
    const { name, dob, gpa } = req.body;

    // Create a new student instance
    const student = new Student({ name, dob, gpa });

    // Save the student to the database
    await student.save();

    // Respond with the saved student object
    res.status(201).json(student);
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Export the router
module.exports = router;


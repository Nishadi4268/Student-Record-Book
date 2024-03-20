const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');


// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { name, teacherID, email, password } = req.body;
    const teacher = new Teacher({ name, teacherID, email, password });
    await teacher.save();
    res.status(201).json(teacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isMatch = teacher.comparePassword(password);
    if (isMatch) {
      res.json(teacher);
    } else {
      res.status(400).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Forgot password route
router.post('/forgotpassword', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ message: 'Email is not signed up' });
    }
    
    // Update the password
    teacher.password = newPassword;
    await teacher.save();
    
    res.send('Password reset successfully');
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add student route
router.post('/addstudent', [
  check('name', 'Name is required').notEmpty(),
  check('dob', 'Date of Birth is required').notEmpty(),
  check('gpa', 'GPA is required').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const { name, dob, gpa } = req.body;
    const image = req.files.image;

    // Ensure the uploads directory exists
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    // Save the image to the server
    const imageFileName = Date.now() + path.extname(image.name);
    image.mv(path.join(uploadDir, imageFileName));

    // Create and save the student to the database
    const student = new Student({ name, dob, gpa, image: `/uploads/${imageFileName}` });
    await student.save();

    res.status(201).json({ message: 'Student added successfully', student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get all students
router.get('/studentdetails', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete student by id
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    await student.remove();
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});


module.exports = router;
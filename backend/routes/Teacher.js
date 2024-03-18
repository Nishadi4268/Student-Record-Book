const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

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
  check('image', 'Image is required').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, dob, gpa, image } = req.body;
  try {
    const student = new Student({ name, dob, gpa, image });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});


module.exports = router;

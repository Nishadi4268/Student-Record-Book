const Teacher = require('../models/Teacher.js');
const Student = require('../models/Student.js');

// Teacher signup
const signup = async (req, res) => {
  try {
    const { name, teacherID, email, password } = req.body;
    const teacher = new Teacher({ name, teacherID, email, password });
    await teacher.save();
    res.status(201).send(teacher);
  } catch (err) {
    res.status(400).send(err);
  }
};

// Teacher login
const login = async (req, res) => {
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
};

// Teacher forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ message: 'Email is not signed up' });
    }
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    teacher.password = hashedPassword;
    await teacher.save();
    
    res.send('Password reset successfully');
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add student
const addStudent = async (req, res) => {
  try {
    const { name, dob, gpa, image } = req.body;
    // Create and save the student to the database
    const student = new Student({ name, dob, gpa, image });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { signup, login, forgotPassword, addStudent };


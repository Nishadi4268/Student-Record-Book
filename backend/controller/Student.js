const path = require('path');
const Student = require('../models/Student');

// Add student
const addStudent = async (req, res) => {
  try {
    const { name, dob, gpa } = req.body;
    const image = req.files.image;

    // Save the image to the server
    const imageFileName = Date.now() + path.extname(image.name);
    image.mv(path.join(__dirname, '../uploads', imageFileName));

    // Create and save the student to the database
    const student = new Student({ name, dob, gpa, image: `/uploads/${imageFileName}` });
    await student.save();

    res.status(201).json({ message: 'Student added successfully', student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      throw new Error('Student not found');
    }
    res.send(student);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Get all students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete student by id
const deleteStudentById = async (req, res) => {
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
};

module.exports = { addStudent, deleteStudent, getStudents, deleteStudentById };

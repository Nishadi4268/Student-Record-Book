const Student = require('../models/Student');

// Add student
const addStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).send(student);
  } catch (err) {
    res.status(400).send(err);
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

module.exports = { addStudent, deleteStudent };

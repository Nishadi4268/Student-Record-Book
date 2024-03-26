const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  gpa: { type: Number, required: true },
  image: { type: String, required: true }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;

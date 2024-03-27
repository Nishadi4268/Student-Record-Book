const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Add student route
router.post('/addstudent', async (req, res) => {
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
    const student = new Student({ name, dob, gpa, image: `http://localhost:5000/uploads/${imageFileName}` });
    await student.save();

    res.status(201).json({ message: 'Student added successfully', student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});



// Route to get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
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
    await student.deleteOne(); // Use deleteOne() instead of remove()
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});



// Update student by id
router.put('/:id', async (req, res) => {
  try {
    const { name, dob, gpa } = req.body;
    const student = await Student.findByIdAndUpdate(req.params.id, { name, dob, gpa }, { new: true });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Define a route to get a student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});


// Export the router
module.exports = router;

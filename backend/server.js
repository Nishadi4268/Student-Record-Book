const express = require('express');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const cors = require('cors');
const { mongoURI } = require('./config');
const studentRoutes = require('./routes/Student');
const teacherRoutes = require('./routes/Teacher');
const Student = require('./models/Student');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Serve uploaded images from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware to handle file uploads
app.use(fileUpload());

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit with failure
  });

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000'
}));

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);

// PUT route to update student details
app.put('/api/students/:id', async (req, res) => {
  try {
    const { name, dob, gpa } = req.body;
    const student = await Student.findByIdAndUpdate(req.params.id, { name, dob, gpa }, { new: true });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import Student from "../models/Student.js";

// Get all students
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get student by roll number
export const getStudentByRoll = async (req, res) => {
  try {
    const student = await Student.findOne({ rollNumber: req.params.rollNumber });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update student info
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { rollNumber: req.params.rollNumber },
      req.body,
      { new: true }
    );

    if (!student) return res.status(404).json({ message: "Student not found" });

    // Emit real-time update
    const io = req.app.get("io");
    io.emit("studentUpdated", student);

    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


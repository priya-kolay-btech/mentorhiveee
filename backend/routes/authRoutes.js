import express from "express";
import Student from "../models/Student.js";

const router = express.Router();

// Student login or auto-create
router.post("/login", async (req, res) => {
  const { rollNumber } = req.body;

  if (!rollNumber) {
    return res.status(400).json({ message: "Roll number is required" });
  }

  try {
    let student = await Student.findOne({ rollNumber });

    if (!student) {
      // Create new student with default values
      student = new Student({
        rollNumber,
        studentName:"",
        mentorName: "",
        parentEmail: "",
        parentPhone: "",
        parentAddress: "",
        healthIssues: "",
        extracurricular: "",
        achievements: "",
        classAttendance: 0,
        backlogs: 0,
        cgpa: 0,
        meetingsAttended: 0
      });
      await student.save();
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;





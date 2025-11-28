import express from "express";
import Student from "../models/Student.js";
import Mentor from "../models/Mentor.js";

const router = express.Router();



// Get all students
router.get("/students", async (req, res) => {
  const students = await Student.find().populate("mentorId", "mentorName rollNumber");
  res.json(students);
});

// Get all mentors
router.get("/mentors", async (req, res) => {
  const mentors = await Mentor.find();
  res.json(mentors);
});


// Assign mentor to student
router.put("/assign-mentor", async (req, res) => {
  try {
    const { studentId, mentorId } = req.body;

    // Check mentor exists
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) return res.status(404).json({ error: "Mentor not found" });

    // Update student's mentorId
    const student = await Student.findByIdAndUpdate(
      studentId,
      { mentorId },
      { new: true }
    ).populate("mentorId", "rollNumber mentorName email");

    res.json({ message: "Mentor assigned successfully", student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to assign mentor" });
  }
});

export default router;

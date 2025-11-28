import express from "express";
import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";
import { sendAbsenteeAlert } from "../utils/absenteeNotifier.js";

const router = express.Router();

// Mark attendance
router.post("/mark", async (req, res) => {
  try {
    const { studentId, status, date } = req.body;

    // Save attendance record
    const attendance = new Attendance({ studentId, status, date });
    await attendance.save();

    // If absent, send alert
    if (status === "Absent") {
      const student = await Student.findById(studentId);

      if (student) {
        await sendAbsenteeAlert(
          student.parentEmail,
          student.parentPhone,
          student.name,
          date
        );
      }
    }

    res.json({ message: "Attendance marked successfully" });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Error marking attendance" });
  }
});

export default router;

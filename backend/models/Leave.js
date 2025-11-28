












import express from "express";
import Student from "../models/Student.js";

const router = express.Router();

/**
 * @route   POST /api/leave/submit
 * @desc    Submit leave request for a student
 */
router.post("/submit", async (req, res) => {
  const { studentId, fromDate, toDate, reason } = req.body;

  if (!studentId || !fromDate || !toDate || !reason) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.leaveRequests.push({
      fromDate,
      toDate,
      reason,
      status: "Pending",
    });

    await student.save();
    res.json({ message: "Leave request submitted", leaveRequests: student.leaveRequests });
  } catch (error) {
    console.error("Error submitting leave:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;













import express from "express";
import mongoose from "mongoose";
import LeaveApplication from "../models/LeaveApplication.js";
import Student from "../models/Student.js";

const router = express.Router();

/**
 * Submit Leave (Mentee)
 */



router.post("/", async (req, res) => {
  try {
    const { menteeId, mentorId, reason, fromDate, toDate } = req.body;

    if (!menteeId || !mentorId || !reason?.trim() || !fromDate || !toDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Verify mentee exists
    const student = await Student.findById(menteeId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // ✅ Verify mentor exists
    const mentor = await mongoose.model("Mentor").findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // ✅ Create leave
    const leave = new LeaveApplication({
      menteeId,
      mentorId,
      menteeName: student.studentName,
      reason: reason.trim(),
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      status: "Pending"
    });

    await leave.save();
    res.status(201).json({ message: "Leave application submitted successfully", leave });
  } catch (error) {
    console.error("Error submitting leave:", error);
    res.status(500).json({ message: "Server error while submitting leave" });
  }
});















/**
 * Get ALL leaves (Admin only)
 */
router.get("/", async (req, res) => {
  try {
    const leaves = await LeaveApplication.find()
      .populate("menteeId", "rollNumber studentName")
      .populate("mentorId", "name email")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    console.error("Error fetching all leaves:", error);
    res.status(500).json({ message: "Server error while fetching leaves" });
  }
});

/**
 * Mentor: Get their mentees' leave requests
 */
router.get("/mentor/:mentorId", async (req, res) => {
  try {
    const { mentorId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
      return res.status(400).json({ message: "Invalid mentorId" });
    }

    const leaves = await LeaveApplication.find({ mentorId })
      .populate("menteeId", "rollNumber studentName")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    console.error("Error fetching mentor leaves:", error);
    res.status(500).json({ message: "Server error while fetching mentor leaves" });
  }
});

/**
 * Mentee: Get their leave history
 */
router.get("/mentee/:menteeId", async (req, res) => {
  try {
    const { menteeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(menteeId)) {
      return res.status(400).json({ message: "Invalid menteeId" });
    }

    const leaves = await LeaveApplication.find({ menteeId })
      .populate("mentorId", "name email")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    console.error("Error fetching mentee leaves:", error);
    res.status(500).json({ message: "Server error while fetching leave history" });
  }
});

/**
 * Mentor: Approve/Reject Leave
 */
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'Approved' or 'Rejected'" });
    }

    const leave = await LeaveApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: "Leave application not found" });
    }

    res.json({ message: `Leave ${status.toLowerCase()} successfully`, leave });
  } catch (error) {
    console.error("Error updating leave status:", error);
    res.status(500).json({ message: "Server error while updating leave status" });
  }
});

export default router;


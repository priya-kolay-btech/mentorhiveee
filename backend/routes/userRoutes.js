import express from "express";
import Student from "../models/Student.js";
import Mentor from "../models/Mentor.js";

const router = express.Router();

// POST /api/users/login
router.post("/login", async (req, res) => {
  const { rollNumber, role } = req.body;

  try {
    let user;
    if (role === "mentor") user = await Mentor.findOne({ rollNumber });
    else user = await Student.findOne({ rollNumber });

    if (!user) return res.status(400).json({ message: "Invalid login details" });

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

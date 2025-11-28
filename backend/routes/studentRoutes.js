




import express from "express";
import Student from "../models/Student.js";

const router = express.Router();



// // ✅ Get all students
// router.get("/", async (req, res) => {
//   try {
//     const students = await Student.find();
//     res.json(students);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// ✅ Get students (optionally filter by mentorId)
router.get("/", async (req, res) => {
  try {
    const { mentorId } = req.query;
    const filter = mentorId ? { mentorId } : {}; // only show this mentor’s students
    const students = await Student.find(filter);
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});




// ✅ Get single student by rollNumber
router.get("/roll/:rollNumber", async (req, res) => {
  try {
    const student = await Student.findOne({ rollNumber: req.params.rollNumber });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// ✅ Get single student by MongoDB _id
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update student by rollNumber
router.put("/roll/:rollNumber", async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { rollNumber: req.params.rollNumber },
      req.body,
      { new: true }
    );
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// ✅ Update student by MongoDB _id



// router.put("/:id", async (req, res) => {
//   try {
//     const student = await Student.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!student) return res.status(404).json({ message: "Student not found" });
//     res.json(student);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });


// ✅ Update student by MongoDB _id
router.put("/:id", async (req, res) => {
  try {
    const { mentorId, mentorName, ...rest } = req.body; // extract mentor fields

    const updateData = {
      ...rest,
      ...(mentorId && { mentorId }),     // only update if provided
      ...(mentorName && { mentorName }), // only update if provided
    };

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json(student);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});



export default router;
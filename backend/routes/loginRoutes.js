




// import express from "express";
// import Student from "../models/Student.js";
// import Mentor from "../models/Mentor.js";

// const router = express.Router();

// router.post("/", async (req, res) => {
//   const { rollNumber, role } = req.body;
//   console.log("Login request:", req.body); // Debug log

//   try {
//     if (role === "mentee") {
//       let student = await Student.findOne({ rollNumber });
//       if (!student) {
//         student = await Student.create({ rollNumber });
//       }
//       return res.json({ role: "mentee", student });
//     } else if (role === "mentor") {
//       let mentor = await Mentor.findOne({ rollNumber });
//       if (!mentor) {
//         mentor = await Mentor.create({ rollNumber });
//       }
//       return res.json({ role: "mentor", mentor });
//     } else {
//       return res.status(400).json({ message: "Invalid role" });
//     }
//   } catch (err) {
//     console.error("Login error:", err.message);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;



import express from "express";
import Student from "../models/Student.js";
import Mentor from "../models/Mentor.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { rollNumber, role } = req.body;
  console.log("Login request:", req.body); // Debug log

  try {
    if (role === "mentee") {
      let student = await Student.findOne({ rollNumber });
      if (!student) {
        student = await Student.create({ rollNumber });
      }
      return res.json({ role: "mentee", student });
    } 
    
    else if (role === "mentor") {
      let mentor = await Mentor.findOne({ rollNumber });
      if (!mentor) {
        mentor = await Mentor.create({
          rollNumber,
          isOnline: true,         // ✅ mark new mentor as online
          lastLoginAt: new Date() // ✅ store last login
        });
      } else {
        mentor.isOnline = true;   // ✅ mark existing mentor online
        mentor.lastLoginAt = new Date();
        await mentor.save();
      }
      return res.json({ role: "mentor", mentor });
    } 
    
    else {
      return res.status(400).json({ message: "Invalid role" });
    }
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

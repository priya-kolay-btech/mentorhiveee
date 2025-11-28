




import express from "express";
import Mentor from "../models/Mentor.js";

const router = express.Router();

// ✅ Mentor login
router.post("/login", async (req, res) => {
  try {
    const { employeeId, password, role } = req.body;

    // Only mentors allowed here
    if (role !== "mentor") {
      return res.status(400).json({ message: "Invalid role for this route" });
    }

    // Find mentor by employeeId
    let mentor = await Mentor.findOne({ employeeId });

    if (!mentor) {
      // If mentor doesn’t exist, create a new one
      mentor = await Mentor.create({
        employeeId,
        password,
        isOnline: true,
        lastLoginAt: new Date(),
      });
    } else {
      // Update existing mentor login status
      mentor.isOnline = true;
      mentor.lastLoginAt = new Date();
      await mentor.save();
    }

    // Emit socket event for online status
    req.io?.emit("mentorLoggedIn", {
      id: mentor._id,
      employeeId: mentor.employeeId,
      lastLoginAt: mentor.lastLoginAt,
    });

//     res.json({
//       message: "✅ Mentor logged in successfully",
//       mentor,
//     });
//   } catch (err) {
//     console.error("Mentor login error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });
 res.json({
      message: "✅ Mentor logged in successfully",
      mentor: {
        _id: mentor._id,
        employeeId: mentor.employeeId,
        mentorName: mentor.mentorName || "", // safe fallback
        lastLoginAt: mentor.lastLoginAt,
      },
    });

  } catch (err) {
    console.error("Mentor login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/online", async (req, res) => {
  console.log("👉 /api/mentors/online was called");
  try {
    const mentors = await Mentor.find(
      { isOnline: true },
      "rollNumber mentorName lastLoginAt"
    );
    res.json(mentors);
  } catch (err) {
    console.error("Get online mentors error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Mentor logout
router.post("/logout", async (req, res) => {
  try {
    const { employeeId } = req.body;

    let mentor = await Mentor.findOne({ employeeId });

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    mentor.isOnline = false;
    await mentor.save();

    // Emit socket event for logout
    req.io?.emit("mentorLoggedOut", {
      id: mentor._id,
      employeeId: mentor.employeeId,
    });

    res.json({ message: "✅ Mentor logged out successfully" });
  } catch (err) {
    console.error("Mentor logout error:", err);
    res.status(500).json({ message: "Server error" });
  }
});






export default router;
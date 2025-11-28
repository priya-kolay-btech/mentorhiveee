







import express from "express";
import Meeting from "../models/Meeting.js";

const router = express.Router();





router.post("/", async (req, res) => {
  try {
    const meeting = await Meeting.create(req.body);

    // Notify mentor
    if (meeting.mentorId) {
      req.io.to(meeting.mentorId.toString()).emit("newMeeting", meeting);

      // 🔹 Find all mentees who selected this mentor
      const mentees = await Student.find({ mentorId: meeting.mentorId }).select("_id");
      mentees.forEach((mentee) => {
        req.io.to(mentee._id.toString()).emit("newMeeting", meeting);
      });
    }

    res.status(201).json(meeting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create meeting" });
  }
});




router.get("/", async (req, res) => {
  try {
    const { mentorId, menteeId } = req.query;

    let query = {};
    if (mentorId) query.mentorId = mentorId;
    if (menteeId) query.menteeId = menteeId;

    const meetings = await Meeting.find(query).sort({ date: -1 });
    res.json(meetings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch meetings" });
  }
});

export default router;









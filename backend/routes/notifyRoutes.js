// routes/notifyRoutes.js
import express from "express";
import nodemailer from "nodemailer";
import twilio from "twilio";

const router = express.Router();

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

router.post("/notify-absent", async (req, res) => {
  const absentStudents = req.body;

  if (!absentStudents || absentStudents.length === 0) {
    return res.status(400).json({ message: "No absent students provided" });
  }

  try {
    // Setup email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    for (let student of absentStudents) {
      // 1️⃣ Send Email
      await transporter.sendMail({
        from: `"Mentor Dashboard" <${process.env.EMAIL_USER}>`,
        to: student.parentEmail,
        subject: `Absentee Alert - ${student.studentName}`,
        text: `Dear Parent, your child ${student.studentName} (Roll No: ${student.rollNumber}) was marked absent today.`,
      });

      // 2️⃣ Send SMS
      await twilioClient.messages.create({
        body: `Absentee Alert: ${student.studentName} (Roll ${student.rollNumber}) was marked absent today.`,
        from: process.env.TWILIO_PHONE,
        to: student.parentPhone,
      });
    }

    res.json({ message: "Alerts sent successfully" });
  } catch (err) {
    console.error("Alert error:", err);
    res.status(500).json({ message: "Failed to send alerts" });
  }
});

export default router;

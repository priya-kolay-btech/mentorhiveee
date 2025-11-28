import dotenv from "dotenv";
import mongoose from "mongoose";
import Student from "./models/Student.js";
import { connectDB } from "./config/db.js";

dotenv.config();
connectDB();

const seedStudent = async () => {
  await Student.create({
    rollNumber: "CS23BTECH001",
    mentorName: "Dr. Achyuta Samanta",
    parentEmail: "parent@example.com",
    parentPhone: "1234567890",
    parentAddress: "Bhubaneswar",
    healthIssues: "",
    extracurricular: "",
    achievements: "",
    classAttendance: 90,
    backlogs: 0,
    cgpa: 8.5,
    meetingsAttended: 0
  });
  console.log("✅ Student Added");
  process.exit();
};

seedStudent();

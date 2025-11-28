


import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, default: "Pending" } // Optional: Pending, Approved, Rejected
}, { timestamps: true });

const studentSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  studentName: { type: String, default: "" },


mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor" }, // ✅ link to mentor
  

mentorName: { type: String, default: "" },
  parentEmail: { type: String, default: "" },
  parentPhone: { type: String, default: "" },
  parentAddress: { type: String, default: "" },
  healthIssues: { type: String, default: "" },
  extracurricular: { type: String, default: "" },
  achievements: { type: String, default: "" },
  classAttendance: { type: Number, default: 0 },
  backlogs: { type: Number, default: 0 },
  cgpa: { type: Number, default: 0 },
  meetingsAttended: { type: Number, default: 0 },
  

  // ✅ Add this field to track leave requests
  leaveRequests: [leaveSchema]

}, { timestamps: true });

export default mongoose.model("Student", studentSchema);
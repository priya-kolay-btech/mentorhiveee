import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  name: { type: String },
  rollNumber: { type: String },
  parentEmail: { type: String },
  parentPhone: { type: String },
  status: { type: String, enum: ["Present", "Absent"], default: "Absent" } // default Absent until mentor marks Present
});


const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
   attendance: [attendanceSchema]
});

export default mongoose.model("Meeting", meetingSchema);

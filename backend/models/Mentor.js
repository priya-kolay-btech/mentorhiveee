


// import mongoose from "mongoose";

// const mentorSchema = new mongoose.Schema({
//   rollNumber: { type: String, required: true, unique: true }, // keep required
//   mentorName: { type: String }, // optional
//   email: { type: String },      // optional
//   password: { type: String },   // optional
// });

// export default mongoose.model("Mentor", mentorSchema);


import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  mentorName: { type: String },
  email: { type: String },
  password: { type: String },
  isOnline: { type: Boolean, default: false },   // ✅ track online status
  lastLoginAt: { type: Date },                   // ✅ last login timestamp
});

export default mongoose.model("Mentor", mentorSchema);

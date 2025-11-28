// // import mongoose from "mongoose";

// // const leaveApplicationSchema = new mongoose.Schema({
// //   menteeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// //   menteeName: { type: String, required: true },
// //   reason: { type: String, required: true },
// //   fromDate: { type: Date, required: true },
// //   toDate: { type: Date, required: true },
// //   status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
// // }, { timestamps: true });

// // export default mongoose.model("LeaveApplication", leaveApplicationSchema);





// import mongoose from "mongoose";

// const leaveApplicationSchema = new mongoose.Schema({
//   menteeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", required: true },
  
//   menteeName: { type: String, required: true },
//   reason: { type: String, required: true },
//   fromDate: { type: Date, required: true },
//   toDate: { type: Date, required: true },
//   status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
// }, { timestamps: true });

// export default mongoose.model("LeaveApplication", leaveApplicationSchema);





import mongoose from "mongoose";

const leaveApplicationSchema = new mongoose.Schema({
  menteeId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true }, // ✅ changed to Student
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", required: true },

  reason: { type: String, required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
}, { timestamps: true });

export default mongoose.model("LeaveApplication", leaveApplicationSchema);
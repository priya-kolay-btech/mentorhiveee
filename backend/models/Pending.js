// // // models/Pending.js
// // import mongoose from "mongoose";

// // const pendingSchema = new mongoose.Schema({
// //   students: [
// //     {
// //       name: String,
// //       roll: String,
// //       parentEmail: String,
// //     },
// //   ],
// //   createdAt: {
// //     type: Date,
// //     default: Date.now,
// //   },
// // });

// // export default mongoose.model("Pending", pendingSchema);


// import mongoose from "mongoose";

// const pendingSchema = new mongoose.Schema({
//   students: [
//     {
//       name: { type: String, required: true },
//       roll: { type: String, required: true },
//       parentEmail: { type: String, required: true }
//     }
//   ],
//   createdAt: { type: Date, default: Date.now }
// });

// export default mongoose.model("Pending", pendingSchema);


import mongoose from "mongoose";

const pendingSchema = new mongoose.Schema({
  students: [
    {
      name: { type: String, required: true },
      roll: { type: String, required: true },
      parentEmail: { type: String, required: true },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Pending", pendingSchema);

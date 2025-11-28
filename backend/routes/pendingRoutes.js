
// // // // // import express from "express";
// // // // // import Pending from "../models/Pending.js";
// // // // // import Student from "../models/Student.js";

// // // // // export default function pendingRoutes(io) {
// // // // //   const router = express.Router();

// // // // //   // POST /api/pending (replace mode)
// // // // //   router.post("/", async (req, res) => {
// // // // //     try {
// // // // //       const { pendingList } = req.body;

// // // // //       if (!pendingList || !Array.isArray(pendingList)) {
// // // // //         return res.status(400).json({ error: "pendingList must be an array" });
// // // // //       }

// // // // //       // ✅ Replace the existing pending list (keep only one document)
// // // // //       const savedPending = await Pending.findOneAndUpdate(
// // // // //         {}, // find any document
// // // // //         { students: pendingList },
// // // // //         { new: true, upsert: true } // create if none exists
// // // // //       );

// // // // //       // ✅ Optional: Update students table
// // // // //       await Student.updateMany(
// // // // //         {}, // reset all
// // // // //         { $set: { isPending: false } }
// // // // //       );

// // // // //       for (const student of pendingList) {
// // // // //         if (student._id) {
// // // // //           await Student.findByIdAndUpdate(student._id, { isPending: true });
// // // // //         }
// // // // //       }

// // // // //       // ✅ Emit update to mentees in real-time
// // // // //       io.emit("pendingListUpdated", pendingList);

// // // // //       res.status(200).json({
// // // // //         message: "Pending list replaced & broadcasted successfully",
// // // // //         data: savedPending
// // // // //       });
// // // // //     } catch (error) {
// // // // //       console.error("Error saving pending list:", error);
// // // // //       res.status(500).json({ error: "Server error" });
// // // // //     }
// // // // //   });

// // // // //   return router;
// // // // // }


// // // // // routes/pendingRoutes.js
// // // // import express from "express";
// // // // import Pending from "../models/Pending.js";

// // // // export default function pendingRoutes(io) {
// // // //   const router = express.Router();

// // // //   // POST /api/pending → Save the pending list
// // // //   router.post("/", async (req, res) => {
// // // //     try {
// // // //       const { pendingList } = req.body;

// // // //       if (!pendingList || !Array.isArray(pendingList)) {
// // // //         return res.status(400).json({ error: "pendingList must be an array" });
// // // //       }

// // // //       // Replace existing pending list or create new
// // // //       const savedPending = await Pending.findOneAndUpdate(
// // // //         {},
// // // //         { students: pendingList },
// // // //         { new: true, upsert: true }
// // // //       );

// // // //       // Emit to all connected clients
// // // //       io.emit("pendingListUpdated", pendingList);

// // // //       res.status(200).json({
// // // //         message: "✅ Pending list saved & broadcasted successfully",
// // // //         data: savedPending,
// // // //       });
// // // //     } catch (error) {
// // // //       console.error("Error saving pending list:", error);
// // // //       res.status(500).json({ error: "Server error" });
// // // //     }
// // // //   });

// // // //   // GET /api/pending → Fetch current pending list
// // // //   router.get("/", async (req, res) => {
// // // //     try {
// // // //       const pending = await Pending.findOne({});
// // // //       res.status(200).json(pending || { students: [] });
// // // //     } catch (error) {
// // // //       console.error("Error fetching pending list:", error);
// // // //       res.status(500).json({ error: "Server error" });
// // // //     }
// // // //   });

// // // //   return router;
// // // // }



// // // import express from "express";
// // // import Pending from "../models/Pending.js";

// // // export default function pendingRoutes(io) {
// // //   const router = express.Router();

// // // // POST → Save pending list as new entry each time
// // // router.post("/", async (req, res) => {
// // //   try {
// // //     console.log("Received pendingList:", req.body.pendingList);

// // //     const { pendingList } = req.body;
// // //     if (!pendingList || !Array.isArray(pendingList)) {
// // //       return res.status(400).json({ error: "pendingList must be an array" });
// // //     }

// // //     const savedPending = await Pending.create({
// // //       students: pendingList,
// // //       createdAt: new Date()
// // //     });

// // //     // Broadcast via Socket.IO
// // //     io.emit("pendingListUpdated", pendingList);

// // //     console.log("Pending list saved:", savedPending);

// // //     return res.status(200).json({
// // //       message: "✅ Pending list saved & broadcasted successfully",
// // //       data: savedPending,
// // //     });
// // //   } catch (error) {
// // //     console.error("Error saving pending list:", error);
// // //     return res.status(500).json({ error: "Server error" });
// // //   }
// // // });


// // //   // GET → Fetch current pending list
// // //   router.get("/", async (req, res) => {
// // //     try {
// // //       const pending = await Pending.findOne({});
// // //       return res.status(200).json(pending || { students: [] });
// // //     } catch (error) {
// // //       console.error("Error fetching pending list:", error);
// // //       return res.status(500).json({ error: "Server error" });
// // //     }
// // //   });

// // //   return router;
// // // }

// // import express from "express";
// // import Pending from "../models/Pending.js";

// // export default function pendingRoutes(io) {
// //   const router = express.Router();

// //   // POST → Save new pending list
// //   router.post("/", async (req, res) => {
// //     try {
// //       const { pendingList } = req.body;

// //       if (!pendingList || !Array.isArray(pendingList)) {
// //         return res.status(400).json({ error: "pendingList must be an array" });
// //       }

// //       const savedPending = await Pending.create({ students: pendingList });

// //       // Emit via Socket.IO
// //       io.emit("pendingListUpdated", pendingList);

// //       return res.status(200).json({
// //         message: "✅ Pending list saved & broadcasted successfully",
// //         data: savedPending,
// //       });
// //     } catch (err) {
// //       console.error(err);
// //       return res.status(500).json({ error: "Server error" });
// //     }
// //   });

// //   // GET → Fetch latest pending list
// //   router.get("/", async (req, res) => {
// //     try {
// //       const pending = await Pending.find().sort({ createdAt: -1 }).limit(1);
// //       return res.status(200).json(pending[0] || { students: [] });
// //     } catch (err) {
// //       console.error(err);
// //       return res.status(500).json({ error: "Server error" });
// //     }
// //   });

// //   return router;
// // }

// import express from "express";
// import Pending from "../models/Pending.js";

// export default function pendingRoutes(io) {
//   const router = express.Router();

//   // Save pending students
//   router.post("/save", async (req, res) => {
//     try {
//       const { students } = req.body;
//       if (!students || !Array.isArray(students)) {
//         return res.status(400).json({ error: "students must be an array" });
//       }

//       const pending = new Pending({ students });
//       await pending.save();

//       // Emit to all connected clients
//       io.emit("pendingUpdated", pending);

//       console.log("Saved pending:", pending);

//       res.status(201).json(pending);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: err.message });
//     }
//   });

//   // Get all pending students
//   router.get("/all", async (req, res) => {
//     try {
//       const allPending = await Pending.find();
//       res.json(allPending);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: err.message });
//     }
//   });

//   return router;
// }


import express from "express";
import Pending from "../models/Pending.js";

export default function pendingRoutes(io) {
  const router = express.Router();

  // Save pending students
  router.post("/save", async (req, res) => {
    try {
      const { students } = req.body;
      if (!students || !Array.isArray(students)) {
        return res.status(400).json({ error: "students must be an array" });
      }

      const pending = new Pending({ students });
      await pending.save();

      // Emit to all connected clients
      io.emit("pendingUpdated", pending);

      console.log("✅ Saved pending:", pending);
      res.status(201).json(pending);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Get all pending students
  router.get("/all", async (req, res) => {
    try {
      const allPending = await Pending.find();
      res.json(allPending);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}

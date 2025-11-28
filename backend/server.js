



import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

import studentRoutes from "./routes/studentRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import pendingRoutes from "./routes/pendingRoutes.js";
//import mentorRoutes from "./routes/mentorRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";
//import userRoutes from "./routes/userRoutes.js";
import loginRoute from "./routes/loginRoutes.js"; 
//import adminRoutes from "./routes/adminRoutes.js";




dotenv.config();
const app = express();
const server = http.createServer(app);

// Allow frontend
const allowedOrigins = ["http://localhost:5173", "http://localhost:5000"];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Middleware
app.use(cors({ origin: allowedOrigins, methods: ["GET","POST","PUT","DELETE"], credentials: true }));
app.use(express.json());

// Attach io to req
app.use((req, res, next) => { req.io = io; next(); });

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/meetings", meetingRoutes);
//app.use("/api/mentors", mentorRoutes);
app.use("/api/pending", pendingRoutes(io));
app.use("/api/mentors", mentorRoutes);
//app.use("/api/users", userRoutes);
app.use("/api/login", loginRoute);

//app.use("/api/admin", adminRoutes);




// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error(err));

// Socket.IO connection
// io.on("connection", (socket) => {
//   console.log("🔌 Socket connected:", socket.id);
//   socket.on("disconnect", () => console.log("❌ Socket disconnected:", socket.id));
// });
// Socket.IO connection
io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  // 🔹 Mentee joins mentor’s room when they select/update mentor
  socket.on("joinMentorRoom", (mentorId) => {
    socket.join(mentorId.toString());
    console.log(`🟢 Mentee ${socket.id} joined room for mentor ${mentorId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});




const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));








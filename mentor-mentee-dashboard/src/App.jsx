



// import React from "react";
// import { Routes, Route, Link } from "react-router-dom";
// import Home from "./pages/Home.jsx";
// import MentorDashboard from "./pages/MentorDashboard.jsx";
// import MenteeDashboard from "./pages/MenteeDashboard.jsx";
// import Login from "./pages/Login.jsx";
// import LeaveApplication from "./pages/LeaveApplication.jsx";
// import MenteeLeaveForm from "./pages/MenteeLeaveForm.jsx";
// import MentorLeaveList from "./pages/MentorLeaveList.jsx";

// export default function App() {
//   return (
//     <div>
//       {/* Navbar */}
//       <nav style={{ padding: "10px", background: "#eee" }}>
//         <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
//         <Link to="/mentor" style={{ marginRight: "10px" }}>Mentor Dashboard</Link>
//         <Link to="/mentee" style={{ marginRight: "10px" }}>Mentee Dashboard</Link>
//         <Link to="/login">Login</Link>
//       </nav>

//       {/* Routes */}
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/mentor" element={<MentorDashboard />} />
//         <Route path="/mentee" element={<MenteeDashboard />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/leave-application" element={<LeaveApplication />} />
//         <Route path="/mentee-leave" element={<MenteeLeaveForm />} />
//         <Route path="/mentor-leaves" element={<MentorLeaveList />} />
//       </Routes>
//     </div>
//   );
// }



import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import MentorDashboard from "./pages/MentorDashboard.jsx";
import MenteeDashboard from "./pages/MenteeDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      {/* Login page */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />

      {/* Mentor dashboard - only for mentors */}
      <Route
        path="/mentor"
        element={
          <ProtectedRoute allowedRole="mentor">
            <MentorDashboard />
          </ProtectedRoute>
        }
      />

      {/* Mentee dashboard - only for mentees */}
      <Route
        path="/mentee"
        element={
          <ProtectedRoute allowedRole="mentee">
            <MenteeDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;




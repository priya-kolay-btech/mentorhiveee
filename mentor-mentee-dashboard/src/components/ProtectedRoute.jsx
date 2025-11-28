

// import React from "react";
// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children, allowedRole }) {
//   const role = localStorage.getItem("role"); // get saved role

//   if (!role) {
//     // Not logged in
//     return <Navigate to="/login" />;
//   }

//   if (role !== allowedRole) {
//     // Logged in but wrong role
//     alert("❌ You are not authorized to access this page");
//     return <Navigate to="/login" />;
//   }

//   return children;
// }



import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  const role = localStorage.getItem("role");
  const location = useLocation();

  // Not logged in → send to login
  if (!role) {
    return <Navigate to="/login" />;
  }

  // Trying to open login page again → redirect based on role
  if (location.pathname === "/login") {
    if (role === "mentee") return <Navigate to="/mentee" />;
    if (role === "mentor") return <Navigate to="/mentor" />;
  }

  // Wrong role trying to open a protected page
  if (allowedRole && role !== allowedRole) {
    alert("❌ You are not authorized to access this page");
    return <Navigate to="/login" />;
  }

  return children;
}

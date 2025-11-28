// src/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const rollNumber = localStorage.getItem("rollNumber");

  if (!rollNumber) {
    return <Navigate to="/login" replace />; // Redirect to login if not logged in
  }

  return children;
}

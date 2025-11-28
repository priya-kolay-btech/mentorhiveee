



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [rollNumber, setRollNumber] = useState("");
  const [role, setRole] = useState("mentee");
  const navigate = useNavigate();




const handleLogin = async () => {
  try {
    const res = await axios.post("http://localhost:5000/api/login", {
      rollNumber: rollNumber.trim().toUpperCase(),
      role,
    });



//     if (res.data.role === "mentor") {
//       localStorage.setItem("mentorId", res.data.mentor._id);
//       localStorage.setItem("role", "mentor");
// //      localStorage.setItem("rollNumber", res.data.mentor.rollNumber);
//       navigate("/mentor"); // Redirect to mentor dashboard
//     }else if (res.data.role === "mentee") {
//   localStorage.setItem("student", JSON.stringify(res.data.student)); // store full object
//   localStorage.setItem("studentId", res.data.student._id);
//   localStorage.setItem("role", "mentee");
//   localStorage.setItem("rollNumber", res.data.student.rollNumber);
//   navigate("/mentee");
// }

//   } catch (err) {
//     console.error("Login error:", err.response?.data || err.message);
//     alert(err.response?.data?.message || "❌ Login failed.");
//   }
// };


      if (res.data.role === "mentor") {
        // ✅ fallback in case backend doesn’t wrap mentor in "mentor"
        localStorage.setItem("mentorId", res.data.mentor?._id || res.data._id);
        localStorage.setItem("mentorName", res.data.mentor?.name || res.data.name || "");
        localStorage.setItem("role", "mentor");
        navigate("/mentor"); // Redirect to mentor dashboard
      } else if (res.data.role === "mentee") {
        localStorage.setItem("student", JSON.stringify(res.data.student));
        localStorage.setItem("studentId", res.data.student._id);
        localStorage.setItem("role", "mentee");
        localStorage.setItem("rollNumber", res.data.student.rollNumber);
        navigate("/mentee");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "❌ Login failed.");
    }
  };








  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          width: "300px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>

        <input
          type="text"
          placeholder="Roll Number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            borderRadius: "5px",
          }}
        >
          <option value="mentee">Mentee</option>
          <option value="mentor">Mentor</option>
        </select>

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "10px",
            border: "none",
            borderRadius: "6px",
            background: "#3b82f6",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}
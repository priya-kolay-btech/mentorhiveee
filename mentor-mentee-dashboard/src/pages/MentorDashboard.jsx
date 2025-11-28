








import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function MentorDashboard() {
  const [students, setStudents] = useState([]);
  const [originalStudents, setOriginalStudents] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [meetingData, setMeetingData] = useState({
    title: "",
    date: "",
    description: "",
  });
  const [attendance, setAttendance] = useState({});
  const [pendingList, setPendingList] = useState([]);
  const [activeSection, setActiveSection] = useState("students");



   const mentorId = localStorage.getItem("mentorId");

  // Fetch students & leaves
  useEffect(() => {
    Promise.all([
      // axios.get("http://localhost:5000/api/students?mentorId=${mentorId}"),
      // axios.get("http://localhost:5000/api/leave?mentor=${mentor._id}"),
      axios.get(`http://localhost:5000/api/students?mentorId=${mentorId}`),
    axios.get(`http://localhost:5000/api/leave/mentor/${mentorId}`), 
    ])
      .then(([studentsRes, leavesRes]) => {
        setStudents(studentsRes.data);
        setOriginalStudents(studentsRes.data);
        setLeaves(leavesRes.data);
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  // Real-time pending updates
  useEffect(() => {
    socket.on("pendingUpdated", (data) => {
      setPendingList(data.students || []);
    });
    return () => socket.off("pendingUpdated");
  }, []);





// MentorDashboard.jsx

const handleLeaveStatus = async (leaveId, newStatus) => {
  try {
    const res = await axios.put(
      `http://localhost:5000/api/leave/${leaveId}`,
      { status: newStatus }
    );

    const updated = res.data.leave;

    setLeaves((prev) =>
      prev.map((l) =>
        l._id === updated._id ? { ...l, status: updated.status } : l
      )
    );
  } catch (err) {
    console.error("Failed to update leave status:", err);
    alert("❌ Failed to update status");
  }
};










  // Sorting
  const handleSort = (field) => {
    if (sortField === field)
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const handleRegisteredOrder = () => {
    setSortField(null);
    setSortOrder("desc");
    setStudents([...originalStudents]);
  };

  const sortedStudents =
    sortField === null
      ? [...students]
      : [...students].sort((a, b) => {
          const compare = (valA, valB) =>
            sortOrder === "desc" ? valB - valA : valA - valB;
          let primaryDiff = compare(a[sortField] ?? 0, b[sortField] ?? 0);
          if (primaryDiff !== 0) return primaryDiff;

          if (sortField !== "cgpa") {
            let cgpaDiff = compare(a.cgpa ?? 0, b.cgpa ?? 0);
            if (cgpaDiff !== 0) return cgpaDiff;
          }
          if (sortField !== "classAttendance") {
            let attDiff = compare(a.classAttendance ?? 0, b.classAttendance ?? 0);
            if (attDiff !== 0) return attDiff;
          }
          return 0;
        });

  // Students with leave requests
  const studentsWithLeaves = sortedStudents.map((student) => ({
    ...student,
    leaveRequests: leaves.filter(
     // (leave) => leave.menteeId === String(student._id)
    (leave) => leave.menteeId?._id?.toString() === student._id?.toString()
    ),
  }));

  // Meeting
  const handleMeetingChange = (e) =>
    setMeetingData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleMeetingSubmit = async () => {
    if (!meetingData.title || !meetingData.date)
      return alert("Enter title & date");
    try {
      await axios.post("http://localhost:5000/api/meetings", meetingData);
      alert("✅ Meeting announced!");
      setMeetingData({ title: "", date: "", description: "" });
    } catch {
      alert("❌ Failed to announce meeting");
    }
  };

  // Attendance & Pending
  const toggleAttendance = (roll) =>
    setAttendance((prev) => ({ ...prev, [roll]: !prev[roll] }));

  const submitAttendance = async () => {
    try {
      // ✅ Get present students
      const presentRolls = Object.keys(attendance).filter(
        (roll) => attendance[roll] === true
      );

      // ❌ Get absent students
      const absentStudents = students
        .filter((s) => !presentRolls.includes(s.rollNumber?.trim()))
        .map((s) => ({
          name: s.studentName?.trim(),
          roll: s.rollNumber?.trim(),
          parentEmail: s.parentEmail?.trim(),
        }))
        .filter((s) => s.name && s.roll && s.parentEmail);

      // Update state with absent only
      setPendingList(absentStudents);

      if (absentStudents.length === 0) {
        console.log("✅ All students are present.");
        return;
      }

      // Save absent list to backend
      const response = await axios.post(
        "http://localhost:5000/api/pending/save",
        { students: absentStudents }
      );
      console.log("✅ Pending students saved:", response.data);
    } catch (err) {
      console.error("Error sending pending list:", err);
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "260px",
          background: "#1e293b",
          color: "white",
          padding: "15px",
          fontWeight: "bold",
          boxShadow: "2px 0px 8px rgba(0,0,0,0.2)",
          overflowY: "auto",
        }}
      >
        <h2 style={{ marginBottom: "20px", fontSize: "20px" }}>
          Mentor Dashboard
        </h2>
        <p>Total Students: {students.length}</p>
        <p>Total Leave Requests: {leaves.length}</p>

        <button
          onClick={() => setActiveSection("students")}
          style={sideBtnStyle}
        >
          📋 Students & Leaves
        </button>
        <button
          onClick={() => setActiveSection("attendance")}
          style={sideBtnStyle}
        >
          🗓 Attendance
        </button>

        <h3 style={{ marginTop: "20px", fontSize: "16px" }}>Sort By:</h3>
        <button onClick={() => handleSort("cgpa")} style={sortBtnStyle}>
          CGPA{" "}
          {sortField === "cgpa" ? (sortOrder === "desc" ? "↓" : "↑") : ""}
        </button>
        <button onClick={() => handleSort("classAttendance")} style={sortBtnStyle}>
          Attendance{" "}
          {sortField === "classAttendance"
            ? sortOrder === "desc"
              ? "↓"
              : "↑"
            : ""}
        </button>
        <button onClick={() => handleSort("backlogs")} style={sortBtnStyle}>
          Backlogs{" "}
          {sortField === "backlogs" ? (sortOrder === "desc" ? "↓" : "↑") : ""}
        </button>
        <button onClick={handleRegisteredOrder} style={sortBtnStyle}>
          Registered Order
        </button>
      </div>

      {/* Main */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          background: "#f8fafc",
          color: "#111",
          overflowY: "auto",
        }}
      >
        <AnimatePresence>
          {/* Students & Leaves Section */}
          {activeSection === "students" && (
            <motion.div
              key="students"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              {/* Meeting */}
              <div
                style={{
                  background: "#fff",
                  padding: "15px",
                  borderRadius: "8px",
                  marginBottom: 20,
                }}
              >
                <h3>📢 Announce Meeting</h3>
                <input
                  type="text"
                  name="title"
                  placeholder="Meeting Title"
                  value={meetingData.title}
                  onChange={handleMeetingChange}
                  style={inputStyle}
                />
                <input
                  type="date"
                  name="date"
                  value={meetingData.date}
                  onChange={handleMeetingChange}
                  style={inputStyle}
                />
                <textarea
                  name="description"
                  placeholder="Description (optional)"
                  rows="3"
                  value={meetingData.description}
                  onChange={handleMeetingChange}
                  style={inputStyle}
                />
                <button onClick={handleMeetingSubmit} style={approveBtnStyle}>
                  Announce
                </button>
              </div>

              {/* Students Table */}
              <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>
                Students List
              </h1>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  background: "#fff",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <thead>
                  <tr style={{ background: "#3b82f6", color: "#fff" }}>
                    <th style={thStyle}>Roll</th>
                    <th style={thStyle}>Student</th>
                    <th style={thStyle}>Mentor</th>
                    <th style={thStyle} colSpan="3">
                      Parent Info
                    </th>
                    <th style={thStyle}>CGPA</th>
                    <th style={thStyle}>Attendance</th>
                    <th style={thStyle}>Backlogs</th>
                  </tr>
                  <tr style={{ background: "#bfdbfe", color: "#111" }}>
                    <th></th>
                    <th></th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {studentsWithLeaves.map((s) => (
                    <tr key={s._id} style={{ borderBottom: "1px solid #ddd" }}>
                      <td style={tdStyle}>{s.rollNumber}</td>
                      <td style={tdStyle}>{s.studentName}</td>
                      <td style={tdStyle}>{s.mentorName}</td>
                      <td style={tdStyle}>{s.parentEmail}</td>
                      <td style={tdStyle}>{s.parentPhone}</td>
                      <td style={tdStyle}>{s.parentAddress}</td>
                      <td style={tdStyle}>{s.cgpa}</td>
                      <td style={tdStyle}>{s.classAttendance}</td>
                      <td style={tdStyle}>{s.backlogs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Leave Requests */}
              <h2 style={{ marginTop: "40px", fontSize: "24px" }}>
                📩 Leave Requests by Student
              </h2>
              {studentsWithLeaves.map((student) =>
                student.leaveRequests.length > 0 ? (
                  <div
                    key={student._id}
                    style={{
                      marginTop: "20px",
                      background: "#fff",
                      borderRadius: "8px",
                      padding: "15px",
                      boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
                    }}
                  >
                    <h3 style={{ marginBottom: "8px" }}>
                      🧑 Roll: {student.rollNumber}
                    </h3>
                    <ul>
                      {student.leaveRequests.map((req) => (
                        <li
                          key={req._id}
                          style={{
                            marginBottom: "10px",
                            padding: "10px",
                            background: "#f0f9ff",
                            borderRadius: "5px",
                          }}
                        >
                          <strong>Reason:</strong> {req.reason} <br />
                          <strong>From:</strong>{" "}
                          {new Date(req.fromDate).toLocaleDateString()} |{" "}
                          <strong>To:</strong>{" "}
                          {new Date(req.toDate).toLocaleDateString()} <br />
                          <strong>Status:</strong> {req.status} <br />
                          {req.status === "Pending" && (
                            <>




                              {/* <button
                                onClick={() =>
                                  handleLeaveStatus(req._id, "Approved")
                                }
                                style={approveBtnStyle}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleLeaveStatus(req._id, "Rejected")
                                }
                                style={rejectBtnStyle}
                              >
                                Reject
                              </button> */}
{/* 
<button onClick={() => handleLeaveStatus(req._id, "Approved")}>
  Approve
</button>
<button onClick={() => handleLeaveStatus(req._id, "Rejected")}>
  Reject
</button>
 */}


<button
  onClick={() => handleLeaveStatus(req._id, "Approved")}
  style={{
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
    marginRight: "10px",
    fontWeight: "bold",
    transition: "background 0.2s ease-in-out",
  }}
  onMouseOver={(e) => (e.target.style.background = "#15803d")}
  onMouseOut={(e) => (e.target.style.background = "#16a34a")}
>
  Approve
</button>

<button
  onClick={() => handleLeaveStatus(req._id, "Rejected")}
  style={{
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
    fontWeight: "bold",
    transition: "background 0.2s ease-in-out",
  }}
  onMouseOver={(e) => (e.target.style.background = "#b91c1c")}
  onMouseOut={(e) => (e.target.style.background = "#dc2626")}
>
  Reject
</button>


                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null
              )}
            </motion.div>
          )}

          {/* Attendance Section */}
          {activeSection === "attendance" && (
            <motion.div
              key="attendance"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <h2 className="text-2xl font-bold mb-4">Attendance</h2>
              <table className="w-full bg-white rounded shadow border border-green-300">
                <thead className="bg-green-200">
                  <tr>
                    <th className="p-3 border border-green-300">Name</th>
                    <th className="p-3 border border-green-300">Roll No</th>
                    <th className="p-3 border border-green-300">Present?</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    let bgColor = "white";
                    if (attendance[student.rollNumber]) bgColor = "#d1fae5"; // green if present
                    else if (
                      pendingList.some((s) => s.roll === student.rollNumber)
                    )
                      bgColor = "#fee2e2"; // red if absent
                    return (
                      <tr key={student.rollNumber} style={{ background: bgColor }}>
                        <td className="p-3 border border-green-200">
                          {student.studentName}
                        </td>
                        <td className="p-3 border border-green-200">
                          {student.rollNumber}
                        </td>
                        <td className="p-3 border border-green-200 text-center">
                          <input
                            type="checkbox"
                            checked={attendance[student.rollNumber] || false}
                            onChange={() => toggleAttendance(student.rollNumber)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <button
                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                onClick={submitAttendance}
              >
                Submit Attendance
              </button>

              {/* Pending List */}
              {pendingList.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-2 text-red-700">
                    Pending List
                  </h3>
                  <table className="w-full bg-white rounded shadow border border-red-300">
                    <thead className="bg-red-200">
                      <tr>
                        <th className="p-3 border border-red-300">Name</th>
                        <th className="p-3 border border-red-300">Roll No</th>
                        <th className="p-3 border border-red-300">
                          Parent Email
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingList.map((student) => (
                        <tr key={student.roll} style={{ background: "#fee2e2" }}>
                          <td className="p-3 border border-red-200">
                            {student.name}
                          </td>
                          <td className="p-3 border border-red-200">
                            {student.roll}
                          </td>
                          <td className="p-3 border border-red-200">
                            {student.parentEmail}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Styles
const thStyle = { padding: "10px", textAlign: "left" };
const tdStyle = { padding: "10px" };
const sortBtnStyle = {
  background: "#3b82f6",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "4px",
  cursor: "pointer",
  marginTop: "6px",
  display: "block",
  width: "100%",
  textAlign: "left",
};
const sideBtnStyle = {
  background: "#475569",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "4px",
  cursor: "pointer",
  marginTop: "10px",
  display: "block",
  width: "100%",
  textAlign: "left",
};
const inputStyle = {
  display: "block",
  width: "100%",
  padding: "8px",
  marginTop: "8px",
  border: "1px solid #ccc",
  borderRadius: "4px",
};
const approveBtnStyle = {
  background: "#22c55e",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  marginTop: "10px",
  marginRight: "8px",
};
const rejectBtnStyle = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  marginTop: "10px",
};







// MenteeDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function MenteeDashboard() {
  const navigate = useNavigate();
  const rollNumber = localStorage.getItem("rollNumber");
  const studentId = localStorage.getItem("studentId");

  const [student, setStudent] = useState(null);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState("update");

  const [leaveData, setLeaveData] = useState({
    fromDate: "",
    toDate: "",
    reason: "",
  });
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState("");

  const [meetings, setMeetings] = useState([]);
  const [mentors, setMentors] = useState([]); // ✅ Online mentors list

  // Fetch only mentors who are online
  const fetchOnlineMentors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/mentors/online");
      setMentors(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Error loading mentors:", e?.response?.data || e.message);
      setMentors([]);
    }
  };

  useEffect(() => {
    if (!studentId) {
      alert("No student ID found. Please log in again.");
      navigate("/login");
      return;
    }

    // Fetch student by roll number
    axios
      .get(`http://localhost:5000/api/students/roll/${rollNumber}`)
      .then((res) => {
        setStudent(res.data);
        setFormData({
          studentName: res.data.studentName || "",
          mentorName: res.data.mentorName || "",
          parentEmail: res.data.parentEmail || "",
          parentPhone: res.data.parentPhone || "",
          parentAddress: res.data.parentAddress || "",
          healthIssues: res.data.healthIssues || "",
          extracurricular: res.data.extracurricular || "",
          achievements: res.data.achievements || "",
          classAttendance: res.data.classAttendance || 0,
          backlogs: res.data.backlogs || 0,
          cgpa: res.data.cgpa || 0,
          meetingsAttended: res.data.meetingsAttended || 0,
        });
        setSelectedMentor(res.data.mentorId || "");
        localStorage.setItem("student", JSON.stringify(res.data));

         if (res.data.mentorId && res.data.mentorId !== "undefined" && res.data.mentorId !== "null") {
  socket.emit("joinMentorRoom", res.data.mentorId);
} else {
  console.warn("⚠️ No valid mentorId, skipping joinMentorRoom", res.data.mentorId);
}

      })



      .catch(() => {
        const cached = localStorage.getItem("student");
        if (cached) {
          const parsed = JSON.parse(cached);
          setStudent(parsed);
          setFormData(parsed);
          setSelectedMentor(parsed.mentorId || "");
        } else {
          alert("❌ Error loading student data");
        }
      });

    // Fetch leave history
    axios
      .get("http://localhost:5000/api/leave")
      .then((res) => {
        const myLeaves = res.data.filter(
          (l) => l.menteeId?._id === studentId || l.menteeId === studentId
        );
        setLeaveHistory(myLeaves);
      })
      .catch(() => alert("❌ Error loading leave history"));

    // Fetch meetings
    axios
      .get("http://localhost:5000/api/meetings")
      //.get(`http://localhost:5000/api/meetings?mentorId=${res.data.mentorId}`)
      .then((res) => setMeetings(res.data))
      .catch(() => {});

    // Fetch online mentors
    fetchOnlineMentors();

    // Socket listeners
    socket.on("leaveStatusUpdated", (updatedLeave) => {
      if (updatedLeave.menteeId === studentId) {
        setLeaveHistory((prev) =>
          prev.map((l) => (l._id === updatedLeave._id ? updatedLeave : l))
        );
      }
    });

    socket.on("newMeeting", (meeting) => {
if (meeting.mentorId === selectedMentor) {
  console.log("📩 New meeting received:", meeting);
      setMeetings((prev) => [meeting, ...prev]);
}
    });

    const refreshMentors = () => fetchOnlineMentors();
    socket.on("mentorLoggedIn", refreshMentors);
    socket.on("mentorLoggedOut", refreshMentors);

    return () => {
      socket.off("leaveStatusUpdated");
      socket.off("newMeeting");
      socket.off("mentorLoggedIn", refreshMentors);
      socket.off("mentorLoggedOut", refreshMentors);
    };
  }, [navigate, studentId, rollNumber]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleUpdate = () => {
    if (!rollNumber) {
      alert("❌ No roll number found. Please log in again.");
      return;
    }
    if (!selectedMentor) {
      alert("❌ Please select a mentor before saving.");
      return;
    }

    const mentor = mentors.find((m) => m._id === selectedMentor);
    const updateData = {
      ...formData,
      mentorId: selectedMentor,
      mentorName: mentor?.name || mentor?.mentorName || "Unknown Mentor",
      meetingsAttended: Number(formData.meetingsAttended),
      cgpa: Number(formData.cgpa),
      classAttendance: Number(formData.classAttendance),
      backlogs: Number(formData.backlogs),
    };

    axios
      .put(`http://localhost:5000/api/students/${studentId}`, updateData)
      .then((res) => {
        alert("✅ Information updated successfully!");
        setStudent(res.data);
        localStorage.setItem("student", JSON.stringify(res.data));
      })
      .catch((err) => {
        console.error("Update error:", err.response?.data || err.message);
        alert("❌ Error updating info");
      });
  };

  const handleLeaveChange = (e) =>
    setLeaveData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLeaveSubmit = () => {
    if (
      !leaveData.fromDate ||
      !leaveData.toDate ||
      !leaveData.reason ||
      !selectedMentor
    ) {
      return alert("Please fill all leave fields");
    }
    if (!studentId) {
      return alert("Student ID not found. Please log in again.");
    }

    const mentor = mentors.find((m) => m._id === selectedMentor);
    if (!mentor) {
      return alert("Selected mentor not found. Please select a valid mentor.");
    }

    const payload = {
      menteeId: studentId,
      mentorId: selectedMentor,
      menteeName: student?.studentName || "Unknown",
      ...leaveData,
    };

    axios
      .post("http://localhost:5000/api/leave", payload)
      .then((res) => {
        alert("✅ Leave request submitted!");
        setLeaveData({ fromDate: "", toDate: "", reason: "" });
        if (res.data && res.data.leave) {
          setLeaveHistory((prev) => [res.data.leave, ...prev]);
        }
      })
      .catch((err) => {
        console.error("Error submitting leave:", err.response?.data || err.message);
        alert(
          "❌ Error submitting leave request: " +
            (err.response?.data?.message || err.message)
        );
      });
  };

  if (!student) return <p style={{ padding: "20px" }}>Loading...</p>;

  const now = new Date();
  const upcomingMeetings = meetings
    .filter((m) => new Date(m.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const passedMeetings = meetings
    .filter((m) => new Date(m.date) < now)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

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
        }}
      >
        <h2 style={{ marginBottom: "20px", fontSize: "20px" }}>
          Mentee Dashboard
        </h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li
            onClick={() => setActiveTab("update")}
            style={{
              padding: "10px",
              background: activeTab === "update" ? "#3b82f6" : "transparent",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Update Info
          </li>
          <li
            onClick={() => setActiveTab("leave")}
            style={{
              padding: "10px",
              background: activeTab === "leave" ? "#3b82f6" : "transparent",
              borderRadius: "6px",
              marginTop: "10px",
              cursor: "pointer",
            }}
          >
            Leave Application & Status
          </li>
          <li
            onClick={() => setActiveTab("meetings")}
            style={{
              padding: "10px",
              background: activeTab === "meetings" ? "#3b82f6" : "transparent",
              borderRadius: "6px",
              marginTop: "10px",
              cursor: "pointer",
            }}
          >
            Meeting Announcements
          </li>
          <li
            onClick={() => setActiveTab("mentors")}
            style={{
              padding: "10px",
              background: activeTab === "mentors" ? "#3b82f6" : "transparent",
              borderRadius: "6px",
              marginTop: "10px",
              cursor: "pointer",
            }}
          >
            Mentors
          </li>
        </ul>
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
        <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>
          Welcome, {rollNumber}
        </h1>

        {/* Update Info */}
        {activeTab === "update" && (
          <div
            style={{
              marginTop: 20,
              background: "#fff",
              padding: 20,
              borderRadius: 8,
            }}
          >
            <h2 style={{ fontSize: 20, marginBottom: 10 }}>
              Edit Your Information
            </h2>

            {/* ✅ Mentor Selection */}
            <div style={{ marginBottom: 15 }}>
              <label style={{ fontWeight: "bold", display: "block" }}>
                Select Mentor
              </label>
              <select
                value={selectedMentor}
                onChange={(e) => setSelectedMentor(e.target.value)}
                style={{
                  marginTop: 6,
                  padding: 8,
                  width: "100%",
                  border: "1px solid #ccc",
                  borderRadius: 4,
                }}
              >
                <option value="">-- Select Mentor --</option>
                {mentors.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.employeeId || m.rollNumber} -{" "}
                    {m.name || m.mentorName || "Mentor"}
                  </option>
                ))}
              </select>
            </div>

            {[
              "studentName",
              "mentorName",
              "parentEmail",
              "parentPhone",
              "parentAddress",
              "healthIssues",
              "extracurricular",
              "achievements",
              "classAttendance",
              "backlogs",
              "cgpa",
              "meetingsAttended",
            ].map((field) => (
              <div key={field} style={{ marginBottom: 10 }}>
                <label style={{ fontWeight: "bold", display: "block" }}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  name={field}
                  type={typeof formData[field] === "number" ? "number" : "text"}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: 8,
                    marginTop: 4,
                    border: "1px solid #ccc",
                    borderRadius: 4,
                  }}
                />
              </div>
            ))}

            <button
              onClick={handleUpdate}
              disabled={!student}
              style={{
                background: "#3b82f6",
                color: "white",
                padding: "10px 15px",
                border: "none",
                borderRadius: 6,
                cursor: !student ? "not-allowed" : "pointer",
                opacity: !student ? 0.6 : 1,
                marginTop: 10,
              }}
            >
              Save Changes
            </button>
          </div>
        )}

        {/* Leave Applications */}
        {activeTab === "leave" && (
          <div
            style={{
              marginTop: 20,
              background: "#fff",
              padding: 20,
              borderRadius: 8,
            }}
          >
            <h2 style={{ fontSize: 20, marginBottom: 10 }}>Leave Application</h2>
            <input
              type="date"
              name="fromDate"
              value={leaveData.fromDate}
              onChange={handleLeaveChange}
              style={{ marginBottom: 10, padding: 8, width: "100%" }}
            />
            <input
              type="date"
              name="toDate"
              value={leaveData.toDate}
              onChange={handleLeaveChange}
              style={{ marginBottom: 10, padding: 8, width: "100%" }}
            />
            <textarea
              name="reason"
              value={leaveData.reason}
              onChange={handleLeaveChange}
              placeholder="Reason"
              style={{ marginBottom: 10, padding: 8, width: "100%" }}
            />

            <select
              value={selectedMentor}
              onChange={(e) => setSelectedMentor(e.target.value)}
              style={{
                marginBottom: 10,
                padding: 8,
                width: "100%",
                border: "1px solid #ccc",
                borderRadius: 4,
              }}
            >
              <option value="">-- Select Mentor --</option>
              {mentors.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.rollNumber || m.employeeId} -{" "}
                  {m.name || m.mentorName || "Mentor"}
                </option>
              ))}
            </select>

            <button
              onClick={handleLeaveSubmit}
              style={{
                background: "#3b82f6",
                color: "white",
                padding: "10px 15px",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Submit Leave
            </button>

            <h3
              style={{
                marginTop: 20,
                fontSize: "22px",
                fontWeight: "600",
                color: "#1e293b",
              }}
            >
              Leave History
            </h3>
            <div style={{ marginTop: 10 }}>
              {leaveHistory.length === 0 ? (
                <p style={{ color: "#64748b", fontStyle: "italic" }}>
                  No leave records found
                </p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {leaveHistory.map((leave) => {
                    let statusColor =
                      leave.status === "Approved"
                        ? "#dcfce7"
                        : leave.status === "Rejected"
                        ? "#fee2e2"
                        : "#fef9c3";

                    let textColor =
                      leave.status === "Approved"
                        ? "#166534"
                        : leave.status === "Rejected"
                        ? "#991b1b"
                        : "#854d0e";

                    return (
                      <li
                        key={leave._id}
                        style={{
                          background: "#f8fafc",
                          borderLeft: `6px solid ${textColor}`,
                          marginBottom: "12px",
                          padding: "12px 16px",
                          borderRadius: "8px",
                          fontFamily: "Segoe UI, sans-serif",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                        }}
                      >
                        <div style={{ fontSize: "14px", color: "#475569" }}>
                          <b>From:</b>{" "}
                          {new Date(leave.fromDate).toLocaleDateString()} <br />
                          <b>To:</b>{" "}
                          {new Date(leave.toDate).toLocaleDateString()}
                        </div>

                        <div
                          style={{
                            marginTop: "6px",
                            fontSize: "15px",
                            color: "#1e293b",
                          }}
                        >
                          <b>Reason:</b> {leave.reason}
                        </div>

                        <div
                          style={{
                            marginTop: "10px",
                            display: "inline-block",
                            background: statusColor,
                            color: textColor,
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        >
                          {leave.status}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Meetings */}
        {activeTab === "meetings" && (
          <div
            style={{
              marginTop: 20,
              background: "#fff",
              padding: 20,
              borderRadius: 8,
            }}
          >
            
            
           
            <h2 style={{ fontSize: 22, marginBottom: 15, color: "#1e293b" }}>
             Upcoming Meetings
          </h2>
          {upcomingMeetings.length === 0 ? (
              <p style={{ color: "#475569" }}>No upcoming meetings</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {upcomingMeetings.map((m) => (
                  <li
                    key={m._id}
                    style={{
                      background: "#fef9c3",
                      borderLeft: "6px solid #ca8a04",
                      marginBottom: "12px",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                    }}
                  >
                    <div style={{ fontSize: "15px", color: "#1e293b" }}>
                      <b>Date:</b> {new Date(m.date).toLocaleString()}
                    </div>
                    <div style={{ marginTop: "6px", color: "#1e293b" }}>
                      <b>Agenda:</b> {m.agenda}
                    </div>
                    <div style={{ marginTop: "6px", color: "#334155" }}>
                      <b>Description:</b> {m.description || "No details"}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <h2
              style={{
                fontSize: 22,
                margin: "20px 0 15px",
                color: "#1e293b",
              }}
            >
              Past Meetings
            </h2>
            {passedMeetings.length === 0 ? (
              <p style={{ color: "#475569" }}>No past meetings</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {passedMeetings.map((m) => (
                  <li
                    key={m._id}
                    style={{
                      background: "#fee2e2",
                      borderLeft: "6px solid #b91c1c",
                      marginBottom: "12px",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                    }}
                  >
                    <div style={{ fontSize: "15px", color: "#1e293b" }}>
                      <b>Date:</b> {new Date(m.date).toLocaleString()}
                    </div>
                    <div style={{ marginTop: "6px", color: "#1e293b" }}>
                      <b>Agenda:</b> {m.agenda}
                    </div>
                    <div style={{ marginTop: "6px", color: "#334155" }}>
                      <b>Description:</b> {m.description || "No details"}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* ✅ Mentors (who logged in as mentor) */}
        {activeTab === "mentors" && (
          <div
            style={{
              marginTop: 20,
              background: "#fff",
              padding: 20,
              borderRadius: 8,
            }}
          >
            <h2 style={{ fontSize: 22, marginBottom: 15, color: "#1e293b" }}>
              Mentors Online
            </h2>
            {mentors.length === 0 ? (
              <p style={{ color: "#64748b" }}>No mentors are online</p>
            ) : (
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
                    <th style={{ padding: "10px", textAlign: "left" }}>
                      Mentor Roll No
                    </th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Name</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>
                      Last Login
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mentors.map((m) => (
                    <tr key={m._id} style={{ borderBottom: "1px solid #ddd" }}>
                      <td style={{ padding: "10px" }}>
                        {m.employeeId || m.rollNumber || "—"}
                      </td>
                      <td style={{ padding: "10px" }}>
                        {m.name || m.mentorName || "Mentor"}
                      </td>
                      <td style={{ padding: "10px" }}>
                        {m.lastLoginAt
                          ? new Date(m.lastLoginAt).toLocaleString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 





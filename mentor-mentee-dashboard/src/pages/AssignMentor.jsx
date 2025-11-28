import React, { useEffect, useState } from "react";
import axios from "axios";

const AssignMentor = () => {
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedMentor, setSelectedMentor] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/students").then((res) => setStudents(res.data));
    axios.get("http://localhost:5000/api/admin/mentors").then((res) => setMentors(res.data));
  }, []);

  const handleAssign = async () => {
    if (!selectedStudent || !selectedMentor) {
      alert("Please select both student and mentor");
      return;
    }
    try {
      const res = await axios.put("http://localhost:5000/api/admin/assign-mentor", {
        studentId: selectedStudent,
        mentorId: selectedMentor,
      });
      alert("Mentor assigned successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Error assigning mentor");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Assign Mentor to Student</h2>

      <div>
        <label>Select Student:</label>
        <select onChange={(e) => setSelectedStudent(e.target.value)} value={selectedStudent}>
          <option value="">-- Select Student --</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.rollNumber} {s.mentorId ? `(Current: ${s.mentorId.mentorName})` : "(No Mentor)"}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Select Mentor:</label>
        <select onChange={(e) => setSelectedMentor(e.target.value)} value={selectedMentor}>
          <option value="">-- Select Mentor --</option>
          {mentors.map((m) => (
            <option key={m._id} value={m._id}>
              {m.rollNumber} - {m.mentorName}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleAssign} style={{ marginTop: "10px" }}>
        Assign Mentor
      </button>
    </div>
  );
};

export default AssignMentor;

// import React, { useState } from "react";
// import axios from "axios";

// export default function AttendanceSection({ students }) {
//   const [attendance, setAttendance] = useState({});

//   const handleAttendance = (id, status) => {
//     setAttendance((prev) => ({ ...prev, [id]: status }));
//   };

//   const submitAttendance = async () => {
//     try {
//       const presentStudents = Object.keys(attendance).filter(
//         (id) => attendance[id] === "present"
//       );
//       const absentStudents = Object.keys(attendance).filter(
//         (id) => attendance[id] === "absent"
//       );

//       await axios.post("http://localhost:5000/api/attendance", {
//         presentStudents,
//         absentStudents,
//       });

//       alert("✅ Attendance submitted successfully!");
//     } catch (err) {
//       console.error(err);
//       alert("❌ Failed to submit attendance");
//     }
//   };

//   return (
//     <div>
//       <h3 className="text-xl font-semibold mb-4">✅ Take Attendance</h3>

//       <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
//         <thead className="bg-slate-200">
//           <tr>
//             <th className="p-2 border">Name</th>
//             <th className="p-2 border">Roll No</th>
//             <th className="p-2 border">Parent Email</th>
//             <th className="p-2 border">Phone</th>
//             <th className="p-2 border">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {students.length > 0 ? (
//             students.map((student) => (
//               <tr key={student._id} className="border">
//                 <td className="p-2 border">{student.name}</td>
//                 <td className="p-2 border">{student.rollNumber}</td>
//                 <td className="p-2 border">{student.parentEmail}</td>
//                 <td className="p-2 border">{student.phone}</td>
//                 <td className="p-2 border">
//                   <button
//                     onClick={() =>
//                       handleAttendance(student._id, "present")
//                     }
//                     className={`px-3 py-1 mr-2 rounded ${
//                       attendance[student._id] === "present"
//                         ? "bg-green-600 text-white"
//                         : "bg-green-200"
//                     }`}
//                   >
//                     Present
//                   </button>
//                   <button
//                     onClick={() =>
//                       handleAttendance(student._id, "absent")
//                     }
//                     className={`px-3 py-1 rounded ${
//                       attendance[student._id] === "absent"
//                         ? "bg-red-600 text-white"
//                         : "bg-red-200"
//                     }`}
//                   >
//                     Absent
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="5" className="p-4 text-center text-gray-500">
//                 No students found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       <button
//         onClick={submitAttendance}
//         className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//       >
//         Submit Attendance
//       </button>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Attendance.css"; // ✅ custom styles

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  // Fetch student list
  useEffect(() => {
    axios.get("http://localhost:5000/students")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Handle checkbox toggle
  const handleAttendanceChange = (rollNo, isPresent) => {
    setAttendance((prev) => ({
      ...prev,
      [rollNo]: isPresent
    }));

    axios.post("http://localhost:5000/attendance", {
      rollNo,
      present: isPresent
    }).catch((err) => console.error(err));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Attendance Sheet</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f2f2f2" }}>
            <th style={{ padding: "10px", textAlign: "left" }}>Roll No</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Name</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Present</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.rollNo}>
              <td style={{ padding: "10px" }}>{student.rollNo}</td>
              <td style={{ padding: "10px" }}>{student.name}</td>
              <td style={{ padding: "10px" }}>
                <input
                  type="checkbox"
                  className="attendance-checkbox" // ✅ styled checkbox
                  checked={attendance[student.rollNo] || false}
                  onChange={(e) =>
                    handleAttendanceChange(student.rollNo, e.target.checked)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

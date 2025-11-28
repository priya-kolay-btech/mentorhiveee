import { useEffect, useState } from "react";
import axios from "axios";

export default function MentorLeaveList() {
  const [leaves, setLeaves] = useState([]);

  const fetchLeaves = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("/api/leaves", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setLeaves(res.data);
  };

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    await axios.put(`/api/leaves/${id}`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchLeaves();
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <div className="bg-white p-4 shadow rounded">
      <h2 className="text-lg font-bold mb-2">Leave Applications</h2>
      {leaves.map(leave => (
        <div key={leave._id} className="border p-2 mb-2 rounded">
          <p><strong>{leave.menteeName}</strong> ({leave.fromDate.slice(0,10)} to {leave.toDate.slice(0,10)})</p>
          <p>Reason: {leave.reason}</p>
          <p>Status: {leave.status}</p>
          {leave.status === "Pending" && (
            <div className="mt-2">
              <button
                onClick={() => updateStatus(leave._id, "Approved")}
                className="bg-green-500 text-white px-2 py-1 rounded mr-2"
              >
                Approve
              </button>
              <button
                onClick={() => updateStatus(leave._id, "Rejected")}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

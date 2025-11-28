import { useState } from "react";
import axios from "axios";

export default function MenteeLeaveForm() {
  const [form, setForm] = useState({
    reason: "",
    fromDate: "",
    toDate: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/leaves", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Leave application submitted!");
      setForm({ reason: "", fromDate: "", toDate: "" });
    } catch (err) {
      alert("Error submitting leave");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded max-w-md">
      <h2 className="text-lg font-bold mb-2">Leave Application</h2>
      <textarea
        name="reason"
        placeholder="Reason for leave"
        className="border p-2 w-full mb-2"
        value={form.reason}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="fromDate"
        className="border p-2 w-full mb-2"
        value={form.fromDate}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="toDate"
        className="border p-2 w-full mb-2"
        value={form.toDate}
        onChange={handleChange}
        required
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
    </form>
  );
}





import React, { useState } from "react";

export default function LeaveApplication() {
  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Leave:", formData);
    // Here you’ll call your backend API
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Leave Application</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="date"
          name="fromDate"
          value={formData.fromDate}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="date"
          name="toDate"
          value={formData.toDate}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <textarea
          name="reason"
          placeholder="Reason for leave"
          value={formData.reason}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Apply
        </button>
      </form>
    </div>
  );
}

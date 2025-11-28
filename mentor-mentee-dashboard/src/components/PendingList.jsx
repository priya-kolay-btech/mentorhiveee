export default function PendingList() {
  const pending = [
    { name: "Amit Sharma", reason: "Missed last meeting" },
    { name: "Ravi Kumar", reason: "Absent due to illness" }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-3">Pending List</h2>
      <ul>
        {pending.map((p, i) => (
          <li key={i} className="border-b py-2">
            {p.name} - {p.reason}
          </li>
        ))}
      </ul>
    </div>
  );
}

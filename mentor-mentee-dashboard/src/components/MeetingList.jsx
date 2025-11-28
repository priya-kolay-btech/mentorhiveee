export default function MeetingList() {
  const meetings = [
    { date: "2025-08-10", topic: "Project Progress" },
    { date: "2025-08-20", topic: "Exam Preparation" }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-3">Upcoming Meetings</h2>
      <ul>
        {meetings.map((m, i) => (
          <li key={i} className="border-b py-2">
            <strong>{m.date}</strong> - {m.topic}
          </li>
        ))}
      </ul>
    </div>
  );
}

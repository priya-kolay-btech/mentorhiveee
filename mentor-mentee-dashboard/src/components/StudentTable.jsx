export default function StudentTable() {
  const students = [
    { name: "John Doe", roll: "CS101", email: "parent1@mail.com", phone: "9876543210", health: "Asthma", cgpa: 8.5, meetings: 5 },
    { name: "Priya Kolay", roll: "CS102", email: "parent2@mail.com", phone: "9876543211", health: "None", cgpa: 9.1, meetings: 4 }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-3">Student List</h2>
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th>Name</th>
            <th>Roll</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Health</th>
            <th>CGPA</th>
            <th>Meetings Attended</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <tr key={i} className="text-center border-b">
              <td>{s.name}</td>
              <td>{s.roll}</td>
              <td>{s.email}</td>
              <td>{s.phone}</td>
              <td>{s.health}</td>
              <td>{s.cgpa}</td>
              <td>{s.meetings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

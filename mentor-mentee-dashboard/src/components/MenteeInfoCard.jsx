export default function MenteeInfoCard() {
  const mentee = { name: "Priya Kolay", roll: "CS102", mentor: "Dr. John Smith" };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-fit">
      <h2 className="text-xl font-semibold mb-3">My Mentor</h2>
      <p><strong>Name:</strong> {mentee.mentor}</p>
      <p><strong>Your Name:</strong> {mentee.name}</p>
      <p><strong>Roll:</strong> {mentee.roll}</p>
    </div>
  );
}

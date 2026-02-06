import { useState } from "react";

export default function VisitRequestForm({ listingId }) {
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVisitRequest = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("/api/visit/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          listingId,
          visitDate,
          visitTime,
          message,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Visit request sent!");
        setVisitDate("");
        setVisitTime("");
        setMessage("");
      } else {
        alert(data.message || "❌ Failed to send request");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      alert("❌ Server error");
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 p-4 border rounded-lg shadow-md bg-white">

      <h2 className="text-xl font-semibold mb-4">
        📅 Request Site Visit
      </h2>

      <form onSubmit={handleVisitRequest} className="space-y-3">

        {/* Date */}
        <div>
          <label className="block mb-1 font-medium">
            Select Date
          </label>

          <input
            type="date"
            required
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Time */}
        <div>
          <label className="block mb-1 font-medium">
            Select Time
          </label>

          <input
            type="time"
            required
            value={visitTime}
            onChange={(e) => setVisitTime(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block mb-1 font-medium">
            Message (Optional)
          </label>

          <textarea
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Any special request..."
          ></textarea>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Request"}
        </button>

      </form>
    </div>
  );
}

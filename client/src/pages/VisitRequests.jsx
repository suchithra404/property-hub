import { useEffect, useState } from "react";

export default function VisitRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastStatus, setLastStatus] = useState({});

  useEffect(() => {
    fetchRequests();

    // Auto refresh every 10 seconds
    const interval = setInterval(() => {
      fetchRequests();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/visit", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to load requests");
        setLoading(false);
        return;
      }

      // Show popup if approved
      data.forEach((req) => {
        if (
          lastStatus[req._id] &&
          lastStatus[req._id] !== req.status &&
          req.status === "approved"
        ) {
          alert("🎉 Your visit request was approved!");
        }
      });

      // Save latest status
      const statusMap = {};
      data.forEach((r) => {
        statusMap[r._id] = r.status;
      });

      setLastStatus(statusMap);
      setRequests(data);
      setLoading(false);

    } catch (err) {
      console.log(err);
      setError("Server error");
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`/api/visit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      fetchRequests();

    } catch (err) {
      console.log(err);
      alert("Failed to update status");
    }
  };

  if (loading) {
    return <p className="text-center mt-6">Loading...</p>;
  }

  if (error) {
    return (
      <p className="text-center mt-6 text-red-600">
        {error}
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-5">

      <h1 className="text-2xl font-bold mb-5">
        📅 Visit Requests
      </h1>

      {requests.length === 0 ? (
        <p>No visit requests found.</p>
      ) : (

        <div className="overflow-x-auto">

          <table className="w-full border">

            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">User</th>
                <th className="border p-2">Property</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Time</th>
                <th className="border p-2">Message</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>

            <tbody>

              {requests.map((req) => (

                <tr key={req._id} className="text-center">

                  {/* User */}
                  <td className="border p-2">
                    {req.userId?.username}
                  </td>

                  {/* Property */}
                  <td className="border p-2">
                    {req.listingId?.name}
                  </td>

                  {/* Date */}
                  <td className="border p-2">
                    {req.visitDate}
                  </td>

                  {/* Time */}
                  <td className="border p-2">
                    {req.visitTime}
                  </td>

                  {/* Message */}
                  <td className="border p-2">
                    {req.message || "-"}
                  </td>

                  {/* Status */}
                  <td className="border p-2 font-semibold">

                    {req.status === "pending" && (
                      <span className="text-yellow-600">
                        🟡 Pending
                      </span>
                    )}

                    {req.status === "approved" && (
                      <span className="text-green-600">
                        🟢 Approved
                      </span>
                    )}

                    {req.status === "rejected" && (
                      <span className="text-red-600">
                        🔴 Rejected
                      </span>
                    )}

                  </td>

                  {/* Action */}
                  <td className="border p-2 space-x-2">

                    {req.status === "pending" && (

                      <>
                        <button
                          onClick={() =>
                            updateStatus(req._id, "approved")
                          }
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(req._id, "rejected")
                          }
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {req.status !== "pending" && (
                      <span>-</span>
                    )}

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}
    </div>
  );
}

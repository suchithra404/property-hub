import { useEffect, useState } from "react";

export default function AdminLogs() {

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch logs
  useEffect(() => {

    const fetchLogs = async () => {
      try {

        const res = await fetch("/api/admin/logs", {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load logs");
        }

        setLogs(data);
        setLoading(false);

      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLogs();

  }, []);


  return (
    <div className="p-10">

      <h1 className="text-4xl font-bold text-slate-700 mb-6">
        Admin Activity Logs 📜
      </h1>


      {/* Loading */}
      {loading && (
        <p className="text-blue-600">Loading logs...</p>
      )}


      {/* Error */}
      {error && (
        <p className="text-red-600">{error}</p>
      )}


      {/* Logs Table */}
      {!loading && !error && (
        <div className="overflow-x-auto">

          <table className="w-full border border-gray-300">

            <thead className="bg-slate-200">
              <tr>
                <th className="p-3 border">Time</th>
                <th className="p-3 border">Action By</th>
                <th className="p-3 border">Action</th>
                <th className="p-3 border">On User</th>
                <th className="p-3 border">Message</th>
              </tr>
            </thead>


            <tbody>
              {logs.map((log) => (

                <tr key={log._id} className="text-center">

                  <td className="p-2 border text-sm">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>

                  <td className="p-2 border">
                    {log.actionBy?.username}
                  </td>

                  <td className="p-2 border font-semibold">
                    {log.actionType}
                  </td>

                  <td className="p-2 border">
  {log.actionOn?.username || log.actionOnName || 'N/A'}
</td>


                  <td className="p-2 border text-sm">
                    {log.message}
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

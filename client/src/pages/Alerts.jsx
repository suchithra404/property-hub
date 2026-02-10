import { useEffect, useState } from "react";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch("/api/alerts", {
          credentials: "include",
        });
        const data = await res.json();
        setAlerts(data);
      } catch (error) {
        console.log("Error fetching alerts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading alerts...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🔔 Notifications</h1>

      {alerts.length === 0 ? (
        <p className="text-gray-500">No alerts available</p>
      ) : (
        <ul className="space-y-4">
          {alerts.map((alert) => (
            <li
              key={alert._id}
              className={`p-4 rounded border ${
                alert.isRead ? "bg-white" : "bg-blue-50"
              }`}
            >
              <h3 className="font-semibold">{alert.title}</h3>
              <p className="text-sm text-gray-600">{alert.message}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(alert.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

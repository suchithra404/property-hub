import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function AdminMessages() {

  const { currentUser } = useSelector((state) => state.user);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);


  // ================= FETCH MESSAGES =================
  useEffect(() => {
  const fetchMessages = async () => {
    try {

      if (!currentUser) return;

      const url =
        currentUser.role === "admin" ||
        currentUser.role === "superadmin"
          ? "/api/contact/all"
          : "/api/contact/my";

      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await res.json();

      setMessages(data);
      setLoading(false);

    } catch (error) {
      console.log("Fetch Error:", error);
      setLoading(false);
    }
  };

  fetchMessages();

}, [currentUser]);



  // ================= LOADING USER =================
  if (currentUser === null) {
    return (
      <div className="text-center mt-20 text-gray-500 font-semibold">
        Checking access...
      </div>
    );
  }


  // ================= ACCESS CONTROL =================
  if (!currentUser) {
  return (
    <div className="text-center mt-20 text-red-600 font-semibold">
      Please login to view your inbox 🔐
    </div>
  );
}



  // ================= UI =================
  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold text-slate-700 mb-6">
        📥 Contact Messages
      </h1>


      {loading ? (

        <p className="text-center text-gray-500">
          Loading messages...
        </p>

      ) : messages.length === 0 ? (

        <p className="text-center text-gray-500">
          No messages found
        </p>

      ) : (

        <div className="overflow-x-auto bg-white shadow rounded-lg">

          <table className="w-full text-sm text-left">

            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Staff</th>
                <th className="p-3">Message</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>


            <tbody>
              {messages.map((msg) => (
                <tr key={msg._id} className="border-t">

                  <td className="p-3 font-medium">
                    {msg.name}
                  </td>

                  <td className="p-3 text-blue-600">
                    {msg.email}
                  </td>

                  <td className="p-3">
                    {msg.staff}
                  </td>

                  <td className="p-3 max-w-xs truncate">
                    {msg.message}
                  </td>

                  <td className="p-3 text-gray-500">
                    {new Date(msg.createdAt).toLocaleString()}
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

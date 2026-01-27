import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function AdminDashboard() {

  const { currentUser } = useSelector((state) => state.user);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Filter State
  const [filterType, setFilterType] = useState("all");

  // =========================
  // Fetch all users
  // =========================
  useEffect(() => {

    const fetchUsers = async () => {
      try {

        const res = await fetch("/api/admin/users", {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch users");
        }

        setUsers(data);
        setLoading(false);

      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();

  }, []);

  // =========================
  // Filter Logic
  // =========================
  const filteredUsers = users.filter((user) => {

    if (filterType === "all") return true;

    return user.accountType === filterType;
  });

  // =========================
  // Stats
  // =========================
  const totalUsers = users.length;

  const buyerCount = users.filter(
    (u) => u.accountType === "buyer"
  ).length;

  const sellerCount = users.filter(
    (u) => u.accountType === "seller"
  ).length;

  const bothCount = users.filter(
    (u) => u.accountType === "both"
  ).length;

  // =========================
  // Delete User
  // =========================
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {

      const res = await fetch(`/api/admin/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Delete failed");
        return;
      }

      alert("User deleted successfully ✅");

      setUsers((prev) =>
        prev.filter((user) => user._id !== id)
      );

    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  // =========================
  // Make Admin
  // =========================
  const handleMakeAdmin = async (id) => {

    const confirm = window.confirm(
      "Make this user an admin?"
    );

    if (!confirm) return;

    try {

      const res = await fetch(`/api/admin/role/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ role: "admin" }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Role update failed");
        return;
      }

      alert("User promoted to Admin 👑");

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id
            ? { ...user, role: "admin" }
            : user
        )
      );

    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  // =========================
  // Remove Admin
  // =========================
  const handleRemoveAdmin = async (id) => {

    const confirm = window.confirm(
      "Remove admin access from this user?"
    );

    if (!confirm) return;

    try {

      const res = await fetch(`/api/admin/role/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ role: "user" }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Role update failed");
        return;
      }

      alert("Admin removed successfully ✅");

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id
            ? { ...user, role: "user" }
            : user
        )
      );

    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="p-10">

      {/* Title */}
      <h1 className="text-4xl font-bold text-slate-700">
        Admin Dashboard 👑
      </h1>

      <p className="mt-4 text-lg text-gray-600">
        Welcome, Admin! You can manage users here.
      </p>

      {/* =========================
          USER STATS
      ========================= */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold text-gray-700">
            Total Users
          </h3>
          <p className="text-2xl font-bold text-blue-700">
            {totalUsers}
          </p>
        </div>

        <div className="bg-green-100 p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold text-gray-700">
            Buyers
          </h3>
          <p className="text-2xl font-bold text-green-700">
            {buyerCount}
          </p>
        </div>

        <div className="bg-yellow-100 p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold text-gray-700">
            Sellers
          </h3>
          <p className="text-2xl font-bold text-yellow-700">
            {sellerCount}
          </p>
        </div>

        <div className="bg-purple-100 p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold text-gray-700">
            Buyer & Seller
          </h3>
          <p className="text-2xl font-bold text-purple-700">
            {bothCount}
          </p>
        </div>

      </div>

      {/* ✅ FILTER DROPDOWN */}
      <div className="mt-6 flex items-center gap-3">

        <label className="font-semibold text-gray-700">
          Filter by Account Type:
        </label>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border px-3 py-2 rounded-md"
        >
          <option value="all">All</option>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
          <option value="both">Buyer & Seller</option>
        </select>

      </div>

      {/* Loading */}
      {loading && (
        <p className="mt-6 text-blue-600">
          Loading users...
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="mt-6 text-red-600">
          {error}
        </p>
      )}

      {/* Users Table */}
      {!loading && !error && (
        <div className="mt-8 overflow-x-auto">

          <table className="w-full border border-gray-300">

            <thead className="bg-slate-200">
              <tr>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Role</th>
                <th className="p-3 border">Account Type</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="text-center"
                >

                  <td className="p-3 border">
                    {user.username}
                  </td>

                  <td className="p-3 border">
                    {user.email}
                  </td>

                  <td className="p-3 border font-semibold">
                    {user.role}
                  </td>

                  <td className="p-3 border capitalize">
                    {user.accountType || "buyer"}
                  </td>

                  {/* Actions */}
                  <td className="p-3 border flex gap-2 justify-center">

                    {currentUser?.role === "superadmin" ? (

                      user.role !== "superadmin" ? (
                        <>

                          {user.role === "user" && (
                            <button
                              onClick={() =>
                                handleMakeAdmin(user._id)
                              }
                              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                            >
                              Make Admin
                            </button>
                          )}

                          {user.role === "admin" && (
                            <button
                              onClick={() =>
                                handleRemoveAdmin(user._id)
                              }
                              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                            >
                              Remove Admin
                            </button>
                          )}

                          {user.role === "user" && (
                            <button
                              onClick={() =>
                                handleDelete(user._id)
                              }
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                              Delete
                            </button>
                          )}

                        </>
                      ) : (
                        <span className="text-gray-500 text-sm">
                          Protected
                        </span>
                      )

                    ) : (

                      user.role === "user" ? (
                        <button
                          onClick={() =>
                            handleDelete(user._id)
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      ) : (
                        <span className="text-gray-500 text-sm">
                          Protected
                        </span>
                      )

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

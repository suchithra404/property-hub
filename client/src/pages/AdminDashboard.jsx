import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function AdminDashboard() {

  const { currentUser } = useSelector((state) => state.user);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  // Remove Admin (Demote)
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
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
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

                  {/* Actions */}
                  <td className="p-3 border flex gap-2 justify-center">

                    {/* SUPERADMIN */}
                    {currentUser?.role === "superadmin" ? (

                      user.role !== "superadmin" ? (
                        <>

                          {/* Make Admin */}
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

                          {/* Remove Admin */}
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

                          {/* Delete User */}
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

                      /* NORMAL ADMIN */
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

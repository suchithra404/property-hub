import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";

import {
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // ❤️ Wishlist Count
  const [wishlistCount, setWishlistCount] = useState(0);

  // Get user from redux
  const { currentUser } = useSelector((state) => state.user);

  
// Fetch Wishlist Count

// =====================
// Fetch Wishlist Count
// =====================
useEffect(() => {
  if (!currentUser) return;

  const fetchWishlist = async () => {
    try {
      const res = await fetch("/api/wishlist", {
        credentials: "include",
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      if (Array.isArray(data)) {
        setWishlistCount(data.length);
      } else {
        setWishlistCount(0);
      }

    } catch (error) {
      console.log("Fetch Wishlist Error:", error);
      setWishlistCount(0);
    }
  };

  // First load
  fetchWishlist();

  // ✅ Listen for wishlist updates
  window.addEventListener("wishlistUpdated", fetchWishlist);

  return () => {
    window.removeEventListener("wishlistUpdated", fetchWishlist);
  };

}, [currentUser]);




  // =====================
  // Logout Function
  // =====================
  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if (!confirmLogout) return;

    try {
      dispatch(signOutUserStart());

      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }

      dispatch(signOutUserSuccess());

      alert("Logged out successfully ✅");

      navigate("/sign-in");

    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  // =====================
  // Search Function
  // =====================
  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    navigate(`/search?searchTerm=${searchTerm}`);
  };

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">

        {/* Logo */}
        <Link to="/">
          <h1 className="text-4xl font-bold">
            <span className="text-slate-500">Property</span>{" "}
            <span className="text-slate-600">Hub</span>
          </h1>
        </Link>

        {/* Search Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="bg-slate-100 p-3 rounded-lg flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />

          <FaSearch
            className="text-slate-600 cursor-pointer"
            onClick={handleSearch}
          />
        </form>

        {/* Nav Links */}
        <ul className="flex gap-4 items-center">

          <li className="hidden sm:inline text-slate-700 hover:underline">
            <Link to="/">Home</Link>
          </li>

          <li className="hidden sm:inline text-slate-700 hover:underline">
            <Link to="/about">About</Link>
          </li>

          {/* If User Logged In */}
          {currentUser ? (
            <>
              {/* Profile */}
              <li className="text-slate-700 hover:underline">
                <Link to="/profile">Profile</Link>
              </li>

              {/* ❤️ Wishlist */}
              <li className="text-red-500 font-semibold hover:underline">
                <Link to="/wishlist">
                  ❤️🏠 Wishlist ({wishlistCount})
                </Link>
              </li>

              {currentUser && (
  <Link
    to="/visits"
    className="hover:underline text-blue-600 font-semibold"
  >
    📅 My Visits
  </Link>
)}



              {/* Admin Dashboard */}
              {(currentUser.role === "admin" ||
                currentUser.role === "superadmin") && (
                <li className="text-blue-600 font-semibold hover:underline">
                  <Link to="/admin/dashboard">Admin</Link>
                </li>
              )}

              {/* Admin Logs */}
              {(currentUser.role === "admin" ||
                currentUser.role === "superadmin") && (
                <li className="text-purple-600 font-semibold hover:underline">
                  <Link to="/admin/logs">Logs</Link>
                </li>
              )}

              {/* Logout */}
              <li
                onClick={handleLogout}
                className="text-red-600 font-semibold cursor-pointer hover:underline"
              >
                Logout
              </li>
            </>
          ) : (
            <li className="text-slate-700 hover:underline">
              <Link to="/sign-in">Sign in</Link>
            </li>
          )}

        </ul>
      </div>
    </header>
  );
}

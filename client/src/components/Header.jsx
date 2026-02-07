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

    fetchWishlist();

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
    <header className="bg-slate-200 shadow-md border-b border-slate-300">

      <div className="max-w-7xl mx-auto px-6 py-5">


        {/* Main Header Row */}
        <div className="flex items-center justify-between">

          {/* ================= LEFT : LOGO ================= */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-2xl font-bold">
              <span className="text-slate-500">Property</span>{" "}
              <span className="text-slate-700">Hub</span>
            </h1>
          </Link>


          {/* ================= CENTER : SEARCH ================= */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="hidden md:flex items-center bg-white px-4 py-2 rounded-full shadow-sm w-[350px]"
          >
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
            />

            <FaSearch
              className="text-slate-600 cursor-pointer"
              onClick={handleSearch}
            />
          </form>


          {/* ================= RIGHT : NAV ================= */}
          <ul className="flex items-center gap-5 text-sm font-medium">

            <li className="hidden sm:block hover:underline">
              <Link to="/">Home</Link>
            </li>

            <li className="hidden sm:block hover:underline">
              <Link to="/about">About</Link>
            </li>

            {/* If Logged In */}
            {currentUser ? (
              <>

                <li className="hover:underline">
                  <Link to="/profile">Profile</Link>
                </li>

                <li className="text-red-500 font-semibold hover:underline">
                  <Link to="/wishlist">
                    ❤️ Wishlist ({wishlistCount})
                  </Link>
                </li>

                <li className="text-blue-600 font-semibold hover:underline">
                  <Link to="/visits">
                    📅 My Visits
                  </Link>
                </li>

                {/* Admin */}
                {(currentUser.role === "admin" ||
                  currentUser.role === "superadmin") && (
                  <li className="text-indigo-600 font-semibold hover:underline">
                    <Link to="/admin/dashboard">Admin</Link>
                  </li>
                )}

                {/* Logs */}
                {(currentUser.role === "admin" ||
                  currentUser.role === "superadmin") && (
                  <li className="text-purple-600 font-semibold hover:underline">
                    <Link to="/admin/logs">Logs</Link>
                  </li>
                )}

                <li className="text-green-600 font-semibold hover:underline">
  <Link to="/admin/messages">Inbox</Link>
</li>


                {/* Logout */}
                <li
                  onClick={handleLogout}
                  className="text-red-600 font-semibold cursor-pointer hover:underline"
                >
                  Logout
                </li>

              </>
            ) : (
              <li className="hover:underline">
                <Link to="/sign-in">Sign in</Link>
              </li>
            )}

          </ul>

        </div>

      </div>
    </header>
  );
}

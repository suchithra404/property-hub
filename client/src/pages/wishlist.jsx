import { useEffect, useState } from "react";
import ListingItem from "../components/ListingItem";

export default function Wishlist() {

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchWishlist = async () => {
      try {

        // ✅ Get token
        const token = localStorage.getItem("token");

        // ✅ Correct API route + send token
        const res = await fetch("/api/wishlist", {
          method: "GET",
          credentials: "include",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to load wishlist");
        }

        const data = await res.json();

        console.log("Wishlist API Response:", data); // DEBUG

        // ✅ Always force array
        if (Array.isArray(data)) {
          setWishlist(data);
        } else {
          setWishlist([]);
        }

        setLoading(false);

      } catch (err) {
        console.log("Wishlist Error:", err);

        setError("Unable to load wishlist");
        setWishlist([]);
        setLoading(false);
      }
    };

    fetchWishlist();

  }, []);

  return (
    <div className="p-10 max-w-6xl mx-auto">

      <h1 className="text-4xl font-bold text-slate-700 mb-6">
        ❤️ My Wishlist
      </h1>

      {/* Loading */}
      {loading && (
        <p className="text-blue-600">
          Loading wishlist...
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-600">
          {error}
        </p>
      )}

      {/* Empty */}
      {!loading && !error && wishlist.length === 0 && (
        <p className="text-gray-500">
          No items in wishlist yet 😔
        </p>
      )}

      {/* List */}
      {!loading && !error && wishlist.length > 0 && (
        <div className="flex flex-wrap gap-4">

          {wishlist.map((listing) => (
            <ListingItem
              key={listing._id}
              listing={listing}
            />
          ))}

        </div>
      )}

    </div>
  );
}

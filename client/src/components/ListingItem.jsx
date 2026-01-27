import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function ListingItem({ listing, onDelete }) {

  const { currentUser } = useSelector((state) => state.user);

  const isOwner = currentUser && currentUser._id === listing.userRef;

  // ❤️ Wishlist state
  const [isWishlisted, setIsWishlisted] = useState(false);

  // =============================
  // Check if already in wishlist
  // =============================
  useEffect(() => {
    if (!currentUser) return;

    const fetchWishlist = async () => {
      try {
        const res = await fetch("/api/wishlist", {
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok && Array.isArray(data)) {
          const found = data.some(
            (item) => item._id === listing._id
          );

          setIsWishlisted(found);
        }

      } catch (err) {
        console.log("Wishlist Check Error:", err);
      }
    };

    fetchWishlist();

  }, [currentUser, listing._id]);



  // =============================
  // Toggle Wishlist
  // =============================
  const handleWishlist = async (e) => {
  e.preventDefault();
  e.stopPropagation();

  try {
    const res = await fetch(`/api/wishlist/${listing._id}`, {
      method: "PUT",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Wishlist failed");
    }

    const data = await res.json();

    setIsWishlisted((prev) => !prev);

    // ✅ Notify Header
    window.dispatchEvent(new Event("wishlistUpdated"));

    if (!isWishlisted) {
      alert("Added to Wishlist ❤️");
    } else {
      alert("Removed from Wishlist 💔");
    }

  } catch (error) {
    console.log("Wishlist Error:", error);
    alert("Something went wrong 😔");
  }
};




  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px] relative">

      {/* ❤️ WISHLIST BUTTON */}
      {currentUser && (
        <button
          onClick={handleWishlist}
          className={`absolute top-2 left-2 p-2 rounded-full shadow-md z-20 transition ${
            isWishlisted
              ? "bg-red-500 text-white"
              : "bg-white text-gray-500 hover:text-red-500"
          }`}
        >
          <FaHeart size={16} />
        </button>
      )}

      {/* 🔥 DELETE BUTTON */}
      {isOwner && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(listing._id);
          }}
          className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded shadow hover:bg-red-700 z-20"
        >
          Delete
        </button>
      )}

      <Link to={`/listing/${listing._id}`} className="block">

        <img
          src={
            listing.imageUrls[0] ||
            "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg"
          }
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-transform duration-300"
        />

        <div className="p-3 flex flex-col gap-2 w-full">

          <p className="truncate text-lg font-semibold text-slate-700">
            {listing.name}
          </p>

          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />

            <p className="text-sm text-gray-600 truncate w-full">
              {listing.address}
            </p>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>

          <p className="text-slate-500 mt-2 font-semibold">
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" && " / month"}
          </p>

          <div className="text-slate-700 flex gap-4">

            <div className="font-bold text-xs">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds`
                : `${listing.bedrooms} bed`}
            </div>

            <div className="font-bold text-xs">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths`
                : `${listing.bathrooms} bath`}
            </div>

          </div>

        </div>
      </Link>

    </div>
  );
}

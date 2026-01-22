import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function DeleteListing({ listingId, userRef, onDelete }) {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this listing?");
    if (!confirm) return;

    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      if (onDelete) {
        onDelete(listingId);
      } else {
        navigate("/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Show button only if owner
  if (!currentUser || currentUser._id !== userRef) return null;

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 font-semibold hover:underline"
    >
      Delete
    </button>
  );
}

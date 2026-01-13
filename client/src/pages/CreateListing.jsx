import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  /* ================= IMAGE UPLOAD ================= */

  const handleImageSubmit = async () => {
    if (!files || files.length === 0) {
      setImageUploadError("Please select images");
      return;
    }

    if (files.length + formData.imageUrls.length > 6) {
      setImageUploadError("You can upload a maximum of 6 images");
      return;
    }

    try {
      setUploading(true);
      setImageUploadError("");

      const uploadedUrls = [];

      for (let i = 0; i < files.length; i++) {
        const form = new FormData();
        form.append("image", files[i]);

        const res = await fetch("http://localhost:3000/api/listing/upload", {
          method: "POST",
          credentials: "include",
          body: form,
        });

        if (!res.ok) {
          throw new Error("Upload request failed");
        }

        const data = await res.json();

        if (!data.success) {
          throw new Error(data.message || "Upload failed");
        }

        uploadedUrls.push(data.imageUrl);
      }

      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...uploadedUrls],
      }));

      setUploading(false);
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      setImageUploadError("Image upload failed");
      setUploading(false);
    }
  };

  /* ================= FORM HELPERS ================= */

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (id === "sale" || id === "rent") {
      setFormData((prev) => ({ ...prev, type: id }));
      return;
    }

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [id]: checked }));
      return;
    }

    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  /* ================= SUBMIT LISTING ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.imageUrls.length < 1) {
      setError("You must upload at least one image");
      return;
    }

    if (+formData.discountPrice > +formData.regularPrice) {
      setError("Discount price must be lower than regular price");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || data.success === false) {
        setError(data.message || "Failed to create listing");
        return;
      }

      navigate(`/listing/${data._id}`);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            placeholder="Name"
            minLength="10"
            maxLength="62"
            required
            className="border p-3 rounded-lg"
            onChange={handleChange}
            value={formData.name}
          />

          <textarea
            id="description"
            placeholder="Description"
            required
            className="border p-3 rounded-lg"
            onChange={handleChange}
            value={formData.description}
          />

          <input
            type="text"
            id="address"
            placeholder="Address"
            required
            className="border p-3 rounded-lg"
            onChange={handleChange}
            value={formData.address}
          />
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images
            <span className="text-gray-600 ml-2">
              (First image is cover, max 6)
            </span>
          </p>

          <div className="flex gap-4">
            <input
              type="file"
              accept="image/*"
              multiple
              className="p-3 border rounded w-full"
              onChange={(e) => setFiles([...e.target.files])}
            />

            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {imageUploadError && (
            <p className="text-red-700 text-sm">{imageUploadError}</p>
          )}

          {formData.imageUrls.map((url, index) => (
            <div key={url} className="flex justify-between items-center p-3 border">
              <img
                src={url}
                alt="listing"
                className="w-20 h-20 object-contain rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="text-red-700 uppercase"
              >
                Delete
              </button>
            </div>
          ))}

          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded uppercase"
          >
            {loading ? "Creating..." : "Create listing"}
          </button>

          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}

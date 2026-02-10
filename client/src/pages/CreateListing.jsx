import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationPicker({ setFormData }) {
  useMapEvents({
    click(e) {
      setFormData((prev) => ({
        ...prev,
        location: {
          lat: Number(e.latlng.lat),
          lng: Number(e.latlng.lng),
        },
      }));
    },
  });
  return null;
}



export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= FORM DATA =================
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",

    type: "",
    bedrooms: "",
    bathrooms: "",
    regularPrice: "",
    discountPrice: "",
    offer: false,
    parking: false,
    furnished: false,

    propertyType: "Apartment",
    city: "",
    locality: "",
    pincode: "",
    builtUpArea: "",
    floorNumber: "",
    totalFloors: "",

    maintenanceCharge: "",
    securityDeposit: "",
    negotiable: "",

    furnishingType: "Unfurnished",

    amenities: {
      lift: false,
      powerBackup: false,
      waterSupply: false,
      security: false,
      gym: false,
    },

    availableFrom: "",
    immediate: true,

    videoTourLink: "",

    // ======================
// LOCATION (FOR MAP VIEW)
// ======================
location: {
  lat: null,
  lng: null,
},


  });

  /* ================= IMAGE UPLOAD ================= */

  const handleImageSubmit = async () => {
    if (!files || files.length === 0) {
      setImageUploadError("Please select images");
      return;
    }

    if (files.length + formData.imageUrls.length > 6) {
      setImageUploadError("Max 6 images allowed");
      return;
    }

    try {
      setUploading(true);
      setImageUploadError("");

      const uploadedUrls = [];

      for (let i = 0; i < files.length; i++) {
        const form = new FormData();
        form.append("image", files[i]);

        const res = await fetch("/api/listing/upload", {
          method: "POST",
          credentials: "include",
          body: form,
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error("Upload failed");
        }

        uploadedUrls.push(data.imageUrl);
      }

      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...uploadedUrls],
      }));

      setUploading(false);
    } catch (err) {
      setImageUploadError("Image upload failed");
      setUploading(false);
    }
  };

  /* ================= FORM HELPERS ================= */

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (id === "sale" || id === "rent") {
      setFormData((prev) => ({ ...prev, type: id }));
      return;
    }

    if (id.startsWith("amenity-")) {
      const key = id.replace("amenity-", "");

      setFormData((prev) => ({
        ...prev,
        amenities: {
          ...prev.amenities,
          [key]: checked,
        },
      }));
      return;
    }

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [id]: checked }));
      return;
    }

    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.imageUrls.length < 1) {
      setError("Upload at least one image");
      return;
    }

    if (!formData.bedrooms || !formData.bathrooms) {
      setError("Please enter Bedrooms and Bathrooms");
      return;
    }

    if (+formData.discountPrice > +formData.regularPrice) {
      setError("Discount must be lower than price");
      return;
    }

    if (!formData.type) {
  setError("Please select Rent or Sale");
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
        setError(data.message || "Failed");
        return;
      }

      navigate(`/listing/${data._id}`);

    } catch (err) {
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* BASIC */}
        <input id="name" placeholder="Name" required className="border p-3 rounded" onChange={handleChange} />
        <textarea id="description" placeholder="Description" required className="border p-3 rounded" onChange={handleChange} />
        <input id="address" placeholder="Address" required className="border p-3 rounded" onChange={handleChange} />

{/* ================= MAP LOCATION PICKER ================= */}
<div className="mt-6">
  <p className="font-semibold mb-2">📍 Select Property Location</p>

  <MapContainer
    center={[12.9716, 77.5946]} // default center (can be anywhere)
    zoom={10}
    style={{ height: "300px", width: "100%" }}
    className="rounded-lg border"
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; OpenStreetMap contributors"
    />

    <LocationPicker setFormData={setFormData} />

    {formData.location.lat && formData.location.lng && (
      <Marker position={[formData.location.lat, formData.location.lng]} />
    )}
  </MapContainer>

  {typeof formData.location.lat === "number" &&
  typeof formData.location.lng === "number" && (
    <p className="text-sm text-gray-600 mt-2">
      Selected location: {formData.location.lat.toFixed(4)},{" "}
      {formData.location.lng.toFixed(4)}
    </p>
)}

</div>

        {/* LOCATION */}
        <input id="city" placeholder="City" className="border p-3 rounded" onChange={handleChange} />
        <input id="locality" placeholder="Locality" className="border p-3 rounded" onChange={handleChange} />
        <input id="pincode" placeholder="Pincode" className="border p-3 rounded" onChange={handleChange} />

        {/* PROPERTY */}
        <select id="propertyType" className="border p-3 rounded" onChange={handleChange}>
          <option>Apartment</option>
          <option>Villa</option>
          <option>House</option>
          <option>Plot</option>
        </select>

        <select id="furnishingType" className="border p-3 rounded" onChange={handleChange}>
          <option>Unfurnished</option>
          <option>Semi-Furnished</option>
          <option>Fully-Furnished</option>
        </select>

        {/* RENT / SALE */}
<div className="flex gap-4">

  <label className="flex items-center gap-2">
    <input
      type="radio"
      id="rent"
      name="type"
      onChange={handleChange}
    />
    Rent
  </label>

  <label className="flex items-center gap-2">
    <input
      type="radio"
      id="sale"
      name="type"
      onChange={handleChange}
    />
    Sale
  </label>

</div>


        {/* BED & BATH */}
        <div className="flex gap-4">

          <input
            type="number"
            id="bedrooms"
            placeholder="Bedrooms"
            className="border p-3 rounded w-full"
            onChange={handleChange}
            required
          />

          <input
            type="number"
            id="bathrooms"
            placeholder="Bathrooms"
            className="border p-3 rounded w-full"
            onChange={handleChange}
            required
          />

        </div>

        {/* PRICE */}
<div className="flex gap-4">

  <input
    type="number"
    id="regularPrice"
    placeholder="Regular Price"
    className="border p-3 rounded w-full"
    onChange={handleChange}
    required
  />

  <input
    type="number"
    id="discountPrice"
    placeholder="Discount Price (0 if none)"
    className="border p-3 rounded w-full"
    onChange={handleChange}
    value={formData.discountPrice}
  />

</div>





        {/* AMENITIES */}
        <div className="flex gap-4 flex-wrap">
          <label><input type="checkbox" id="amenity-lift" onChange={handleChange} /> Lift</label>
          <label><input type="checkbox" id="amenity-powerBackup" onChange={handleChange} /> Power</label>
          <label><input type="checkbox" id="amenity-security" onChange={handleChange} /> Security</label>
          <label><input type="checkbox" id="amenity-gym" onChange={handleChange} /> Gym</label>
          <label><input type="checkbox" id="amentity-waterSupply" onChange={handleChange}/>water supply</label>
          {/* NEGOTIABLE */}
<label className="flex items-center gap-2">

  <input
    type="checkbox"
    id="negotiable"
    onChange={handleChange}
  />

  Negotiable

</label>

        </div>

        {/* VIDEO */}
        <input id="videoTourLink" placeholder="Video Tour Link" className="border p-3 rounded" onChange={handleChange} />

        {/* IMAGES */}
        <input type="file" multiple accept="image/*" onChange={(e) => setFiles([...e.target.files])} />

        <button type="button" onClick={handleImageSubmit} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Images"}
        </button>

        {/* SUBMIT */}
        <button disabled={loading || uploading} className="bg-slate-700 text-white p-3 rounded">
          {loading ? "Creating..." : "Create Listing"}
        </button>

        {imageUploadError && <p className="text-red-600">{imageUploadError}</p>}
        {error && <p className="text-red-600">{error}</p>}

      </form>
    </main>
  );
}

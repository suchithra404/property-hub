import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// ================= FIX LEAFLET ICON =================
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapView() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/listing/get", {
          credentials: "include",
        });

        const data = await res.json();
        console.log("Raw API response:", data);

        // ✅ Ensure array
        const listingsArray = Array.isArray(data)
          ? data
          : data.listings || [];

        // ✅ Only listings with valid location
        const withLocation = listingsArray.filter(
          (l) =>
            l.location &&
            typeof l.location.lat === "number" &&
            typeof l.location.lng === "number"
        );

        setListings(withLocation);
      } catch (error) {
        console.error("Failed to load listings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading map...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">🗺️ Property Map View</h1>

      {listings.length === 0 ? (
        <p className="text-gray-500">
          No properties with location found.
        </p>
      ) : (
        <MapContainer
          center={[12.9716, 77.5946]}
          zoom={7}
          style={{ height: "500px", width: "100%" }}
          className="rounded-lg border"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {listings.map((listing) => (
            <Marker
              key={listing._id}
              position={[
                listing.location.lat,
                listing.location.lng,
              ]}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{listing.name}</p>
                  <p>₹ {listing.regularPrice}</p>
                  <p className="text-gray-500">{listing.city}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";

export default function Insights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await fetch("/api/insights");
        const data = await res.json();
        setInsights(data);
      } catch (error) {
        console.error("Failed to fetch insights", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading insights...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📊 Market Insights</h1>

      <p className="text-gray-600 mb-8">
        Data-driven overview of property prices, demand, and trends.
      </p>

      {/* Average Price by City */}
<div className="mb-10">
  <h2 className="text-xl font-semibold mb-4">🏙️ Average Price by City</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {insights.avgPriceByCity.map((item, index) => (
      <div
        key={index}
        className="p-4 bg-white rounded-lg shadow border"
      >
        <p className="text-gray-600">{item.city}</p>
        <p className="text-2xl font-bold text-blue-600">
          ₹ {item.averagePrice.toLocaleString()}
        </p>
      </div>
    ))}
  </div>
</div>

{/* Demand Level by City */}
<div className="mb-10">
  <h2 className="text-xl font-semibold mb-4">🔥 Demand Level by City</h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {insights.demandByCity.map((item, index) => (
      <div
        key={index}
        className="p-4 bg-white rounded-lg shadow border"
      >
        <p className="text-gray-600">{item.city}</p>

        <p
          className={`text-lg font-bold ${
            item.demand === "High"
              ? "text-red-600"
              : item.demand === "Medium"
              ? "text-yellow-600"
              : "text-green-600"
          }`}
        >
          {item.demand} Demand
        </p>
      </div>
    ))}
  </div>
</div>

{/* Trending Locations */}
<div className="mb-10">
  <h2 className="text-xl font-semibold mb-4">📈 Trending Locations</h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {insights.trendingLocations.map((item, index) => (
      <div
        key={index}
        className="p-4 bg-white rounded-lg shadow border"
      >
        <p className="text-gray-600">{item.city}</p>
        <p className="text-lg font-bold text-purple-600">
          {item.visits} Visits
        </p>
      </div>
    ))}
  </div>
</div>


{/* Property Type Distribution */}
<div className="mb-10">
  <h2 className="text-xl font-semibold mb-4">🏠 Property Type Distribution</h2>

  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {insights.propertyTypeStats.map((item, index) => (
      <div
        key={index}
        className="p-4 bg-white rounded-lg shadow border text-center"
      >
        <p className="text-gray-600">{item.type}</p>
        <p className="text-2xl font-bold text-purple-600">
          {item.count}
        </p>
      </div>
    ))}
  </div>
</div>


    </div>
  );
}

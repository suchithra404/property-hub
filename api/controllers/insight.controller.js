import Listing from '../models/listing.model.js';
import VisitRequest from '../models/visitRequest.model.js';


export const getInsights = async (req, res, next) => {
  try {
    // 1️⃣ Get all listings
    const listings = await Listing.find({});

    // 2️⃣ Group prices by city
    const cityMap = {};

    listings.forEach((listing) => {
  const city = listing.city?.trim();
  const price = Number(listing.regularPrice);

  // Skip invalid data safely
  if (!price || isNaN(price)) return;

  // If city is empty, group under "Unknown"
  const cityKey = city && city.length > 0 ? city : "Unknown";

  if (!cityMap[cityKey]) {
    cityMap[cityKey] = { total: 0, count: 0 };
  }

  cityMap[cityKey].total += price;
  cityMap[cityKey].count += 1;
});



    // 3️⃣ Calculate average price
    const avgPriceByCity = Object.keys(cityMap).map((city) => ({
      city,
      averagePrice: Math.round(cityMap[city].total / cityMap[city].count),
    }));

    // ======================
// DEMAND LEVEL BY CITY
// ======================

const visits = await VisitRequest.find({}).populate('listingId');

const demandMap = {};

visits.forEach((visit) => {
  const city = visit.listingId?.city?.trim() || "Unknown";

  if (!demandMap[city]) {
    demandMap[city] = 0;
  }

  demandMap[city] += 1;
});

const demandByCity = Object.keys(demandMap).map((city) => {
  const count = demandMap[city];

  let demand = "Low";

  if (count >= 10) demand = "High";
  else if (count >= 5) demand = "Medium";

  return { city, demand };
});

// ======================
// TRENDING LOCATIONS
// ======================

const trendingMap = {};

visits.forEach((visit) => {
  const city = visit.listingId?.city?.trim() || "Unknown";

  if (!trendingMap[city]) {
    trendingMap[city] = 0;
  }

  trendingMap[city] += 1;
});

const trendingLocations = Object.keys(trendingMap)
  .map((city) => ({
    city,
    visits: trendingMap[city],
  }))
  .sort((a, b) => b.visits - a.visits)
  .slice(0, 5);

  // ======================
// PROPERTY TYPE DISTRIBUTION
// ======================

const typeMap = {};

listings.forEach((listing) => {
  const type = listing.propertyType || "Unknown";

  if (!typeMap[type]) {
    typeMap[type] = 0;
  }

  typeMap[type] += 1;
});

const propertyTypeStats = Object.keys(typeMap).map((type) => ({
  type,
  count: typeMap[type],
}));




    // 4️⃣ Send response
    res.status(200).json({
  avgPriceByCity,
  demandByCity,
  trendingLocations,
  propertyTypeStats,
});

  } catch (error) {
    next(error);
  }
};

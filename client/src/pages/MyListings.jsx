import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ListingItem from '../components/ListingItem';

export default function MyListings() {

  const { currentUser } = useSelector((state) => state.user);

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();

      setListings(data);
      setLoading(false);

    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">

      <h1 className="text-3xl font-semibold text-center mb-6">
        My Listings
      </h1>

      {/* Loading */}
      {loading && <p className="text-center">Loading...</p>}

      {/* No Listings */}
      {!loading && listings.length === 0 && (
        <p className="text-center text-gray-500 text-lg">
          You don’t have any listings yet 😔
        </p>
      )}

      {/* Listings */}
      {!loading && listings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          {listings.map((listing) => (
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

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import { useSelector } from 'react-redux';

export default function Search() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true',
        furnished: furnishedFromUrl === 'true',
        offer: offerFromUrl === 'true',
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) setShowMore(true);
      else setShowMore(false);
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setSidebardata({
        ...sidebardata,
        [e.target.id]: e.target.checked,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    navigate(`/search?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    const startIndex = listings.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
    const data = await res.json();
    if (data.length < 9) setShowMore(false);
    setListings([...listings, ...data]);
  };

  // 🔥 delete listing
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        alert(data.message);
        return;
      }
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex flex-col md:flex-row w-full'>
      {/* FILTER PANEL */}
      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen w-full md:w-[350px]'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Search Term:</label>
            <input
              type='text'
              id='searchTerm'
              value={sidebardata.searchTerm}
              onChange={handleChange}
              className='border rounded-lg p-3 w-full'
            />
          </div>

          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Type:</label>
            {['all', 'rent', 'sale', 'offer'].map((type) => (
              <label key={type} className='flex gap-1'>
                <input
                  type='checkbox'
                  id={type}
                  checked={sidebardata.type === type || (type === 'offer' && sidebardata.offer)}
                  onChange={handleChange}
                />
                {type}
              </label>
            ))}
          </div>

          <div className='flex gap-2'>
            <label>
              <input type='checkbox' id='parking' checked={sidebardata.parking} onChange={handleChange} /> Parking
            </label>
            <label>
              <input type='checkbox' id='furnished' checked={sidebardata.furnished} onChange={handleChange} /> Furnished
            </label>
          </div>

          <select id='sort_order' onChange={handleChange} className='border p-3 rounded-lg'>
            <option value='regularPrice_desc'>Price high to low</option>
            <option value='regularPrice_asc'>Price low to high</option>
            <option value='createdAt_desc'>Latest</option>
            <option value='createdAt_asc'>Oldest</option>
          </select>

          <button className='bg-slate-700 text-white p-3 rounded-lg'>Search</button>
        </form>
      </div>

      {/* RESULTS */}
      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing results:</h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {loading && <p>Loading...</p>}
          {!loading &&
            listings.map((listing) => (
              <ListingItem
                key={listing._id}
                listing={listing}
                currentUser={currentUser}
                onDelete={handleDelete}
              />
            ))}
          {showMore && (
            <button onClick={onShowMoreClick} className='text-green-700 w-full'>
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

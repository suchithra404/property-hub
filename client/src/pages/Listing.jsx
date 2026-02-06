import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';

import Contact from '../components/Contact';
import DeleteListing from './DeleteListing';
import VisitRequestForm from '../components/VisitRequestForm';


export default function Listing() {
  SwiperCore.use([Navigation]);

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);

  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();

        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }

        setListing(data);
        setLoading(false);
        setError(false);

      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  /* ================= UI ================= */

  return (
    <main>

      {loading && (
        <p className='text-center my-7 text-2xl'>Loading...</p>
      )}

      {error && (
        <p className='text-center my-7 text-2xl'>
          Something went wrong!
        </p>
      )}

      {listing && !loading && !error && (

        <div>

          {/* ================= SLIDER ================= */}

          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* ================= SHARE ================= */}

          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);

                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>

          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}

          {/* ================= DETAILS ================= */}

          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>

            {/* TITLE */}
            <p className='text-2xl font-semibold'>
              {listing.name} - $
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>

            {/* ADDRESS */}
            <p className='flex items-center mt-2 gap-2 text-slate-600 text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>

            {/* TAGS */}
            <div className='flex gap-4'>

              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>

              {listing.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}

            </div>

            {/* DELETE */}
            <DeleteListing
              listingId={listing._id}
              userRef={listing.userRef}
            />

            {/* DESCRIPTION */}
            <p className='text-slate-800'>
              <span className='font-semibold'>Description: </span>
              {listing.description}
            </p>

            {/* BASIC INFO */}
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>

              <li className='flex items-center gap-1'>
                <FaBed />
                {listing.bedrooms} Beds
              </li>

              <li className='flex items-center gap-1'>
                <FaBath />
                {listing.bathrooms} Baths
              </li>

              <li className='flex items-center gap-1'>
                <FaParking />
                {listing.parking ? 'Parking' : 'No Parking'}
              </li>

              <li className='flex items-center gap-1'>
                <FaChair />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>

            </ul>

            {/* ================= EXTRA DETAILS ================= */}

            <div className='border rounded-lg p-4 bg-slate-50'>

              <h2 className='font-semibold mb-2'>
                Property Details
              </h2>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm'>

                <p><b>Type:</b> {listing.propertyType}</p>

                {listing.builtUpArea > 0 && (
                  <p><b>Area:</b> {listing.builtUpArea} sq.ft</p>
                )}

                {listing.totalFloors > 0 && (
                  <p>
                    <b>Floor:</b> {listing.floorNumber} / {listing.totalFloors}
                  </p>
                )}

                <p><b>Furnishing:</b> {listing.furnishingType}</p>

                {(listing.city || listing.locality) && (
                  <p>
                    <b>Location:</b> {listing.locality}, {listing.city}
                  </p>
                )}

                {listing.maintenanceCharge > 0 && (
                  <p><b>Maintenance:</b> ₹{listing.maintenanceCharge}</p>
                )}

                {listing.securityDeposit > 0 && (
                  <p><b>Deposit:</b> ₹{listing.securityDeposit}</p>
                )}

                <p>
                  <b>Negotiable:</b> {listing.negotiable ? 'Yes' : 'No'}
                </p>

              </div>

            </div>

            {/* ================= AMENITIES ================= */}

            {listing.amenities && (

              <div className='border rounded-lg p-4 bg-slate-50'>

                <h2 className='font-semibold mb-2'>
                  Amenities
                </h2>

                <div className='flex flex-wrap gap-3 text-sm'>

                  {listing.amenities.lift && <span>🛗 Lift</span>}
                  {listing.amenities.powerBackup && <span>🔌 Power</span>}
                  {listing.amenities.waterSupply && <span>💧 Water</span>}
                  {listing.amenities.security && <span>🛡️ Security</span>}
                  {listing.amenities.gym && <span>🏋️ Gym</span>}

                  {!listing.amenities.lift &&
                    !listing.amenities.powerBackup &&
                    !listing.amenities.security &&
                    !listing.amenities.gym && (
                      <span className='text-gray-500'>
                        No extra amenities
                      </span>
                    )}

                </div>

              </div>
            )}

            {/* ================= VIDEO ================= */}

            {listing.videoTourLink && (

              <div className='border rounded-lg p-4 bg-slate-50'>

                <h2 className='font-semibold mb-2'>
                  Video Tour
                </h2>

                <a
                  href={listing.videoTourLink}
                  target='_blank'
                  rel='noreferrer'
                  className='text-blue-600 underline'
                >
                  Watch Video
                </a>

              </div>
            )}

            {/* ================= CONTACT ================= */}

            {currentUser &&
              listing.userRef !== currentUser._id &&
              !contact && (

                <button
                  onClick={() => setContact(true)}
                  className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
                >
                  Contact landlord
                </button>
              )}

            {contact && <Contact listing={listing} />}

            {/* ================= VISIT REQUEST ================= */}

{currentUser &&
  listing.userRef !== currentUser._id && (
    <VisitRequestForm listingId={listing._id} />
)}


          </div>
        </div>
      )}
    </main>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>

      {/* ================= HERO SECTION ================= */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span>
          <br />
          place with ease
        </h1>

        <div className='text-gray-400 text-xs sm:text-sm'>
          Property Hub is the best place to find your next perfect place to live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>

        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Let's get started...
        </Link>
      </div>


      {/* ================= SWIPER ================= */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='h-[500px]'
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>


      {/* ================= WHY CHOOSE US ================= */}
      <section className='bg-white py-16'>
        <div className='max-w-6xl mx-auto px-6 text-center'>

          <h2 className='text-3xl font-bold text-slate-700 mb-4'>
            Why Choose Property Hub?
          </h2>

          <p className='text-slate-500 mb-12'>
            We make finding your perfect home simple, safe, and fast.
          </p>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>

            {/* Card 1 */}
            <div className='bg-slate-100 p-8 rounded-xl shadow hover:shadow-lg transition'>
              <div className='text-4xl mb-4'>🏠</div>

              <h3 className='text-xl font-semibold mb-2'>
                Verified Listings
              </h3>

              <p className='text-slate-600 text-sm'>
                All properties are verified to ensure safety and authenticity.
              </p>
            </div>


            {/* Card 2 */}
            <div className='bg-slate-100 p-8 rounded-xl shadow hover:shadow-lg transition'>
              <div className='text-4xl mb-4'>📞</div>

              <h3 className='text-xl font-semibold mb-2'>
                24/7 Support
              </h3>

              <p className='text-slate-600 text-sm'>
                Our support team is always ready to help you anytime.
              </p>
            </div>


            {/* Card 3 */}
            <div className='bg-slate-100 p-8 rounded-xl shadow hover:shadow-lg transition'>
              <div className='text-4xl mb-4'>⚡</div>

              <h3 className='text-xl font-semibold mb-2'>
                Easy Booking
              </h3>

              <p className='text-slate-600 text-sm'>
                Book visits and properties quickly with just a few clicks.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* ================= LISTINGS ================= */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>

        {/* Offers */}
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>
                Recent offers
              </h2>

              <Link
                className='text-sm text-blue-800 hover:underline'
                to={'/search?offer=true'}
              >
                Show more offers
              </Link>
            </div>

            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}


        {/* Rent */}
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>
                Recent places for rent
              </h2>

              <Link
                className='text-sm text-blue-800 hover:underline'
                to={'/search?type=rent'}
              >
                Show more places for rent
              </Link>
            </div>

            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}


        {/* Sale */}
        {saleListings && saleListings.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>
                Recent places for sale
              </h2>

              <Link
                className='text-sm text-blue-800 hover:underline'
                to={'/search?type=sale'}
              >
                Show more places for sale
              </Link>
            </div>

            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

      </div>
      {/* ================= OUR TEAM ================= */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold text-slate-700 mb-4">
            Meet Our Support Team
          </h2>

          <p className="text-slate-500 mb-12">
            Our dedicated professionals are here to help buyers and sellers every day.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

            {/* Member 1 */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                className="w-28 h-28 mx-auto rounded-full mb-4"
                alt="Priya"
              />

              <h3 className="font-semibold text-lg">Priya Sharma</h3>
              <p className="text-sm text-slate-500">Sales Manager</p>

              <button
                onClick={() => {
                  setSelectedMember("Priya Sharma");
                  setShowContactForm(true);
                }}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700"
              >
                Contact
              </button>
            </div>


            {/* Member 2 */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                className="w-28 h-28 mx-auto rounded-full mb-4"
                alt="Ravi"
              />

              <h3 className="font-semibold text-lg">Ravi Kumar</h3>
              <p className="text-sm text-slate-500">Customer Support</p>

              <button
                onClick={() => {
                  setSelectedMember("Ravi Kumar");
                  setShowContactForm(true);
                }}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700"
              >
                Contact
              </button>
            </div>


            {/* Member 3 */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <img
                src="https://randomuser.me/api/portraits/women/68.jpg"
                className="w-28 h-28 mx-auto rounded-full mb-4"
                alt="Anjali"
              />

              <h3 className="font-semibold text-lg">Anjali Rao</h3>
              <p className="text-sm text-slate-500">Property Advisor</p>

              <button
                onClick={() => {
                  setSelectedMember("Anjali Rao");
                  setShowContactForm(true);
                }}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700"
              >
                Contact
              </button>
            </div>


            {/* Member 4 */}
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <img
                src="https://randomuser.me/api/portraits/men/76.jpg"
                className="w-28 h-28 mx-auto rounded-full mb-4"
                alt="Suresh"
              />

              <h3 className="font-semibold text-lg">Suresh Patil</h3>
              <p className="text-sm text-slate-500">Field Executive</p>

              <button
                onClick={() => {
                  setSelectedMember("Suresh Patil");
                  setShowContactForm(true);
                }}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700"
              >
                Contact
              </button>
            </div>

          </div>
        </div>


        {/* ================= CONTACT POPUP ================= */}
        {showContactForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

            <div className="bg-white p-6 rounded-xl w-[350px] text-left relative">

              <button
                onClick={() => setShowContactForm(false)}
                className="absolute top-2 right-3 text-xl"
              >
                ✖
              </button>

              <h3 className="text-xl font-semibold mb-3">
                Contact {selectedMember}
              </h3>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();

                  const name = e.target.name.value;
                  const email = e.target.email.value;
                  const message = e.target.message.value;

                  try {
                    const res = await fetch("/api/contact/send", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        name,
                        email,
                        message,
                        staff: selectedMember,
                      }),
                    });

                    const data = await res.json();

                    if (data.success) {
                      alert("Message sent successfully ✅");
                      setShowContactForm(false);
                    } else {
                      alert("Failed to send ❌");
                    }

                  } catch (err) {
                    console.log(err);
                    alert("Server error ❌");
                  }
                }}
                className="flex flex-col gap-3"
              >

                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="border p-2 rounded"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  className="border p-2 rounded"
                />

                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows="3"
                  required
                  className="border p-2 rounded"
                ></textarea>

                <button
                  type="submit"
                  className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  Send Message
                </button>

              </form>

            </div>
          </div>
        )}

      </section>

    </div>
  );
}

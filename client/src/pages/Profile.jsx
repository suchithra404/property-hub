import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState } from 'react';

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from '../redux/user/userSlice';

import { Link } from 'react-router-dom';

export default function Profile() {

  const fileRef = useRef(null);

  const { currentUser, loading } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({});
  const [userListings, setUserListings] = useState([]);
  const [showListingsError, setShowListingsError] = useState(false);


  // ================= CLOUDINARY UPLOAD =================

  const uploadImage = async (file) => {
    try {

      const form = new FormData();

      form.append('file', file);

      form.append('upload_preset', 'property_hub'); // ✅ Your preset

      const res = await fetch(
        'https://api.cloudinary.com/v1_1/dtfskzfqt/image/upload', // ✅ Your cloud name
        {
          method: 'POST',
          body: form,
        }
      );

      const data = await res.json();

      if (!data.secure_url) {
        console.log("Upload Failed:", data);
        return;
      }

      setFormData((prev) => ({
        ...prev,
        avatar: data.secure_url,
      }));

    } catch (err) {
      console.log('Cloudinary Error:', err);
    }
  };


  // ================= REMOVE PHOTO =================

  const removePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      avatar:
        'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    }));
  };


  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };


  // ================= UPDATE USER =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));

      alert("Profile Updated ✅");

    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };


  // ================= DELETE USER =================

  const handleDeleteUser = async () => {
    try {

      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess());

    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };


  // ================= SIGN OUT =================

  const handleSignOut = async () => {
    try {

      dispatch(signOutUserStart());

      const res = await fetch('/api/auth/signout', {
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(signOutUserFailure(data.message));
        return;
      }

      dispatch(signOutUserSuccess());

    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };


  // ================= SHOW LISTINGS =================

  const handleShowListings = async () => {

    if (!currentUser?._id) {
      setShowListingsError(true);
      return;
    }

    try {

      setShowListingsError(false);

      const res = await fetch(
        `/api/listing/user/${currentUser._id}`,
        { credentials: 'include' }
      );

      const data = await res.json();

      if (!res.ok) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);

    } catch {
      setShowListingsError(true);
    }
  };


  // ================= DELETE LISTING =================

  const handleListingDelete = async (id) => {
    try {

      const res = await fetch(`/api/listing/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) return;

      setUserListings((prev) =>
        prev.filter((l) => l._id !== id)
      );

    } catch (error) {
      console.log(error.message);
    }
  };


  // ================= UI =================

  return (
    <div className="p-3 max-w-lg mx-auto">

      <h1 className="text-3xl font-semibold text-center my-7">
        Profile
      </h1>


      <form onSubmit={handleSubmit} className="flex flex-col gap-4">


        {/* Hidden File Input */}

        <input
          hidden
          type="file"
          ref={fileRef}
          accept="image/*"
          onChange={(e) => {
            if (e.target.files[0]) {
              uploadImage(e.target.files[0]);
            }
          }}
        />


        {/* Profile Image */}

        <img
          src={
            formData.avatar ||
            currentUser.avatar ||
            'https://cdn-icons-png.flaticon.com/512/149/149071.png'
          }
          onClick={() => fileRef.current.click()}
          className="rounded-full h-24 w-24 cursor-pointer self-center object-cover"
        />


        {/* Remove Button */}

        <button
          type="button"
          onClick={removePhoto}
          className="text-red-600 text-sm text-center"
        >
          Remove Photo
        </button>


        {/* Username */}

        <input
          defaultValue={currentUser.username}
          id="username"
          onChange={handleChange}
          className="border p-3"
        />


        {/* Email */}

        <input
          defaultValue={currentUser.email}
          id="email"
          onChange={handleChange}
          className="border p-3"
        />


        {/* Password */}

        <input
          type="password"
          id="password"
          onChange={handleChange}
          className="border p-3"
          placeholder="New Password"
        />


        {/* Update Button */}

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg"
        >
          {loading ? 'Loading…' : 'Update'}
        </button>


        {/* Create Listing */}

        <Link
          to="/create-listing"
          className="bg-green-700 text-white p-3 rounded-lg text-center"
        >
          Create Listing
        </Link>


        {/* Show Listings */}

        <Link
  to="/my-listings"
  className="text-green-600 cursor-pointer hover:underline"
>
  Show My Listings
</Link>


      </form>


      {/* Delete / Signout */}

      <div className="flex justify-between mt-5">

        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>

        <span
          onClick={handleSignOut}
          className="text-red-700 cursor-pointer"
        >
          Sign out
        </span>

      </div>


      {/* Error */}

      {showListingsError && (
        <p className="text-red-700 mt-3">
          Error showing listings
        </p>
      )}


      {/* Listings */}

      {userListings.map((l) => (
        <div
          key={l._id}
          className="flex justify-between border p-3 mt-2"
        >

          <Link to={`/listing/${l._id}`}>
            {l.name}
          </Link>

          <span
            onClick={() => handleListingDelete(l._id)}
            className="text-red-700 cursor-pointer"
          >
            Delete
          </span>

        </div>
      ))}

    </div>
  );
}

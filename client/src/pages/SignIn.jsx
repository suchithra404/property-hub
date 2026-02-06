import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';

import OAuth from '../components/OAuth';


export default function SignIn() {

  // ================= STATES =================

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
  });

  const { loading, error } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();


  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };


  // ================= LOGIN =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // At least email or phone
    if (
      (!formData.email && !formData.phone) ||
      !formData.password
    ) {
      dispatch(
        signInFailure('Please enter Email or Mobile and Password')
      );
      return;
    }

    try {

      dispatch(signInStart());

      const res = await fetch('/api/auth/signin', {
        method: 'POST',

        credentials: 'include',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        dispatch(
          signInFailure(data.message || 'Invalid credentials')
        );
        return;
      }

      dispatch(signInSuccess(data));

      alert('Signed in successfully 🎉');

      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }

    } catch (err) {
      dispatch(
        signInFailure(err.message || 'Something went wrong')
      );
    }
  };


  // ================= UI =================

  return (
    <div className='p-3 max-w-lg mx-auto'>

      <h1 className='text-3xl text-center font-semibold my-7'>
        Sign In
      </h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

        {/* Email */}

        <input
          type='email'
          placeholder='Email (Optional)'
          className='border p-3 rounded-lg'
          id='email'
          value={formData.email}
          onChange={handleChange}
        />

        {/* Mobile */}

        <input
          type='text'
          placeholder='Mobile Number (Optional)'
          className='border p-3 rounded-lg'
          id='phone'
          value={formData.phone}
          onChange={handleChange}
        />

        {/* Password */}

        <input
          type='password'
          placeholder='Password'
          className='border p-3 rounded-lg'
          id='password'
          value={formData.password}
          onChange={handleChange}
        />

        {/* Login Button */}

        <button
          type='submit'
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>

        {/* Google Login */}

        <OAuth />

      </form>


      {/* Signup Link */}

      <div className='flex gap-2 mt-5'>
        <p>Dont have an account?</p>

        <Link to='/sign-up'>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>


      {/* Error */}

      {error && (
        <p className='text-red-500 mt-5'>{error}</p>
      )}

    </div>
  );
}

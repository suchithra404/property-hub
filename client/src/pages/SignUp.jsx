import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {

  const [formData, setFormData] = useState({
    accountType: 'buyer', // ✅ default
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }

      setLoading(false);
      setError(null);

      navigate('/sign-in');

    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>

      <h1 className='text-3xl text-center font-semibold my-7'>
        Sign Up
      </h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          required
        />

        {/* Email */}
        <input
          type='email'
          placeholder='Email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleChange}
          required
        />

        {/* Password */}
        <input
          type='password'
          placeholder='Password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange}
          required
        />

        {/* ✅ User Type Selection */}
        <select
          id="accountType"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          value={formData.userType}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
          <option value="both">Buyer & Seller</option>
        </select>

        {/* Submit */}
        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>

        <OAuth />
      </form>

      {/* Login Link */}
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>

        <Link to={'/sign-in'}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>

      {/* Error */}
      {error && <p className='text-red-500 mt-5'>{error}</p>}

    </div>
  );
}

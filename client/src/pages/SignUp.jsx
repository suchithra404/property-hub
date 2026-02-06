import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {

  const [formData, setFormData] = useState({
  username: '',
  email: '',
  phone: '',
  password: '',
  accountType: 'buyer',
});


  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };


  // ================= HANDLE SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending:", formData);

    // At least email or phone
    if (!formData.email && !formData.phone) {
      setError('Please enter Email or Mobile Number');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch('/api/auth/signup', {
  method: 'POST',

  credentials: 'include',   // ✅ VERY IMPORTANT

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


  // ================= UI =================

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

        {/* Email (Optional) */}
        <input
          type='email'
          placeholder='Email (Optional)'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleChange}
        />

        {/* Phone (Optional) */}
        <input
          type='text'
          placeholder='Mobile Number (Optional)'
          className='border p-3 rounded-lg'
          id='phone'
          onChange={handleChange}
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

        {/* Account Type */}
        <select
          id="accountType"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          value={formData.accountType}
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

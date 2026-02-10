import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import SignIn from './pages/Signin';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogs from './pages/AdminLogs'; 
import Wishlist from "./pages/wishlist";
import MyListings from './pages/MyListings';
import VisitRequests from "./pages/VisitRequests";
import AdminMessages from "./pages/AdminMessages";
import Insights from "./pages/Insights";
import Alerts from "./pages/Alerts";
import MapView from "./pages/MapView";




export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>

        {/* Public Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/about' element={<About />} />
        <Route path='/search' element={<Search />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/my-listings" element={<MyListings />} />

        <Route path='/listing/:listingId' element={<Listing />} />
        <Route path="/visits" element={<VisitRequests />} />
        <Route path="/admin/messages" element={<AdminMessages />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/map" element={<MapView />} />





        {/* User Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route
            path='/update-listing/:listingId'
            element={<UpdateListing />}
          />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<AdminRoute />}>
          <Route
            path='/admin/dashboard'
            element={<AdminDashboard />}
          />

          {/* ✅ Admin Logs */}
          <Route
            path='/admin/logs'
            element={<AdminLogs />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function AdminRoute() {

  const { currentUser } = useSelector((state) => state.user);

  // Not logged in
  if (!currentUser) {
    return <Navigate to="/sign-in" />;
  }

  // Allow only admin OR superadmin
  if (
    currentUser.role !== 'admin' &&
    currentUser.role !== 'superadmin'
  ) {
    return <Navigate to="/" />;
  }

  // Is admin / superadmin → allow access
  return <Outlet />;
}

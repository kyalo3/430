import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** UX gate only — backend RBAC is the security boundary. */
const PrivateRoute = ({ children }) => {
  const { currentUser, authLoading, userToken } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Checking access…</div>;
  }

  if (!currentUser && !userToken) {
    return <Navigate to="/" replace state={{ from: location, authRequired: true }} />;
  }

  return children;
};

export default PrivateRoute;

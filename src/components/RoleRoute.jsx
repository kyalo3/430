import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PrivateRoute from './PrivateRoute';
import { getAccessToken } from '../lib/api';

const RoleRoute = ({ roles, children }) => {
  const { userRole, currentUser, userToken, authLoading } = useAuth();
  const allowed = Array.isArray(roles) ? roles : [roles];
  const role = userRole || currentUser?.role;
  const sessionPending = Boolean((userToken || getAccessToken()) && !role);

  return (
    <PrivateRoute>
      {authLoading || sessionPending ? (
        <div className="min-h-screen flex items-center justify-center">Opening your dashboard…</div>
      ) : !role || !allowed.includes(role) ? (
        <Navigate to="/" replace />
      ) : (
        children
      )}
    </PrivateRoute>
  );
};

export default RoleRoute;

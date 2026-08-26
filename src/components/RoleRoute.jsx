import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PrivateRoute from './PrivateRoute';

const RoleRoute = ({ roles, children }) => {
  const { userRole, currentUser } = useAuth();
  const allowed = Array.isArray(roles) ? roles : [roles];

  return (
    <PrivateRoute>
      {!currentUser || !allowed.includes(userRole || currentUser.role) ? (
        <Navigate to="/" replace />
      ) : (
        children
      )}
    </PrivateRoute>
  );
};

export default RoleRoute;

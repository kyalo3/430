import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RoleRoute = () => {
  const { userRole } = useContext(AuthContext);

  if (!userRole) return <Navigate to="/" replace />;
  }

  switch (userRole) {
    case "donor":
      return <Navigate to="/dashboard/donor" replace />;
    case "recipient":
      return <Navigate to="/dashboard/recipient" replace />;
    case "volunteer":
      return <Navigate to="/dashboard/volunteer" replace />;
    case "admin":
      return <Navigate to="/dashboard/admin" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

export default RoleRoute;

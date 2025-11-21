import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { userToken } = useContext(AuthContext);

  if (!userToken) return <Navigate to="/login" replace />;

  return children;
};

export default PrivateRoute;

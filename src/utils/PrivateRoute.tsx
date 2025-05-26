import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactElement } from "react";

const PrivateRoute = ({ children }: { children: ReactElement }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;

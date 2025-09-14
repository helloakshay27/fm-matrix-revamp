import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getCloudLoginRoute } from "../../utils/navigationUtils";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    // Use smart routing to determine the correct login route
    const loginRoute = getCloudLoginRoute(location.pathname);
    return <Navigate to={loginRoute} replace />;
  }

  return children;
};

export default ProtectedRoute;

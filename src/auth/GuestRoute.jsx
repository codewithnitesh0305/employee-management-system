import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function GuestRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div role="status">Checking your session...</div>;
  }

  if (isAuthenticated) {
    const requestedPath = location.state?.from?.pathname;
    const destination =
      requestedPath && requestedPath !== "/login"
        ? requestedPath
        : "/employee-information/employeeslist";

    return <Navigate to={destination} replace />;
  }

  return children || <Outlet />;
}

export default GuestRoute;

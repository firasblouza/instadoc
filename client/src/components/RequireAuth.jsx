import { Navigate, useLocation, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import jwt_decode from "jwt-decode";

const RequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    // No token exists, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const decoded = jwt_decode(accessToken);
  console.log(`This is the decoded : ${decoded.UserInfo.email}`);
  return decoded?.UserInfo?.email ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} reaplce />
  );
};

export default RequireAuth;

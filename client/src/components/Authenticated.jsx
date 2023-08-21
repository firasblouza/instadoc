import { Navigate, useLocation, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import jwt_decode from "jwt-decode";

const Authenticated = () => {
  const { auth } = useAuth();
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    // Already logged in, redirect to home
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const decoded = jwt_decode(accessToken);
  console.log(`This is the decoded : ${decoded.UserInfo.email}`);
  return decoded?.UserInfo?.email ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} reaplce />
  );
};

export default Authenticated;

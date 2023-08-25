import { Navigate, useLocation, Outlet } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import useAccessToken from "../hooks/useAccessToken";
import jwt_decode from "jwt-decode";

const Authenticated = () => {
  const { auth } = useAuth();
  const location = useLocation();
  const { accessToken, decodedToken } = useAccessToken();

  if (accessToken && accessToken !== "") {
    // Already logged in, redirect to home
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  console.log(`This is the decoded : ${decodedToken.UserInfo.email}`);
  return decodedToken?.UserInfo?.email ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} reaplce />
  );
};

export default Authenticated;

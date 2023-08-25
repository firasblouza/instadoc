import jwt_decode from "jwt-decode";

const useAccessToken = () => {
  const accessToken = localStorage.getItem("accessToken");
  const decodedToken = jwt_decode(accessToken);
  if (decodedToken) {
    return { accessToken, decodedToken };
  } else {
    return null;
  }
};

export default useAccessToken;

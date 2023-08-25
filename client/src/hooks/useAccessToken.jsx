import jwt_decode from "jwt-decode";

const useAccessToken = () => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    try {
      const decodedToken = jwt_decode(accessToken);
      return { accessToken, decodedToken };
    } catch (error) {
      console.error("Error decoding access token:", error);
      return null;
    }
  } else {
    return null;
  }
};

export default useAccessToken;

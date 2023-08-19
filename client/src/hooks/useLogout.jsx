import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth } = useAuth();
  const handleLogout = async () => {
    try {
      const response = await axios.get("/logout", {
        withCredentials: true
      });
      console.log(` This is the logout `, response);
      setAuth({});
      localStorage.removeItem("accessToken");
    } catch (error) {
      console.log(error);
    }
  };
  return handleLogout;
};

export default useLogout;

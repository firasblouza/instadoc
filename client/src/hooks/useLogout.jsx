import axios from "../api/axios";
import useAuth from "./useAuth";

import { useNavigate } from "react-router-dom";

const useLogout = () => {
  let loggedOut = false;
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    if (loggedOut === false) {
      try {
        const response = await axios.get("/logout", {
          withCredentials: true
        });
        console.log(` This is the logout `, auth);
        setAuth({
          id: "",
          email: "",
          fullName: "",
          role: "",
          accessToken: ""
        });
        localStorage.removeItem("accessToken");
        navigate("/");

        console.log(auth);
        loggedOut = true;
      } catch (error) {
        console.log(error);
      }
    }
  };
  return handleLogout;
};

export default useLogout;

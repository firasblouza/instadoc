import { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../api/axios";
import jwt_decode from "jwt-decode";
import useLogout from "../hooks/useLogout";

import {
  isValidData,
  isValidPassword,
  isValidEmail
} from "../utils/Validation";

import SignupMain from "../components/Signup/SignupMain";
import SignupData from "../components/Signup/SignupData";
import SignupFinish from "../components/Signup/SignupFinish";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  // Intialize the user data
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    role: "",
    profileImage: null,
    idType: "",
    idNumber: "",
    idImage: null,
    licenseNumber: "",
    licenseImage: null,
    speciality: ""
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  // Signup Error State
  const [signupMessage, setSignupMessage] = useState({
    message: "",
    error: false
  });

  // Login Error State
  const [loginMessage, setLoginMessage] = useState({
    message: "",
    error: false
  });

  const [userInfo, setUserInfo] = useState({});

  const [step, setStep] = useState(1);

  const [auth, setAuth] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const LOGIN_URL = "/login";
  const REGISTER_URL = "/register";

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const decodedToken = jwt_decode(accessToken);
      setAuth({
        email: decodedToken.UserInfo.email,
        fullName: decodedToken.UserInfo.fullName,
        role: decodedToken.UserInfo.role,
        accessToken: accessToken
      });
    }
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const decodedToken = jwt_decode(accessToken);
      const expiresInMs = decodedToken.exp * 1000 - Date.now();

      if (expiresInMs > 0) {
        const timeoutId = setTimeout(() => {
          localStorage.clear();
          setAuth({});
          console.log("cleared token");

          // Call the useLogout function here
          navigate("/logout");
        }, expiresInMs);

        // Clean up the timeout when the component unmounts or when access token changes
        return () => clearTimeout(timeoutId);
      }
    }
  }, [auth.accessToken]);

  // Validate Signup Email while typing
  useEffect(() => {
    if (!userData.email) return;
    isValidEmail(userData.email, setSignupMessage);
  }, [userData.email]);

  // Validate Signup Password while typing
  useEffect(() => {
    if (!userData.password) return;
    isValidPassword(
      userData.password,
      userData.confirmPassword,
      setSignupMessage
    );
  }, [userData.password, userData.confirmPassword]);

  // Handle User Login
  const handleUserLogin = async (e) => {
    e.preventDefault();

    const { email, password, rememberMe } = loginData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.length === 0)
      return setLoginMessage({
        message: "Please enter your email",
        error: true
      });

    if (password.length === 0)
      return setLoginMessage({
        message: "Please enter your password",
        error: true
      });

    if (!emailRegex.test(email))
      return setLoginMessage({
        message: "Please enter a valid email",
        error: true
      });

    if (auth?.accessToken)
      return setLoginMessage({ message: "Already Logged In", error: true });

    try {
      const response = await axios.post(LOGIN_URL, loginData, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      });

      setLoginMessage({ message: response.data.message, error: false });

      // Empty the fields after successful login

      const accessToken = response.data.accessToken;
      const decodedToken = jwt_decode(accessToken);

      // Store the access token
      localStorage.setItem("accessToken", accessToken);

      setAuth({
        email: loginData.email,
        fullName: decodedToken.UserInfo.fullName,
        password: loginData.password,
        role: decodedToken.UserInfo.role,
        accessToken
      });
      setLoginData({
        email: "",
        password: "",
        rememberMe: false
      });
      console.log(response.data);
      navigate(from, { replace: true });
    } catch (err) {
      switch (err.response?.status) {
        case undefined:
          setLoginMessage({ message: err.response.data.message, error: true });
          break;
        case 400:
        case 401:
        case 404:
          setLoginMessage({ message: err.response.data.message, error: true });
          break;
        case 500:
          setLoginMessage({ message: "Server Error", error: true });
          break;
        default:
          setLoginMessage({ message: "Login Failed", error: true });
      }
    }
  };

  // Handle user signup

  const handleUserSignup = async (e) => {
    e.preventDefault();
    if (!isValidData(userData, setSignupMessage, step)) return;

    try {
      const formData = new FormData();
      formData.append("userData", JSON.stringify(userData));
      if (step === 2) {
        formData.append("idImage", userData.idImage);
        formData.append("licenseImage", userData.licenseImage);
      }
      if (step === 3) {
        formData.append("idImage", userData.idImage);
        formData.append("licenseImage", userData.licenseImage);
        formData.append("profileImage", userData.profileImage);
      }

      const response = await axios.post(REGISTER_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      });

      console.log(response.data);
      setSignupMessage({ message: response.data.message, error: false });
      setTimeout(() => {
        navigate("/login");
        setLoginMessage({ message: "Please Login", error: false });
      }, 2000);
      // Empty the fields after successful signup
      setUserData({
        firstName: "",
        lastName: "",
        email: "",
        dateOfBirth: "",
        password: "",
        confirmPassword: "",
        role: "",
        profileImage: "",
        idType: "",
        idNumber: "",
        idImage: null,
        licenseNumber: "",
        licenseImage: null,
        speciality: ""
      });
    } catch (err) {
      switch (err.response?.status) {
        case undefined:
          setSignupMessage({
            message: err.response.data.message,
            error: true
          });
          break;
        case 409:
          setSignupMessage({
            message: err.response.data.message,
            error: true
          });
          setStep(1);
          break;
        case 500:
          setSignupMessage({ message: "Server Error", error: true });
          break;
        case 400:
          setSignupMessage({
            message: err.response.data.message,
            error: true
          });
          break;
        default:
          setSignupMessage({ message: "Registration Failed", error: true });
      }
    }
  };

  // Display Signup Steps
  const stepDisplay = () => {
    switch (step) {
      case 1:
        return (
          <SignupMain
            changeStep={changeStep}
            userData={userData}
            setUserData={setUserData}
            handleUserSignup={handleUserSignup}
          />
        );
      case 2:
        return (
          <SignupData
            userData={userData}
            setUserData={setUserData}
            changeStep={changeStep}
            handleUserSignup={handleUserSignup}
          />
        );
      case 3:
        return (
          <SignupFinish
            userData={userData}
            setUserData={setUserData}
            changeStep={changeStep}
            handleUserSignup={handleUserSignup}
          />
        );
      default:
        return (
          <SignupMain
            changeStep={changeStep}
            userData={userData}
            setUserData={setUserData}
            handleUserSignup={handleUserSignup}
          />
        );
    }
  };

  // Change Signup Steps
  const changeStep = (e) => {
    e.preventDefault();

    setSignupMessage({ message: "", error: false });

    if (e.target.name === "back") {
      step > 1
        ? step === 3
          ? setStep(1)
          : setStep((prev) => prev - 1)
        : setStep(1);
      setUserData({ ...userData, password: "", confirmPassword: "" });
      return setSignupMessage({ message: "", error: false });
    }
    switch (step) {
      case 1:
        if (!isValidData(userData, setSignupMessage, step)) return;
        setStep(2);
        break;
      case 2:
        if (!isValidData(userData, setSignupMessage, step)) return;
        setStep(3);
        break;
      default:
        setStep(1);
        break;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        stepDisplay,
        step,
        changeStep,
        signupMessage,
        userData,
        setUserData,
        loginData,
        setLoginData,
        setSignupMessage,
        handleUserSignup,
        handleUserLogin,
        loginMessage,
        setLoginMessage,
        userInfo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

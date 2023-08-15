import { createContext, useState, useEffect } from "react";
import axios from "../api/axios";

import {
  isValidData,
  isValidPassword,
  isValidEmail,
} from "../utils/Validation";

import SignupMain from "../components/Signup/SignupMain";
import SignupData from "../components/Signup/SignupData";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [step, setStep] = useState(1);

  // Intialize the user data
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    idType: "",
    idNumber: "",
    idImage: null,
    licenseNumber: "",
    licenseImage: null,
    speciality: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const LOGIN_URL = "/login";
  const REGISTER_URL = "/register";

  // Signup Error State
  const [signupMessage, setSignupMessage] = useState({
    message: "",
    error: false,
  });

  // Login Error State

  const [loginMessage, setLoginMessage] = useState({
    message: "",
    error: false,
  });

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
        error: true,
      });

    if (password.length === 0)
      return setLoginMessage({
        message: "Please enter your password",
        error: true,
      });

    if (!emailRegex.test(email))
      return setSignupMessage({
        message: "Please enter a valid email",
        error: true,
      });

    try {
      const response = await axios.post(LOGIN_URL, loginData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      console.log(response.data.message);
      setLoginMessage({ message: response.data.message, error: false });
      console.log(response.data.accessToken);

      // Empty the fields after successful login
      setLoginData({
        email: "",
        password: "",
        rememberMe: false,
      });
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

    if (step === 1) {
      console.log("Submitting Patient");

      try {
        const formData = new FormData();
        formData.append("userData", JSON.stringify(userData));

        const response = await axios.post(REGISTER_URL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });

        console.log(response.data);

        setSignupMessage({ message: response.data.message, error: false });

        // Empty the fields after successful signup
        setUserData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "",
          idType: "",
          idNumber: "",
          idImage: null,
          licenseNumber: "",
          licenseImage: null,
          speciality: "",
        });
      } catch (err) {
        switch (err.response?.status) {
          case undefined:
            setSignupMessage({
              message: err.response.data.message,
              error: true,
            });
            break;
          case 409:
            setSignupMessage({
              message: err.response.data.message,
              error: true,
            });
            setStep(1);
            break;
          case 500:
            setSignupMessage({ message: "Server Error", error: true });
            break;
          case 400:
            setSignupMessage({
              message: err.response.data.message,
              error: true,
            });
            break;
          default:
            setSignupMessage({ message: "Registration Failed", error: true });
        }
      }
    } else if (step === 2) {
      // In case it's a doctor signing up
      if (!isValidData(userData, setSignupMessage, step)) return;

      try {
        console.log("Submitting Doctor");

        const formData = new FormData();
        formData.append("userData", JSON.stringify(userData));
        formData.append("idImage", userData.idImage);
        formData.append("licenseImage", userData.licenseImage);

        const response = await axios.post(REGISTER_URL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });

        console.log(response.data);
        setSignupMessage({ message: response.data.message, error: false });

        // Empty the fields after successful signup
        setUserData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "",
          idType: "",
          idNumber: "",
          idImage: null,
          licenseNumber: "",
          licenseImage: null,
          speciality: "",
        });
      } catch (err) {
        switch (err.response?.status) {
          case undefined:
            setSignupMessage({
              message: err.response.data.message,
              error: true,
            });
            break;
          case 409:
            setSignupMessage({
              message: err.response.data.message,
              error: true,
            });
            setStep(1);
            break;
          case 500:
            setSignupMessage({ message: "Server Error", error: true });
            break;
          case 400:
            setSignupMessage({
              message: err.response.data.message,
              error: true,
            });
            break;
          default:
            setSignupMessage({ message: "Registration Failed", error: true });
        }
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
      default:
        return <SignupMain />;
    }
  };

  // Change Signup Steps
  const changeStep = (e) => {
    e.preventDefault();

    setSignupMessage({ message: "", error: false });

    if (e.target.name === "userSubmit") {
    }
    
    if (e.target.name === "back") {
      step > 1 ? setStep((prev) => prev - 1) : setStep(1);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

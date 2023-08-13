import React from "react";
import { Link } from "react-router-dom";
import Input from "../Input";
import { useRef, useEffect } from "react";
const SignupMain = ({
  changeStep,
  userData,
  setUserData,
  handleUserSignup
}) => {
  const currentRef = useRef();

  return (
    <>
      <form
        onSubmit={handleUserSignup}
        className="w-full h-full flex flex-col justify-start items-center">
        <Input
          currentRef={currentRef}
          id="firstName"
          type="text"
          placeholder="First Name"
          autoComplete={false}
          required={true}
          value={userData.firstName}
          onChange={(e) =>
            setUserData({ ...userData, firstName: e.target.value })
          }
        />
        <Input
          id="lastName"
          type="text"
          placeholder="Last Name"
          autoComplete={false}
          required={true}
          value={userData.lastName}
          onChange={(e) =>
            setUserData({ ...userData, lastName: e.target.value })
          }
        />
        <Input
          id="email"
          type="text"
          placeholder="Email"
          autoComplete={false}
          required={true}
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        />
        <Input
          id="password"
          type="password"
          placeholder="Password"
          autoComplete={false}
          required={true}
          value={userData.password}
          onChange={(e) =>
            setUserData({ ...userData, password: e.target.value })
          }
        />
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          autoComplete={false}
          required={true}
          value={userData.confirmPassword}
          onChange={(e) =>
            setUserData({ ...userData, confirmPassword: e.target.value })
          }
        />
        <select
          className="border border-grey-300 max-w-[280px] w-5/6 h-8 rounded-full shadow-md my-3 flex justify-around items-center px-3 outline-none"
          name="role"
          id="role"
          value={userData.role}
          onChange={(e) => setUserData({ ...userData, role: e.target.value })}>
          <option value="default">Select your role</option>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>
        <button
          name={userData.role === "patient" ? "userSubmit" : "next"}
          type={userData.role === "patient" ? "submit" : "button"}
          className="bg-blue-400 max-w-[280px] w-5/6 h-8 text-white font-bold text-[16px] px-4 rounded-md my-3"
          {...(userData.role === "patient"
            ? {}
            : { onClick: (e) => changeStep(e) })}>
          {userData.role === "patient" ? "Sign Up" : "Next"}
        </button>
        <p className="w-5/6 mb-3 text-center text-[#1E1E1E] text-sm ">
          Already have an account?{" "}
          <Link className="text-blue-400 underline" to="/login">
            Login
          </Link>
          !
        </p>
      </form>
    </>
  );
};

export default SignupMain;

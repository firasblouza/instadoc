import { logo } from "../assets";
import { FaUser, FaLock } from "react-icons/fa6";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useContext, useEffect, useRef } from "react";
import Input from "./Input";

const Login = () => {
  const { loginMessage, loginData, setLoginData, handleUserLogin } =
    useContext(AuthContext);
  const currentRef = useRef();
  return (
    <section
      id="login"
      className="w-screen h-screen bg-gradient-to-r from-cyan-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% opacity-60 flex justify-center items-center">
      <div className="login-container w-full h-full sm:w-1/5 sm:min-w-[300px] sm:h-auto bg-white rounded-lg shadow-lg flex flex-col">
        <div className="logo-section w-full h-auto max-h-[120px] flex items-center justify-center">
          <img
            className="max-w-[180px] sm:max-w-[140px]"
            src={logo}
            alt="InstaDoc"
          />
        </div>
        <div className="login-section bg-transparent w-full h-auto flex flex-col p-2 items-center justify-center">
          <h1 className="text-[#1E1E1E] text-xl md:text-1xl font-bold my-3">
            Login
          </h1>
          <h1
            className={`${
              loginMessage.error ? "text-red-500" : "text-green-500"
            } text-sm md:text-1xl font-bold `}>
            {loginMessage.message}
          </h1>
          <form
            onSubmit={handleUserLogin}
            className="w-full h-full flex flex-col justify-center items-center">
            <Input
              icon={<FaUser className="mx-3" />}
              type="email"
              id="loginEmail"
              currentRef={currentRef}
              autoComplete={false}
              required={true}
              placeholder="Email"
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
            />
            <Input
              icon={<FaLock className="mx-3" />}
              type="password"
              id="loginPassword"
              autoComplete={false}
              required={true}
              placeholder="Password"
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />
            <div className="form-group flex flex-row gap-3 justify-start max-w-[280px] w-5/6 pl-3">
              <input
                type="checkbox"
                name="remember"
                id="remember"
                checked={loginData.rememberMe}
                onChange={(e) =>
                  setLoginData({ ...loginData, rememberMe: e.target.checked })
                }
              />
              <label htmlFor="remember">Remember me</label>
            </div>
            <button className="bg-blue-400 max-w-[280px] w-5/6 h-8 text-white font-bold text-[16px] px-4 rounded-md my-3">
              Login
            </button>
            <p className="w-5/6 mb-3 text-center text-[#1E1E1E] text-sm">
              Don't have an account?{" "}
              <Link className="text-blue-400 underline" to="/signup">
                Signup
              </Link>
              !
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;

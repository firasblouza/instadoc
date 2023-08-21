import { logo } from "../../assets";

import { useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext";

const Signup = () => {
  const { stepDisplay, signupMessage, setSignupMessage } =
    useContext(AuthContext);

  // Empty the message on component mount
  useEffect(() => {
    setSignupMessage({ message: "", error: false });
  }, []);

  return (
    <section
      id="signup"
      className="w-screen h-screen bg-gradient-to-r from-cyan-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% opacity-60 flex justify-center items-center"
    >
      <div
        className="signup-container w-full h-full sm:min-w-[400px] sm:max-w-[400px] sm:h-auto sm:w-1/4
       bg-white rounded-lg shadow-lg flex flex-col pb-5"
      >
        <div className="logo-section w-full h-auto  flex flex-col items-center justify-center ">
          <img
            className="max-w-[180px] py-4 sm:max-w-[140px] max-h-[120px]"
            src={logo}
            alt="InstaDoc"
          />
        </div>

        <div
          className={`w-full h-auto flex flex-col items-center justify-center sm:flex-row `}
        >
          <div className="flex flex-col items-center">
            <h1 className="text-[#1E1E1E] text-xl md:text-1xl font-bold my-3">
              Signup
            </h1>
            <h1
              className={`${
                signupMessage.error ? "text-red-500" : "text-green-500"
              } text-sm md:text-1xl font-bold `}
            >
              {signupMessage.message}
            </h1>
          </div>
        </div>

        <div className="signup-wrapper w-full h-full flex flex-col sm:flex-row">
          {stepDisplay()}
        </div>
      </div>
    </section>
  );
};

export default Signup;

import Input from "../Input";
import { doctorSpecialties } from "../../data/data";
import { FaUpload } from "react-icons/fa";
import { useState, useRef } from "react";
const SignupFinish = ({
  userData,
  setUserData,
  changeStep,
  handleUserSignup
}) => {
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = (e) => {
    if (e.target.name === "profileImage") {
      setUploadedFile(e.target.files[0]);
      setUserData({ ...userData, profileImage: e.target.files[0] });
    } else if (e.target.name === "cvImage") {
      setUploadedFile(e.target.files[0]);
      setUserData({ ...userData, cvImage: e.target.files[0] });
    }
  };
  return (
    <form
      onSubmit={handleUserSignup}
      encType="multipart/form-data"
      className="w-full h-full flex flex-col justify-start items-center"
    >
      <h2 className="text-l font-bold text-gray-800 my-3">
        Select a profile image
      </h2>
      <div className="profileUpload w-full md:w-5/6 h-auto bg-transparent rounded-full my-3 flex justify-around items-center px-3 flex-col md:flex-row md:max-w-[280px]">
        <button
          type="button"
          className="relative overflow-hidden bg-blue-400 hover:bg-blue-300 md:max-w-[120px] w-full h-8 text-white font-bold text-[16px] px-1 rounded-md my-3 flex justify-center items-center cursor-pointer"
        >
          <FaUpload className="mr-2" />
          Upload
          <input
            type="file"
            accept="image/*"
            name="profileImage"
            className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer transform scale-[3]"
            placeholder="Profile Image"
            onChange={(e) => handleFileUpload(e)}
          />
        </button>

        <p className="text-[12px] text-gray-400">
          {userData.profileImage
            ? userData.profileImage.name
            : "No file chosen"}
        </p>
      </div>
      <h2 className="text-l font-bold text-gray-800 my-3">
        Select a resumé image
      </h2>
      <div className="cvUpload w-full md:w-5/6 h-auto bg-transparent rounded-full my-3 flex justify-around items-center px-3 flex-col md:flex-row md:max-w-[280px]">
        <button
          type="button"
          className="relative overflow-hidden bg-blue-400 hover:bg-blue-300 md:max-w-[120px] w-full h-8 text-white font-bold text-[16px] px-1 rounded-md my-3 flex justify-center items-center cursor-pointer"
        >
          <FaUpload className="mr-2" />
          Upload
          <input
            type="file"
            accept="image/*"
            name="cvImage"
            className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer transform scale-[3]"
            placeholder="CV Image"
            onChange={(e) => handleFileUpload(e)}
          />
        </button>

        <p className="text-[12px] text-gray-400">
          {userData.cvImage ? userData.cvImage.name : "No file chosen"}
        </p>
      </div>
      <div className="flex flex-col w-full px-4 md:w-5/6 h-8  sm:justify-center items-center sm:flex-row gap-2 my-3">
        <button
          name="back"
          type="button"
          className="bg-blue-400 hover:bg-blue-300 md:max-w-[140px] w-full h-8 text-white font-bold text-[16px] px-4 rounded-md"
          onClick={(e) => changeStep(e)}
        >
          Back
        </button>
        <button
          name="doctorSignup"
          type="submit"
          className="bg-blue-400 hover:bg-blue-300 md:max-w-[140px] w-full h-8 text-white font-bold text-[16px] px-4 rounded-md"
        >
          Signup
        </button>
      </div>
    </form>
  );
};

export default SignupFinish;

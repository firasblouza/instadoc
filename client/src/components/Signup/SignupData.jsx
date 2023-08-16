import Input from "../Input";
import doctorSpecialties from "../../data/doctorSpecialities";
import { FaUpload } from "react-icons/fa";
import { useState, useRef } from "react";

const SignupData = ({
  userData,
  setUserData,
  changeStep,
  handleUserSignup,
}) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const currentRef = useRef();

  const handleFileUpload = (e) => {
    if (e.target.name === "idImage") {
      setUploadedFile(e.target.files[0]);
      setUserData({ ...userData, idImage: e.target.files[0] });
    } else if (e.target.name === "licenseImage") {
      setUploadedFile(e.target.files[0]);
      setUserData({ ...userData, licenseImage: e.target.files[0] });
    }
  };

  return (
    <>
      <form
        onSubmit={handleUserSignup}
        encType="multipart/form-data"
        className="w-full h-full flex flex-col justify-start items-center"
      >
        {/* Check if the selected role is a doctor */}
        {userData.role === "doctor" ? (
          <>
            {/* ID Type Select */}
            <select
              className="border border-grey-300 max-w-[280px] w-5/6 h-8 rounded-full shadow-md my-3 px-3"
              value={userData.idType}
              onChange={(e) =>
                setUserData({ ...userData, idType: e.target.value })
              }
            >
              <option value="">ID Type</option>
              <option value="idcard">National ID</option>
              <option value="passport">Passport</option>
            </select>
            {/* ID Number Input */}
            <Input
              type="text"
              currentRef={currentRef}
              value={userData.idNumber}
              placeholder={
                userData.type === "idcard"
                  ? "National ID Number"
                  : userData.type === "passport"
                  ? "Passport Number"
                  : "Document Number"
              }
              onChange={(e) =>
                setUserData({ ...userData, idNumber: e.target.value })
              }
            />

            {/* ID Image Upload */}

            <div className="idUpload w-5/6 h-8 bg-transparent rounded-full my-3 flex justify-around items-center px-3 flex-row max-w-[280px]">
              <button
                type="button"
                className="relative overflow-hidden bg-blue-400 hover:bg-blue-300 max-w-[120px] w-full h-8 text-white font-bold text-[16px] px-1 rounded-md my-3 flex justify-center items-center cursor-pointer"
              >
                <FaUpload className="mr-2" />
                Upload
                <input
                  type="file"
                  accept="image/*"
                  name="idImage"
                  className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer transform scale-[3]"
                  placeholder="ID Number Image"
                  onChange={(e) => handleFileUpload(e)}
                />
              </button>

              <p className="text-[12px] text-gray-400">
                {userData.idImage ? userData.idImage.name : "No file chosen"}
              </p>
            </div>

            {/* License Number Input */}

            <Input
              type="text"
              value={userData.licenseNumber}
              placeholder="Medical License Number"
              onChange={(e) =>
                setUserData({ ...userData, licenseNumber: e.target.value })
              }
            />

            {/* License Image Upload */}

            <div className="licenseUplaod bg-transparent w-5/6 h-8 rounded-full my-3 flex justify-around items-center px-3 flex-row max-w-[280px]">
              <button
                type="button"
                className="relative overflow-hidden bg-blue-400 hover:bg-blue-300 max-w-[120px] w-full h-8 text-white font-bold text-[16px] px-1 rounded-md my-3 flex justify-center items-center cursor-pointer"
              >
                <FaUpload className="mr-2" />
                Upload
                <input
                  type="file"
                  accept="image/*"
                  name="licenseImage"
                  className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer transform scale-[3]"
                  placeholder="Medical License Image"
                  onChange={(e) => handleFileUpload(e)}
                />
              </button>

              <p className="text-[12px] text-gray-400">
                {userData.licenseImage
                  ? userData.licenseImage.name
                  : "No file chosen"}
              </p>
            </div>

            {/* Speciality Select */}

            <select
              className="border border-grey-300 max-w-[280px] w-5/6 h-8 rounded-full shadow-md my-3 flex justify-around items-center px-3 outline-none"
              name="role"
              id="role"
              value={userData.speciality}
              onChange={(e) =>
                setUserData({ ...userData, speciality: e.target.value })
              }
            >
              <option value="">Select your speciality</option>
              {doctorSpecialties.map((speciality, index) => (
                <option key={index} value={speciality.value}>
                  {speciality.name}
                </option>
              ))}
            </select>
          </>
        ) : null}

        {/* Buttons */}
        <div className="flex flex-col w-5/6 h-8  sm:justify-center items-center sm:flex-row gap-2 my-3">
          <button
            name="back"
            type="button"
            className="bg-blue-400 hover:bg-blue-300 max-w-[140px] w-full h-8 text-white font-bold text-[16px] px-4 rounded-md"
            onClick={(e) => changeStep(e)}
          >
            Back
          </button>
          <button
            name="doctorSignup"
            type="submit"
            className="bg-blue-400 hover:bg-blue-300 max-w-[140px] w-full h-8 text-white font-bold text-[16px] px-4 rounded-md"
          >
            Sign Up
          </button>
        </div>
      </form>
    </>
  );
};

export default SignupData;

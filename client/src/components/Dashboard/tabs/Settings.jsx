import { useEffect, useState, useRef } from "react";
import { FaSave, FaEdit, FaTrashAlt } from "react-icons/fa";

import Input from "../../../components/Input";
import { useNavigate } from "react-router-dom";

import { isValidPassword } from "../../../utils/Validation";
import jwt_decode from "jwt-decode";
import axios from "../../../api/axios";
import useLogout from "../../../hooks/useLogout";
import useAccessToken from "../../../hooks/useAccessToken";

const Settings = () => {
  const [pwData, setPwData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const effectRan = useRef(null);
  const navigate = useNavigate();

  const [statusMessage, setStatusMessage] = useState({
    message: "",
    error: false
  });

  const [isModifying, setIsModifying] = useState(false);

  // Validate inputs while user is typing

  useEffect(() => {
    // Only run the effect when the user is modifying and newPassword is not empty
    if (!pwData.newPassword && !pwData.confirmPassword && !pwData.oldPassword) {
      return setStatusMessage({
        message: "",
        error: false
      });
    }
    if (isModifying && pwData.newPassword !== "") {
      if (!effectRan.current) {
        effectRan.current = true;
      } else {
        isValidPassword({
          from: "settings",
          password: pwData.newPassword,
          confirmPassword: pwData.confirmPassword,
          setMessage: setStatusMessage
        });
      }
    }
  }, [isModifying, pwData.newPassword, pwData.confirmPassword]);

  // Handle input changes

  const handleFieldChange = (e) => {
    if (e.target.id === "oldPassword") {
      setPwData({ ...pwData, oldPassword: e.target.value });
    } else if (e.target.id === "newPassword") {
      setPwData({ ...pwData, newPassword: e.target.value });
    } else if (e.target.id === "confirmPassword") {
      setPwData({ ...pwData, confirmPassword: e.target.value });
    }
  };

  // Submit Changes

  const saveChanges = async () => {
    try {
      const { accessToken, decodedToken } = useAccessToken();
      if (accessToken && accessToken !== "" && decodedToken) {
        const path =
          decodedToken.UserInfo.role === "user" ? "users" : "doctors";
        const response = await axios.put(
          `/${path}/password/${decodedToken.UserInfo.id}`,
          pwData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            },
            withCredentials: true
          }
        );
        if (response.status === 200) {
          setIsModifying(false);
          setStatusMessage({
            message: "Password changed successfully",
            error: false
          });
          setPwData({
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
          });
        }
      } else {
        setStatusMessage({
          message: "You are not authorized to perform this action",
          error: true
        });
      }
    } catch (err) {
      if (err?.response && err.response.status === 400) {
        setStatusMessage({
          message: err.response.data.message,
          error: true
        });
      } else {
        setStatusMessage({
          message: err.response.data.message,
          error: true
        });
      }
    }
  };

  const deleteAccount = async () => {
    try {
      if (window.confirm("Vous etes sur de supprimer votre compte?")) {
        const { accessToken, decodedToken } = useAccessToken();
        if (accessToken && accessToken !== "" && decodedToken) {
          const path =
            decodedToken.UserInfo.role === "user" ? "users" : "doctors";
          const response = await axios.delete(
            `/${path}/${decodedToken.UserInfo.id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`
              },
              withCredentials: true
            }
          );
          if (response.status === 200) {
            // Show alert of success and use window location to go homepage
            window.alert("Votre compte a été supprimé avec succès");
            navigate("/logout");
          }
        } else {
          setStatusMessage({
            message: "You are not authorized to perform this action",
            error: true
          });
        }
      }
    } catch (err) {
      if (err?.response && err.response.status === 400) {
        setStatusMessage({
          message: err.response.data.message,
          error: true
        });
      } else {
        setStatusMessage({
          message: err.response.data.message,
          error: true
        });
      }
    }
  };
  return (
    <section className="dashboard-settings w-full h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] overflow-scroll overflow-y-scroll">
      <div className="flex flex-col items-center w-full h-full my-3">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>

        {/* Settings Box */}
        <div className="SettingsContainer flex flex-col w-full h-full md:w-2/3 md:h-2/3 border  rounded-lg shadow-lg my-3 items-center">
          <h1 className="text-2xl font-bold text-gray-800 m-4 text-center">
            Change Password
          </h1>
          <div className="contentContainer flex flex-col items-center border w-full h-full">
            {/* Message Box */}

            <h1
              className={`text-base font-bold py-3 ${
                !statusMessage.error ? "text-green-500" : "text-red-500"
              }`}
            >
              {statusMessage.message}
            </h1>

            {/* Current Password */}

            <div className="formGroup  justify-center flex flex-col items-center w-full md:w-4/6  md:flex-row gap-2 my-3">
              <label htmlFor="oldPassword" className="text-gray-800 font-bold">
                Current Password :
              </label>
              <Input
                type="password"
                name="oldPassword"
                id="oldPassword"
                disabled={!isModifying}
                required={true}
                placeholder="Enter your current password"
                value={pwData.oldPassword}
                onChange={(e) => handleFieldChange(e)}
              />
            </div>
            {/* New Password */}

            <div className="formGroup  justify-center flex flex-col items-center md:w-4/6 w-full  md:flex-row gap-2 my-3">
              <label htmlFor="oldPassword" className="text-gray-800 font-bold">
                New Password :
              </label>

              <Input
                type="password"
                name="newPassword"
                id="newPassword"
                disabled={!isModifying}
                required={true}
                placeholder="Enter your new password"
                value={pwData.newPassword}
                onChange={(e) => handleFieldChange(e)}
              />
            </div>

            {/* Confirm Password */}

            <div className="formGroup  justify-center flex flex-col items-center md:w-4/6 w-full  md:flex-row gap-2 my-3">
              <label htmlFor="oldPassword" className="text-gray-800 font-bold">
                Confirm Password :
              </label>

              <Input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                disabled={!isModifying}
                required={true}
                placeholder="Confirm your new password"
                value={pwData.confirmPassword}
                onChange={(e) => handleFieldChange(e)}
              />
            </div>

            {/* Submit Button */}

            <div className="flex flex-col w-full md:flex-row gap-3 justify-center">
              <button
                type="button"
                className={`relative overflow-hidden ${
                  !isModifying
                    ? "bg-blue-400 hover:bg-blue-300"
                    : "bg-red-400 hover:bg-red-300"
                } md:max-w-[120px] w-full h-8 text-white font-bold text-[16px] px-1 rounded-md md:my-3 flex justify-center items-center cursor-pointer`}
                onClick={() => setIsModifying(!isModifying)}
              >
                <FaEdit className="mr-2" />
                {isModifying ? "Cancel" : "Edit"}
              </button>

              <button
                type="submit"
                className={`relative overflow-hidden ${
                  !isModifying
                    ? "bg-gray-400"
                    : "bg-green-400 hover:bg-green-300 cursor-pointer"
                } md:max-w-[120px] w-full h-8 text-white font-bold text-[16px] px-1 rounded-md md:my-3 flex justify-center items-center `}
                disabled={!isModifying}
                onClick={saveChanges}
              >
                <FaSave className="mr-2" />
                Save
              </button>
              <button
                type="submit"
                className={`relative overflow-hidden bg-red-500
                    h-8 text-white font-bold text-[16px] px-2 rounded-md md:my-3 flex justify-center items-center `}
                onClick={deleteAccount}
              >
                <FaTrashAlt className="mr-2" />
                Supprimer Compte
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Settings;

import { useState, useEffect, useRef } from "react";
import { FaUpload, FaEdit, FaSave } from "react-icons/fa";
import axios from "../../../api/axios";
import jwt_decode from "jwt-decode";

const Profile = () => {
  const effectRan = useRef(false);

  const [isModifying, setIsModifying] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const [statistics, setStatistics] = useState({
    consultations: 0
  });

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    profileImage: null
  });

  const IMG_URL = "http://localhost:3500/uploads/";
  const imgPlaceholder = `${IMG_URL}imagePlaceholder.png`;

  const saveChanges = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const decoded = jwt_decode(accessToken);
      if (accessToken) {
        const formData = new FormData();
        formData.append("user", JSON.stringify(user));
        if (uploadedFile) {
          formData.append("profileImage", uploadedFile);
        }

        const response = await axios.put(
          `/users/${decoded.UserInfo.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "multipart/form-data"
            }
          }
        );
        if (response.status === 200) {
          setIsModifying(false);
          window.alert("Profile updated successfully");
        }
      } else {
        console.log("No access token found");
      }
    } catch {
      console.log("An error occurred while updating the user");
    }
  };

  const handleFileUpload = (e) => {
    if (e.target.name === "profileImage") {
      setUploadedFile(e.target.files[0]);
      setUser({ ...user, profileImage: e.target.files[0] });
    }
  };

  useEffect(() => {
    if (effectRan.current === false) {
      const fetchUser = async () => {
        try {
          const accessToken = localStorage.getItem("accessToken");
          if (accessToken) {
            const decoded = jwt_decode(accessToken);
            const response = await axios.get(`/users/${decoded.UserInfo.id}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            });
            setUser(response.data);
            console.log(response.data);
          } else {
            console.log("No id found");
          }
        } catch (err) {
          if (err && err.response && err.response.status === 401) {
            console.log(
              "Unauthorized: You need to log in or refresh your token"
            );
          } else {
            console.log("An error occurred while fetching data:", err.message);
          }
        }
      };
      fetchUser();
    }

    return () => {
      effectRan.current = true;
    };
  }, []);

  return (
    <section className="profile w-full h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] ">
      {/* Create a page to view the user data and the ability to modify them */}

      <div className="flex flex-col  w-full">
        <h1 className="text-3xl font-bold text-[#1E1E1E] my-2 text-center">
          Profile
        </h1>
      </div>

      <div className="flex flex-col justify-center">
        <div className="flex flex-col w-full justify-center items-center ">
          <div className="flex flex-col">
            <h1 className="text-1xl font-bold text-[#1E1E1E]  my-3">
              Personal Information
            </h1>
          </div>
          <div className="mainContainer flex flex-col  border rounded-lg shadow-lg px-3">
            <div className="flowControlContainer flex flex-col md:flex-row w-auto  gap-4">
              <div className="imageContainer  flex flex-col justify-start rounded-lg w-full">
                <img
                  src={
                    user.profileImage
                      ? uploadedFile
                        ? URL.createObjectURL(uploadedFile)
                        : `${IMG_URL}${user.profileImage}`
                      : imgPlaceholder
                  }
                  alt=""
                  className=" rounded-lg w-[300px] h-[250px]"
                />
                {/* Avatar Upload Button */}

                <div className="avatarUpload bg-transparent  h-8 rounded-full my-3 flex justify-around items-center  px-1 flex-row max-w-[280px]">
                  <button
                    type="button"
                    className={`relative overflow-hidden ${
                      !isModifying
                        ? "bg-gray-400"
                        : "bg-blue-400 hover:bg-blue-300 cursor-pointer"
                    } max-w-[120px] w-full h-8 text-white font-bold text-[16px] px-1 rounded-md my-3 flex justify-center items-center `}
                  >
                    <FaUpload className="mr-2" />
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      name="profileImage"
                      disabled={!isModifying}
                      className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer transform scale-[3]"
                      placeholder="Profile Image"
                      onChange={(e) => handleFileUpload(e)}
                    />
                  </button>

                  <p className="text-[12px] text-gray-400">
                    {uploadedFile ? uploadedFile.name : "No file chosen"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col w-full">
                <div className="formGroup">
                  <label
                    htmlFor="firstName"
                    className="text-[#1E1E1E] text-sm font-bold mb-2 px-2"
                  >
                    Prénom :{" "}
                  </label>

                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={user.firstName}
                    disabled={!isModifying}
                    onChange={(e) =>
                      setUser({ ...user, firstName: e.target.value })
                    }
                    className="border border-grey-300 max-w-[280px] w-5/6 h-8 rounded-full shadow-md my-2 flex justify-around items-center overflow-hidden py-2 px-5"
                  />
                </div>

                <div className="formGroup">
                  <label
                    htmlFor="lastName"
                    className="text-[#1E1E1E] text-sm font-bold mb-2 px-2"
                  >
                    Nom :{" "}
                  </label>

                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={user.lastName}
                    disabled={!isModifying}
                    onChange={(e) =>
                      setUser({ ...user, lastName: e.target.value })
                    }
                    className="border border-grey-300 max-w-[280px] w-5/6 h-8 rounded-full shadow-md my-2 flex justify-around items-center overflow-hidden py-2 px-5"
                  />
                </div>
                <div className="formGroup">
                  <label
                    htmlFor="email"
                    className="text-[#1E1E1E] text-sm font-bold mb-2 px-2"
                  >
                    Email :{" "}
                  </label>

                  <input
                    type="text"
                    name="email"
                    id="email"
                    value={user.email}
                    disabled={!isModifying}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                    className="border border-grey-300 max-w-[280px] w-5/6 h-8 rounded-full shadow-md my-2 flex justify-around items-center overflow-hidden py-2 px-5"
                  />
                </div>

                <div className="formGroup">
                  <label
                    htmlFor="email"
                    className="text-[#1E1E1E] text-sm font-bold mb-2 px-2"
                  >
                    Phone Number :{" "}
                  </label>

                  <input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={user.phoneNumber}
                    disabled={!isModifying}
                    onChange={(e) =>
                      setUser({ ...user, phoneNumber: e.target.value })
                    }
                    className="border border-grey-300 max-w-[280px] w-5/6 h-8 rounded-full shadow-md my-2 flex justify-around items-center overflow-hidden py-2 px-5"
                  />
                </div>

                <div className="formGroup">
                  <label
                    htmlFor="dateOfBirth"
                    className="text-[#1E1E1E] text-sm font-bold mb-2 px-2"
                  >
                    Date du Naissance :{" "}
                  </label>

                  <input
                    type="date"
                    name="dateOfBirth"
                    id="dateOfBirth"
                    value={user.dateOfBirth.substring(0, 10)}
                    disabled={!isModifying}
                    className="border border-grey-300 max-w-[280px] w-5/6 h-8 rounded-full shadow-md my-2 flex justify-around items-center overflow-hidden py-2 px-5"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-3 justify-center">
              <button
                type="button"
                className={`relative overflow-hidden ${
                  !isModifying
                    ? "bg-blue-400 hover:bg-blue-300"
                    : "bg-red-400 hover:bg-red-300"
                } max-w-[120px] w-full h-8 text-white font-bold text-[16px] px-1 rounded-md my-3 flex justify-center items-center cursor-pointer`}
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
                } max-w-[120px] w-full h-8 text-white font-bold text-[16px] px-1 rounded-md my-3 flex justify-center items-center `}
                disabled={!isModifying}
                onClick={saveChanges}
              >
                <FaSave className="mr-2" />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
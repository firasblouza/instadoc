import { useState, useEffect, useRef } from "react";

import axios from "../../../../api/axios";
import jwt_decode from "jwt-decode";

import { FaEdit, FaUpload } from "react-icons/fa";

import { capitalize } from "../../../../utils/Capitalize";
import { startTime, endTime } from "../../../../data/data";

import Modal from "../../UI/Modal";

import useAccessToken from "../../../../hooks/useAccessToken";

const DoctorHome = () => {
  const effectRan = useRef(false);

  const [showModal, setShowModal] = useState(false);
  const [newAvailability, setNewAvailability] = useState([]);
  const [initialAvailability, setInitialAvailability] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);

  const IMG_URL = "https://instadoc-server.vercel.app/uploads/";

  const [doctor, setDoctor] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    profileImage: null,
    phoneNumber: "",
    availability: [],
    pendingApproval: false
  });

  // Fetch doctor data
  const fetchDoctor = async () => {
    try {
      const { accessToken, decodedToken } = useAccessToken();
      if (accessToken && accessToken !== "" && decodedToken) {
        const response = await axios.get(
          `/doctors/${decodedToken.UserInfo.id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        setDoctor(response.data);
        setDoctor({
          ...response.data,
          dateOfBirth: response.data.dateOfBirth.substring(0, 10),
          speciality: capitalize(response.data.speciality)
        });
        setInitialAvailability(
          JSON.parse(JSON.stringify(response.data.availability))
        );
        setNewAvailability(
          JSON.parse(JSON.stringify(response.data.availability))
        );
      } else {
        console.log("No id found");
      }
    } catch (err) {
      if (err && err.response && err.response.status === 401) {
        console.log("Unauthorized: You need to log in or refresh your token");
      } else {
        console.log("An error occurred while fetching data:", err.message);
      }
    }
  };

  // Save Availability Changes

  const saveAvailability = async () => {
    try {
      const { accessToken, decodedToken } = useAccessToken();
      if (accessToken && accessToken !== "" && decodedToken) {
        const response = await axios.put(
          `/doctors/${decodedToken.UserInfo.id}`,
          { availability: newAvailability }
        );
        if (response.status === 200) {
          setShowModal(false);
          fetchDoctor();
          window.alert("Profile availability updated.");
        }
      } else {
        console.log("No id found");
      }
    } catch (err) {
      if (err?.response?.data?.message) {
        window.alert(err.response.data.message);
      } else {
        window.alert(
          "An error occurred while updating your profile availability."
        );
      }
    }
  };

  // Reset Availability Changes

  const resetAvailability = () => {
    setNewAvailability(JSON.parse(JSON.stringify(doctor.availability)));
  };

  // Handle the changing states
  const changeAvailability = (index, e) => {
    setNewAvailability((prevAvailability) => {
      const newAvailability = [...prevAvailability];
      newAvailability[index] = {
        ...newAvailability[index],
        isAvailable: e.target.checked
      };
      return newAvailability;
    });
  };

  // Handle StartTime changes
  const changeStartTime = (index, e) => {
    setNewAvailability((prevAvailability) => {
      const newAvailability = [...prevAvailability];
      newAvailability[index] = {
        ...newAvailability[index],
        startTime: e.target.value
      };
      return newAvailability;
    });
  };

  // Handle End Time changes
  const changeEndTime = (index, e) => {
    setNewAvailability((prevAvailability) => {
      const newAvailability = [...prevAvailability];
      newAvailability[index] = {
        ...newAvailability[index],
        endTime: e.target.value
      };
      return newAvailability;
    });
  };

  // Return day of week based on the index
  const getDayOfWeek = (day) => {
    switch (day) {
      case 0:
        return "Lundi";
      case 1:
        return "Mardi";
      case 2:
        return "Mercredi";
      case 3:
        return "Jeudi";
      case 4:
        return "Vendredi";
      case 5:
        return "Samedi";
      case 6:
        return "Dimanche";
      default:
        return "Lundi";
    }
  };

  // Fetch doctor data on component mount
  useEffect(() => {
    if (effectRan.current === false) {
      fetchDoctor();
    }

    return () => {
      effectRan.current = true;
    };
  }, []);

  return (
    <section className="DoctorHome w-full h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] overflow-scroll overflow-y-scroll">
      <h1 className="text-1xl font-bold text-[#1E1E1E] text-center my-3">
        Bienvenue sur votre espace médecin
      </h1>
      {doctor.pendingApproval ? (
        <div className="flex flex-col md:flex-row justify-around items-center bg-green-500 rounded-lg shadow-lg p-2 m-4">
          <p className="text-1xl font-bold text-white text-center my-3">
            Votre compte est approuvé, configurez votre agenda
          </p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-around items-center bg-red-500 rounded-lg shadow-lg p-2 m-4">
          <p className="text-1xl font-bold text-white text-center my-3">
            Votre compte est en attente d'approbation
          </p>
        </div>
      )}

      <section className="doctor-info flex flex-col justify-center items-start bg-white rounded-lg shadow-lg p-4 m-4 gap-3">
        <div className="mainContainer w-full flex flex-col md:flex-row justify-between items-start">
          <div className="flex flex-col gap-2 md:w-3/4 ">
            <h2 className="text-2xl font-bold my-3">
              Informations personnelles
            </h2>

            <p className="text-1xl font-bold">
              Nom et Prénom :{" "}
              <span className="font-normal">
                {doctor.firstName} {doctor.lastName}{" "}
              </span>
            </p>

            <p className="text-1xl font-bold">
              E-mail : <span className="font-normal">{doctor.email}</span>
            </p>

            <p className="text-1xl font-bold">
              Téléphone :{" "}
              <span className="font-normal">{doctor.phoneNumber || "-"}</span>
            </p>

            <p className="text-1xl font-bold">
              Date du Naissance :{" "}
              <span className="font-normal">{doctor.dateOfBirth || "-"}</span>
            </p>

            <p className="text-1xl font-bold">
              Spécialité :{" "}
              <span className="font-normal">{doctor.speciality || "-"}</span>
            </p>
          </div>
        </div>

        <div className="availabilityTable flex flex-col bg-white rounded-lg shadow-lg p-2  overflow-x-scroll lg:overflow-x-hidden overflow-y-auto">
          <div className="flex flex-col md:flex-row w-full justify-between gap-5 mb-2">
            <p className="text-1xl font-bold">Disponibilité :</p>
            <FaEdit
              className="configureBtn text-yellow-500 cursor-pointer text-xl"
              onClick={() => setShowModal(true)}
            />
          </div>

          <table className="availabilityGroup w-full table-fixed border">
            <tbody>
              {doctor.availability.map((day, index) => (
                <tr key={index}>
                  <td className="text-xl font-bold border">
                    {getDayOfWeek(day.dayOfWeek)}:
                  </td>
                  <td className="border text-center">
                    {day.isAvailable ? (
                      <p className="text-green-500 font-bold">Disponible</p>
                    ) : (
                      <p className="text-red-500 font-bold">Non disponible</p>
                    )}
                  </td>
                  <td className="text-xl font-bold text-center ">De :</td>
                  <td>
                    <p className="text-xl font-medium text-center">
                      {day.startTime}
                    </p>
                  </td>
                  <td className="text-xl font-bold text-center">à :</td>
                  <td>
                    <p className="text-xl font-medium text-center">
                      {day.endTime}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <Modal
            title={"Horaire des travail"}
            showModal={showModal}
            setShowModal={setShowModal}
            firstAction={saveAvailability}
            firstButton={"Enregistrer"}
            secondAction={resetAvailability}
            secondButton={"Reset"}
          >
            <table className="w-full table-fixed border">
              <tbody>
                {doctor.availability.map((day, index) => (
                  <tr key={index}>
                    <td className="text-xl font-bold border">
                      {getDayOfWeek(day.dayOfWeek)}:
                    </td>
                    <td className="border text-center">
                      <input
                        type="checkbox"
                        name={getDayOfWeek(day.dayOfWeek)}
                        id={getDayOfWeek(day.dayOfWeek)}
                        checked={newAvailability[index].isAvailable}
                        onChange={(e) => changeAvailability(index, e)}
                      />
                    </td>
                    <td className="text-xl font-bold text-center ">De :</td>
                    <td>
                      <select
                        name="startTime"
                        id="startTime"
                        className="border-2 border-gray-300 rounded-lg p-1"
                        value={newAvailability[index].startTime}
                        onChange={(e) => changeStartTime(index, e)}
                      >
                        {startTime.map((time, index) => (
                          <option key={index} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="text-xl font-bold text-center">à :</td>
                    <td>
                      <select
                        name="endTime"
                        id="endTime"
                        className="border-2 border-gray-300 rounded-lg p-1"
                        value={newAvailability[index].endTime}
                        onChange={(e) => changeEndTime(index, e)}
                      >
                        {endTime.map((time, index) => (
                          <option key={index} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Modal>
        )}
      </section>
    </section>
  );
};

export default DoctorHome;

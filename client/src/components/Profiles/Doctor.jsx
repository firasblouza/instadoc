import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import { FaStar, FaStarHalfAlt, FaRegStar, FaEye } from "react-icons/fa";
import { capitalize } from "../../utils/Capitalize";
import { ratings } from "../../data/data";

import ImagePreview from "../Dashboard/UI/ImagePreview";
import Modal from "../Dashboard/UI/Modal";

import axios from "../../api/axios";
import useAccessToken from "../../hooks/useAccessToken";

const Doctor = () => {
  const { doctorId } = useParams();

  const [doctor, setDoctor] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [imageModal, setImageModal] = useState({
    state: false,
    image: ""
  });

  const [appointment, setAppointment] = useState({
    date: "",
    reason: ""
  });

  const [demandeStatus, setDemandeStatus] = useState({
    message: "Test",
    error: false
  });

  const effectRan = useRef(false);

  const IMG_URL = "http://localhost:3500/uploads/";
  const IMG_Placeholder = "http://localhost:3500/uploads/imagePlaceholder.png";

  const fetchDoctor = async () => {
    setDoctor([]);
    try {
      const response = await axios.get(`/doctors/${doctorId}`);

      if (response.status === 200) {
        const appointments = await axios.get(
          `/appointments/doctor/${doctorId}`
        );
        const doctorAppointments = appointments.data.filter(
          (appoint) =>
            appoint.doctorId === response.data._id &&
            appoint.status === "completed"
        );

        setDoctor(response.data);
        setDoctor({
          ...response.data,
          dateOfBirth: response.data.dateOfBirth.substring(0, 10),
          speciality: capitalize(response.data.speciality),
          successfulAppointments: doctorAppointments.length
        });
      }
    } catch (err) {
      if (err?.response?.data?.message) {
        console.log(err.response.data.message);
      }
    }
  };

  // Fetch Doctor Profile on Component load
  useEffect(() => {
    if (effectRan.current === false) {
      fetchDoctor();
    }
    return () => {
      effectRan.current = true;
    };
  }, []);

  // Doctor Availability

  const getDayOfWeek = (dayOfWeek) => {
    switch (dayOfWeek) {
      case 0:
        return "Dimanche";
      case 1:
        return "Lundi";
      case 2:
        return "Mardi";
      case 3:
        return "Mercredi";
      case 4:
        return "Jeudi";
      case 5:
        return "Vendredi";
      case 6:
        return "Samedi";
      default:
        return "";
    }
  };

  const getFormattedDate = (date) => {
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric"
    };
    return date.toLocaleDateString("fr-FR", options);
  };

  const getNextAvailableDate = () => {
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    for (let daysToAdd = 0; daysToAdd < 7; daysToAdd++) {
      const nextDayIndex = (currentDayOfWeek + daysToAdd) % 6;
      const availableSlot = doctor?.availability?.find(
        (slot) => slot.dayOfWeek === nextDayIndex && slot.isAvailable
      );
      if (availableSlot) {
        const nextAvailableDay = new Date(today);
        nextAvailableDay.setDate(today.getDate() + daysToAdd);
        return nextAvailableDay;
      }
    }
    return null; // No available day found in the next 7 days
  };

  const nextAvailableDate = getNextAvailableDate();

  const handleImagePreview = (image) => {
    setImageModal({ state: true, image: `${IMG_URL}${image}` });
  };

  const handleShowModal = () => {
    setShowModal(true);
    setDemandeStatus({ message: "", error: false });
  };

  const validateDemande = () => {
    if (appointment.date === "") {
      setDemandeStatus({
        message: "Vous devez choisir une date",
        error: true
      });
      return false;
    }
    if (appointment.reason === "") {
      setDemandeStatus({
        message: "Vous devez entrer un motif",
        error: true
      });
      return false;
    }
    return true;
  };

  // A function to check if the user already has a "pending" appointment with this doctor.

  const getPendingAppointments = async () => {
    const { accessToken, decodedToken } = useAccessToken();
    if (accessToken && accessToken !== "") {
      if (
        decodedToken.UserInfo.role === "user" ||
        decodedToken.UserInfo.role === "admin"
      ) {
        try {
          const userAppointments = await axios.get(
            `/appointments/user/${decodedToken.UserInfo.id}`
          );
          console.log(userAppointments);
          if (userAppointments.status === 200) {
            const pendingAppointments = userAppointments.data.filter(
              (appointment) =>
                appointment.status === "pending" &&
                appointment.doctorId === doctor._id
            );
            console.log(pendingAppointments);
            if (pendingAppointments.length > 0) {
              setDemandeStatus({
                message:
                  "Vous avez déjà une demande en attente avec ce médecin",
                error: true
              });
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        } catch (err) {
          if (err?.response?.data?.message) {
            console.log(err.response.data.message);
          }
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const sendAppointment = async () => {
    const { accessToken, decodedToken } = useAccessToken();
    if (accessToken && accessToken !== "") {
      if (
        decodedToken.UserInfo.role === "user" ||
        decodedToken.UserInfo.role === "admin"
      ) {
        if (validateDemande()) {
          const pendingAppointment = await getPendingAppointments();
          if (!pendingAppointment) {
            const selectedSlot = doctor.availability.find(
              (slot) => slot.dayOfWeek === parseInt(appointment.date, 10)
            );

            try {
              const response = await axios.post(
                "/appointments",
                {
                  userId: decodedToken.UserInfo.id,
                  doctorId: doctor._id,
                  reason: appointment.reason,
                  date: appointment.date,
                  dateTime: formattedDate
                },
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`
                  }
                }
              );
              if (response.status === 201) {
                console.log(response.data);
                window.alert("Votre demande à été envoyée avec succès");
                setDemandeStatus({
                  message: "Votre demande à été envoyée avec succès",
                  error: false
                });
              }
            } catch (err) {
              if (err?.response?.data?.message) {
                console.log(err.response.data.message);
                setDemandeStatus({
                  message: err.response.data.message,
                  error: true
                });
              }
            }
          }
        }
      } else {
        window.alert(
          "Vous devez être connecté en tant que patient pour effectuer cette action"
        );
        setShowModal(false);
        window.location.href = "/login";
      }
    } else {
      window.alert(
        "Vous devez être connecté en tant que patient pour effectuer cette action"
      );
      setShowModal(false);
      window.location.href = "/login";
    }
  };

  return (
    <section className="doctorProfile w-full min-h-screen flex flex-col items-center pt-10">
      {/* Main Container */}

      <div className="flex flex-col md:flex-row  w-full min-h-screen md:w-5/6 h-full rounded-lg shadow-lg p-3 gap-5 md:justify-center">
        {/* Profile Image */}
        <div className="imageSection w-full md:w-2/6 flex flex-col  items-center">
          <img
            src={
              doctor.profileImage
                ? `${IMG_URL}${doctor.profileImage}`
                : IMG_Placeholder
            }
            className=""
            alt={`${doctor.firstName} ${doctor.lastName}`}
          />
          <button
            className="bg-blue-500 w-full hidden md:block text-white rounded-lg px-2 py-1 mt-2"
            onClick={handleShowModal}
          >
            Demander une consultation
          </button>
        </div>

        {/* Appointment Creating Modal */}

        {showModal && (
          <Modal
            showModal={showModal}
            setShowModal={setShowModal}
            title={"Demander une consultation"}
            firstButton={"Envoyer demande"}
            firstAction={sendAppointment}
            secondButton={"Annuler"}
            secondAction={"close"}
          >
            <div className="w-full flex flex-col gap-3">
              <div className="w-full flex flex-col gap-3">
                <h2
                  className={`text-base text-center ${
                    demandeStatus.error ? "text-red-500" : "text-green-500"
                  } font-bold `}
                >
                  {demandeStatus.message}
                </h2>
                <label className="text-base font-bold text-[#1E1E1E]">
                  Date de la consultation
                </label>
                {nextAvailableDate && (
                  <select
                    className="border border-gray-500 rounded-lg p-2"
                    onChange={(e) =>
                      setAppointment({ ...appointment, date: e.target.value })
                    }
                  >
                    <option value="">Selectionner une date</option>
                    {doctor.availability.map((slot) => {
                      if (slot.isAvailable) {
                        const nextDayIndex =
                          (nextAvailableDate.getDay() + slot.dayOfWeek) % 6;
                        const nextDay = new Date(nextAvailableDate);
                        nextDay.setDate(
                          nextAvailableDate.getDate() + slot.dayOfWeek
                        );
                        return (
                          <option key={slot.dayOfWeek} value={slot.dayOfWeek}>
                            {getDayOfWeek(slot.dayOfWeek)} - Le{" "}
                            {capitalize(getFormattedDate(nextDay))}
                          </option>
                        );
                      }
                      return null;
                    })}
                  </select>
                )}
              </div>

              <div className="w-full flex flex-col gap-3">
                <label className="text-base font-bold text-[#1E1E1E]">
                  Motif de la consultation
                </label>
                <textarea
                  className="border border-gray-500 rounded-lg p-2"
                  rows="5"
                  value={appointment.reason}
                  onChange={(e) =>
                    setAppointment({ ...appointment, reason: e.target.value })
                  }
                ></textarea>
              </div>
            </div>
          </Modal>
        )}

        {/* Profile Details */}
        <div className="detailsSection w-full md:w-3/6 flex flex-col  pt-3 gap-3">
          <h1 className="font-bold text-[#1E1E1E} text-3xl text-center">
            Profile du {doctor.firstName} {doctor.lastName}
          </h1>
          <div className="profileDetails w-full flex flex-col mt-10 gap-3 p-3">
            {/* Doctor Name */}

            <div className="detailGroup w-full flex flex-row gap-3">
              <p className="text-base font-bold text-[#1E1E1E]">
                Nom et Prénom :
              </p>
              <p className="text-base text-[#1E1E1E]">
                {doctor.firstName} {doctor.lastName}
              </p>
            </div>

            {/* Doctor Date of Birth */}

            <div className="detailGroup w-full flex flex-row gap-3">
              <p className="text-base font-bold text-[#1E1E1E]">
                Date du Naissance :
              </p>
              <p className="text-base text-[#1E1E1E]">{doctor.dateOfBirth}</p>
            </div>

            {/* Doctor Speciality  */}

            <div className="detailGroup w-full flex flex-row gap-3">
              <p className="text-base font-bold text-[#1E1E1E]">Spécialité :</p>
              <p className="text-base text-[#1E1E1E]">{doctor.speciality}</p>
            </div>

            {/* Doctor Resumé  */}

            <div className="detailGroup w-full flex flex-row gap-3 items-center">
              <p className="text-base font-bold text-[#1E1E1E]">Resumé :</p>
              <p className="text-base text-[#1E1E1E]">Voir</p>
              <FaEye
                className="cursor-pointer"
                onClick={() => handleImagePreview(doctor.cvImage)}
              />
            </div>

            {imageModal.state && (
              <ImagePreview
                imageModal={imageModal}
                setImageModal={setImageModal}
              />
            )}
            {/* Doctor Email */}

            <div className="detailGroup w-full flex flex-row gap-3">
              <p className="text-base font-bold text-[#1E1E1E]">E-mail :</p>
              <p className="text-base text-[#1E1E1E]">{doctor.email}</p>
            </div>

            {/* Consultations Number */}

            <div className="detailGroup w-full flex flex-row gap-3">
              <p className="text-base font-bold text-[#1E1E1E]">
                Consultations réussie :
              </p>
              <p className="text-base text-[#1E1E1E]">
                {doctor.successfulAppointments}
              </p>
            </div>

            {/* Doctor Ratings */}

            <div className="detailGroup w-full flex flex-row gap-3 items-center">
              <p className="text-base font-bold text-[#1E1E1E]">Avis :</p>
              <div className="relative flex flex-row justify-center items-center my-2 gap-1 after:content-['(3.5)'] after:text-sm after:text-gray-500 after:absolute after:-top-4 after:-right-7 ">
                <FaStar className="text-yellow-500" />
                <FaStar className="text-yellow-500" />
                <FaStar className="text-yellow-500" />
                <FaStarHalfAlt className="text-yellow-500" />
                <FaRegStar className="text-yellow-500" />
              </div>
            </div>

            {/* Ratings Display */}

            <div className="ratingsBox w-full flex flex-col shadow-lg rounded-lg  p-2 max-h-[300px]  overflow-y-auto">
              {ratings.map((rating, index) => (
                <div
                  key={index}
                  className="ratingContainer w-full flex flex-col p-2 border-b border-gray-500"
                >
                  {/* Rating Details */}
                  <div className="userSection flex flex-row w-full items-center gap-2">
                    <p className="ratingUser font-bold text-[#1E1E1E] text-xs">
                      {rating.user}
                    </p>
                    {/* Rating Stars */}
                    <div className="relative flex flex-row justify-center items-center gap-1 after:content-['(3.5)'] after:text-sm after:text-gray-500">
                      <FaStar className="text-yellow-500 text-xs" />
                      <FaStar className="text-yellow-500 text-xs" />
                      <FaStar className="text-yellow-500 text-xs" />
                      <FaStarHalfAlt className="text-yellow-500 text-xs" />
                      <FaRegStar className="text-yellow-500 text-xs" />
                    </div>
                  </div>
                  {/* Rating date */}
                  <p className="text-xs text-gray-500">
                    Le {doctor.dateOfBirth} à 20:15
                  </p>
                  {/* Rating Comment */}
                  <p className="text-xs font-normal">{rating.comment}</p>
                </div>
              ))}
            </div>
            {/* Button on mobile */}
            <button className="bg-blue-500 w-full  md:hidden text-white rounded-lg px-2 py-1 mt-2">
              Demander une consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Doctor;

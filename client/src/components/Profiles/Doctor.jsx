import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import { FaStar, FaStarHalfAlt, FaRegStar, FaEye } from "react-icons/fa";
import { capitalize } from "../../utils/Capitalize";
import { ratings } from "../../data/data";

import ImagePreview from "../Dashboard/UI/ImagePreview";

import axios from "../../api/axios";

const Doctor = () => {
  const { doctorId } = useParams();

  const [doctor, setDoctor] = useState({});

  const [imageModal, setImageModal] = useState({
    state: false,
    image: ""
  });

  const effectRan = useRef(false);

  const IMG_URL = "https://instadoc-api.onrender.com/uploads/";
  const IMG_Placeholder = `${IMG_URL}imagePlaceholder.png`;

  const fetchDoctor = async () => {
    setDoctor([]);
    try {
      const response = await axios.get(`/doctors/${doctorId}`);
      if (response.status === 200) {
        console.log(response.data);
        setDoctor(response.data);
        setDoctor({
          ...response.data,
          dateOfBirth: response.data.dateOfBirth.substring(0, 10),
          speciality: capitalize(response.data.speciality)
        });
      }
    } catch (err) {
      if (err?.response?.data?.message) {
        console.log(err.response.data.message);
      }
    }
  };

  // Test Ratings

  const handleImagePreview = (image) => {
    setImageModal({ state: true, image: `${IMG_URL}${image}` });
  };

  // Fetch Doctor Profile on Component load

  useEffect(
    () => async () => {
      if (effectRan.current === false) {
        await fetchDoctor();
      }
    },
    []
  );

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
          <button className="bg-blue-500 w-full hidden md:block text-white rounded-lg px-2 py-1 mt-2">
            Demander une consultation
          </button>
        </div>

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
              <p className="text-base text-[#1E1E1E]">16</p>
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

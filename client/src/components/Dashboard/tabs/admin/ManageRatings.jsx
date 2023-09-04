import { useState, useEffect, useRef } from "react";
import {
  FaTrashAlt,
  FaSync,
  FaFilter,
  FaCheck,
  FaEye,
  FaTimes,
  FaChevronCircleDown
} from "react-icons/fa";

import axios from "../../../../api/axios";
import Modal from "../../UI/Modal";

import { capitalize } from "../../../../utils/Capitalize";

import useAccessToken from "../../../../hooks/useAccessToken";

const ManageRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [ratingsNumber, setRatingsNumber] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const effectRan = useRef(false);

  const { accessToken, decodedToken } = useAccessToken();

  const fetchRatings = async () => {
    if (accessToken && accessToken !== "") {
      try {
        const response = await axios.get("/ratings");
        if (response.status === 200 && response.data.length > 0) {
          const patient = await axios.get(`/users/${response.data.userId}`);
          const doctor = await axios.get(`/doctors/${response.data.doctorId}`);
          if (patient && doctor) {
            const ratingData = {
              ...response.data,
              patient: patient.data,
              doctor: doctor.data
            };
            setRatings(ratingData);
            setRatingsNumber(ratingData.length);
            console.log(ratingData);
          }
        } else {
          console.log("No ratings found");
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          console.log("Unauthorized: You need to log in or refresh your token");
        } else {
          console.log("An error occurred while fetching data:", err.message);
        }
      }
    } else {
      console.log("No access token found");
    }
  };

  useEffect(() => {
    if (effectRan.current === false) {
      fetchRatings();
    }

    return () => {
      effectRan.current = true;
    };
  }, []);

  return (
    <section className="admin-manage-ratings w-full h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] overflow-scroll overflow-y-scroll">
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-1xl font-bold text-[#1E1E1E] text-center my-3">
          Gestion des avis
        </h1>
        <div className="flex flex-col justify-center items-center bg-white rounded-lg shadow-lg p-4 m-4 ">
          <h2 className="text-1xl font-bold">Nombre des avis</h2>
          <p className="text-1xl font-bold">{ratingsNumber}</p>
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          <div className="flex flex-row justify-center items-center w-full">
            <div className="flex flex-col bg-white rounded-lg shadow-lg p-4 m-4 overflow-x-scroll lg:overflow-x-hidden overflow-y-auto min-h-[250px]">
              <div className="flex w-full justify-between gap-5 md:gap-10 mb-5 items-center">
                {/* Search Field */}

                <input
                  type="text"
                  placeholder="Rechercher un médecin"
                  className="border border-gray-300 rounded-lg py-1 px-2 w-full md:w-1/2"
                  onChange={(e) => handleSearch(e)}
                />

                {/* Filter By Speciality Select */}

                <div className="icons flex flex-row gap-5">
                  <FaSync className="cursor-pointer" onClick={fetchRatings} />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto text-center">
                  <thead className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                    <tr>
                      <th className="px-4 py-2">Doctor</th>
                      <th className="px-4 py-2">Patient</th>
                      <th className="px-4 py-2">Stars</th>
                      <th className="px-4 py-2">Comment</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {ratings.length === 0 && (
                      <tr className="text-gray-700 border-b border-gray-200">
                        <td
                          colSpan="6"
                          className="px-4 py-3 text-ms font-semibold border text-center"
                        >
                          Aucun avis trouvé
                        </td>
                      </tr>
                    )}
                    {ratings.map((rating) => (
                      <tr key={rating._id}>
                        <td className="border px-2 py-2">
                          {rating.doctorName}
                        </td>
                        <td className="border px-2 py-2">
                          {rating.patientName}
                        </td>
                        <td className="border px-2 py-2">{rating.rating}</td>
                        <td className="border px-2 py-2">{rating.review}</td>

                        <td className="border flex flex-row gap-3 px-2 py-2">
                          <Link to={`/doctor/${rating.doctorId}`}>
                            <FaEye className="cursor-pointer text-blue-500" />
                          </Link>
                          <FaTrashAlt
                            className="cursor-pointer text-red-500"
                            onClick={() => handleDelete(rating._id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {showModal && (
                <Modal
                  title={"Détails du médecin"}
                  firstAction={handleVerify}
                  secondAction={handleVerify}
                  firstActionArgs={[selectedDoctor._id, "approve"]}
                  secondActionArgs={[selectedDoctor._id, "reject"]}
                  firstButton={"Approve"}
                  secondButton={"Reject"}
                  showModal={showModal}
                  setShowModal={setShowModal}
                >
                  {/* Modal Content */}

                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="w-full flex flex-col">
                      <img
                        src={
                          selectedDoctor.profileImage
                            ? `${IMG_URL}${selectedDoctor.profileImage}`
                            : imgPlaceholder
                        }
                        alt=""
                      />
                    </div>

                    <div className="w-full">
                      <div className="flex flex-col md:flex-row justify-center items-center md:justify-around py-3">
                        <div className="flex flex-col gap-2">
                          <p className="font-bold">Nom:</p>
                          <p>
                            {selectedDoctor.firstName} {selectedDoctor.lastName}
                          </p>

                          <p className="font-bold">Date du Naissance:</p>
                          <p>
                            {new Date(
                              selectedDoctor.dateOfBirth
                            ).toLocaleDateString()}
                          </p>

                          <p className="font-bold">ID Type:</p>

                          <div className="flex flex-row gap-2 items-center justify-center md:justify-start">
                            <p>{selectedDoctor.idType}</p>
                            <FaEye
                              className="cursor-pointer"
                              onClick={() => {
                                handleImagePreview(selectedDoctor.idImage);
                              }}
                            />
                          </div>

                          <p className="font-bold">Numero ID:</p>
                          <p>{selectedDoctor.idNumber}</p>
                        </div>

                        <div className="flex flex-col gap-2 ">
                          <p className="font-bold"># License Médical:</p>

                          <div className="flex flex-row gap-2 items-center justify-center md:justify-start">
                            <p>{selectedDoctor.licenseNumber}</p>
                            <FaEye
                              className="cursor-pointer"
                              onClick={() => {
                                handleImagePreview(selectedDoctor.licenseImage);
                              }}
                            />
                          </div>

                          <p className="font-bold">Spécialité:</p>
                          <p>{capitalize(selectedDoctor.speciality)}</p>

                          <p className="font-bold">Statut:</p>
                          <p>{capitalize(selectedDoctor.verifiedStatus)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal>
              )}
              {/* {imageModal.state && showModal && (
                <ImagePreview
                  imageModal={imageModal}
                  setImageModal={setImageModal}
                />
              )} */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageRatings;

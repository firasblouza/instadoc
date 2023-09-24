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

import { Link, useNavigate } from "react-router-dom";

import axios from "../../../../api/axios";
import Modal from "../../UI/Modal";

import { capitalize } from "../../../../utils/Capitalize";

import useAccessToken from "../../../../hooks/useAccessToken";

const ManageRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [ratingsNumber, setRatingsNumber] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const effectRan = useRef(false);

  const { accessToken, decodedToken } = useAccessToken();

  const fetchRatings = async () => {
    if (accessToken && accessToken !== "") {
      try {
        const response = await axios.get("/ratings");
        if (response.status === 200 && response.data.length > 0) {
          // Create an array to store ratings
          const newRatings = [];

          // Iterate through each rating object in the array
          for (const ratingData of response.data) {
            // Access userId and doctorId for each rating object
            const userId = ratingData.userId;
            const doctorId = ratingData.doctorId;

            // Fetch patient and doctor data using userId and doctorId
            const [patient, doctor] = await Promise.all([
              axios.get(`/users/${userId}`),
              axios.get(`/doctors/${doctorId}`)
            ]);

            if (patient && doctor) {
              // Create ratingData object with patient and doctor data
              const ratingInfo = {
                ...ratingData,
                patient: patient.data,
                doctor: doctor.data
              };

              // Add the ratingInfo object to the newRatings array
              newRatings.push(ratingInfo);
            }
          }

          // Set the state with the newRatings array
          setRatings(newRatings.reverse());
          setRatingsNumber(newRatings.length);
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

  const viewAvis = (id) => {
    navigate(`/doctor/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/ratings/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (response.status === 200) {
        fetchRatings();
        window.alert("Avis supprimer avec success");
      } else {
        window.alert("Désolé, une erreur s'est produite");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        console.log("Unauthorized: You need to log in or refresh your token");
      } else {
        console.log("An error occurred while fetching data:", err.message);
      }
    }
  };

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
                  placeholder="Rechercher un avis"
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

                        <td className="border flex justify-center flex-row gap-3 px-2 py-2">
                          <FaEye
                            className="cursor-pointer text-blue-500"
                            onClick={() =>
                              setSelectedRating(rating) & setShowModal(true)
                            }
                          />
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
                  title={"Avis"}
                  firstAction={viewAvis}
                  secondAction={handleDelete}
                  secondActionArgs={[selectedRating._id]}
                  firstButton={"Voir"}
                  secondButton={"Supprimer"}
                  showModal={showModal}
                  setShowModal={setShowModal}
                >
                  {/* Modal Content */}

                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="w-full">
                      <div className="flex flex-col md:flex-row justify-center items-start md:justify-around py-3">
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-row gap-3">
                            <p className="font-bold">Médecin:</p>
                            <p>{selectedRating.doctorName}</p>
                          </div>

                          <div className="flex flex-row gap-3">
                            <p className="font-bold">Patient:</p>
                            <p>{selectedRating.patientName}</p>
                          </div>

                          <div className="flex flex-row gap-3">
                            <p className="font-bold">Date:</p>

                            <div className="flex flex-row gap-2 items-center justify-center md:justify-start">
                              <p>
                                {new Date(
                                  selectedRating.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-row gap-3">
                            <p className="font-bold">Rating:</p>
                            <p>{selectedRating.rating}</p>
                          </div>
                        </div>

                        <div className="flex flex-row gap-3">
                          <p className="font-bold">Commentaire:</p>

                          <p>{selectedRating.review}</p>
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

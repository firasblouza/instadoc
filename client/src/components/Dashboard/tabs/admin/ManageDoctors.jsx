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
import ImagePreview from "../../UI/ImagePreview";

const ManageDoctors = () => {
  const effectRan = useRef(false);
  const [doctors, setDoctors] = useState([]);
  const [doctorsNumber, setDoctorsNumber] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("");
  const [filterOpen, setFilterOpen] = useState("");
  const [imageModal, setImageModal] = useState({
    state: false,
    image: ""
  });

  const IMG_URL = "http://localhost:3500/uploads/";

  // Function to fetch the doctors

  const fetchDoctors = async () => {
    setDoctors([]);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        const response = await axios.get("/admin/doctors", {
          headers: {
            Authorization: `Bearer ${accessToken}` // Attach the token to the Authorization header
          }
        });
        setDoctors(response.data);
        setDoctorsNumber(response.data.length);
      } else {
        console.log("No access token found");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Unauthorized: You need to log in or refresh your token");
      } else {
        console.log("An error occurred while fetching data:", error.message);
      }
    }
  };

  // Load the doctors on component mount

  useEffect(() => {
    if (effectRan.current === false) {
      fetchDoctors();
    }
    return () => {
      effectRan.current = true;
    };
  }, []);

  // Delete Doctors

  const handleDelete = async (id) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        const response = await axios.delete(`/admin/doctor/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        if (response.status === 200) {
          setDoctors(doctors.filter((doctor) => doctor._id !== id));
        }
      } else {
        console.log("No access token found");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Unauthorized: You need to log in or refresh your token");
      } else {
        console.log(
          "An error occurred while deleting the doctor",
          error.message
        );
      }
    }
  };

  // Handle the view doctor details popup

  const handleViewDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  // Handle the close view doctor details popup

  const handleCloseModal = () => {
    setSelectedDoctor(null);
    setShowModal(false);
  };

  // Handle the image preview

  const handleImagePreview = (image) => {
    setImageModal({ state: true, image: `${IMG_URL}${image}` });
  };

  // Add table sorting
  const handleFilter = async (filter) => {
    await fetchDoctors();
    setFilterOpen(false);

    if (filter === "all") {
      return; // No need to further filter for "all" option
    }

    setDoctors((filteredDoctors) =>
      filteredDoctors.filter((doctor) => doctor.verifiedStatus === filter)
    );
  };

  // Verify doctor

  const handleVerify = async (id, action) => {
    const endpoint = action === "approve" ? "approve" : "reject";
    const status = action === "approve" ? "approved" : "rejected";
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        const response = await axios.put(
          `/admin/doctor/${action}/${id}`,
          { verifiedStatus: status },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        if (response.status === 200) {
          fetchDoctors();
          window.alert(`Doctor ${status} successfully`);
          setShowModal(false);
        } else {
          window.alert(
            `An error occurred while ${
              action == "approve" ? "verifying" : "rejecting"
            } the doctor`
          );
        }
      } else {
        console.log("No access token found");
      }
    } catch (err) {
      console.log(
        `An error occurred while ${
          action == "approve" ? "verifying" : "rejecting"
        } the doctor`,
        err.message
      );
    }
  };

  return (
    <section className="admin-manage-doctors w-full h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] overflow-scroll overflow-y-scroll">
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-1xl font-bold text-[#1E1E1E] text-center my-3">
          Gestion des médecins
        </h1>
        <div className="flex flex-col justify-center items-center bg-white rounded-lg shadow-lg p-4 m-4 ">
          <h2 className="text-1xl font-bold">Nombre de médecins</h2>
          <p className="text-1xl font-bold">{doctorsNumber}</p>
        </div>

        <div className="flex flex-row justify-center items-center w-full">
          <div className="flex flex-col justify-center items-center bg-white rounded-lg shadow-lg p-4 m-4 ">
            <h2 className="text-1xl font-bold">Médecins Approuvé</h2>
            <p className="text-1xl font-bold text-green-500">
              {
                doctors.filter(
                  (doctor) =>
                    doctor.verifiedStatus === "approved" ||
                    doctor.verifiedStatus === "verified"
                ).length
              }
            </p>
          </div>

          <div className="flex flex-col justify-center items-center bg-white rounded-lg shadow-lg p-4 m-4 ">
            <h2 className="text-1xl font-bold">Médecins Rejetée</h2>
            <p className="text-1xl font-bold text-red-500">
              {
                doctors.filter((doctor) => doctor.verifiedStatus === "rejected")
                  .length
              }
            </p>
          </div>

          <div className="flex flex-col justify-center items-center bg-white rounded-lg shadow-lg p-4 m-4 ">
            <h2 className="text-1xl font-bold">Médecins en attente</h2>
            <p className="text-1xl font-bold text-orange-500">
              {
                doctors.filter((doctor) => doctor.verifiedStatus === "pending")
                  .length
              }
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full">
        <div className="flex flex-row justify-center items-center w-full">
          <div className="flex flex-col bg-white rounded-lg shadow-lg p-4 m-4 overflow-x-scroll lg:overflow-x-hidden overflow-y-auto">
            <div className="flex w-full justify-end gap-10 mb-5">
              <div className="relative inline-block text-left">
                <FaFilter
                  className="cursor-pointer"
                  onClick={() => setFilterOpen(!filterOpen)}
                />
                {filterOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <div
                        onClick={() => handleFilter("all")}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                      >
                        All
                      </div>
                      <div
                        onClick={() => handleFilter("pending")}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                      >
                        Pending
                      </div>
                      <div
                        onClick={() => handleFilter("approved")}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                      >
                        Approved
                      </div>
                      <div
                        onClick={() => handleFilter("rejected")}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                      >
                        Rejected
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <FaSync className="cursor-pointer" onClick={fetchDoctors} />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-center">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Dr.</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Spécialité</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor) => (
                    <tr key={doctor._id}>
                      <td className="border px-2 py-2">
                        {doctor.firstName} {doctor.lastName}
                      </td>
                      <td className="border px-2 py-2">{doctor.email}</td>
                      <td className="border px-2 py-2">{doctor.idNumber}</td>
                      <td className="border px-2 py-2">{doctor.speciality}</td>
                      <td
                        className={`border px-2 py-2 ${
                          doctor.verifiedStatus === "pending"
                            ? "text-orange-400"
                            : doctor.verifiedStatus === "approved"
                            ? "text-green-400"
                            : doctor.verifiedStatus === "rejected"
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {doctor.verifiedStatus}
                      </td>
                      <td className="border flex flex-row gap-3 px-2 py-2">
                        <FaEye className="cursor-pointer" />
                        <FaTrashAlt
                          className="cursor-pointer"
                          onClick={() => handleDelete(doctor._id)}
                        />
                        {doctor.verifiedStatus === "pending" ? (
                          <FaCheck
                            className="cursor-pointer"
                            onClick={() => handleViewDetails(doctor)}
                          />
                        ) : (
                          ""
                        )}
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
                secondAction={handleImagePreview}
                data={{ ...selectedDoctor, IMG_URL }}
                showModal={showModal}
                setShowModal={setShowModal}
              />
            )}
            {imageModal.state && showModal && (
              <ImagePreview
                imageModal={imageModal}
                setImageModal={setImageModal}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageDoctors;

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
import { Link } from "react-router-dom";

import axios from "../../../../api/axios";
import Modal from "../../UI/Modal";
import ImagePreview from "../../UI/ImagePreview";

import { capitalize } from "../../../../utils/Capitalize";

import useAccessToken from "../../../../hooks/useAccessToken";

const Demandes = () => {
  const effectRan = useRef(false);

  const [appointments, setAppointments] = useState([]);
  const [initialAppts, setInitialAppts] = useState([]); // Used to reset the appointments state
  const [apptsNumber, setApptsNumber] = useState(0);
  const [selectedAppt, setSelectedAppt] = useState(null);

  const [filter, setFilter] = useState("");
  const [filterOpen, setFilterOpen] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [imageModal, setImageModal] = useState({
    state: false,
    image: ""
  });

  const [search, setSearch] = useState("");

  const IMG_URL = "http://localhost:3500/uploads/";
  const imgPlaceholder = `${IMG_URL}imagePlaceholder.png`;

  const fetchPatient = async (patientId) => {
    try {
      const { accessToken } = useAccessToken();
      if (accessToken && accessToken !== "") {
        const response = await axios.get(`/users/${patientId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}` // Attach the token to the Authorization header
          }
        });
        return response.data;
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

  // Function to fetch the appointments

  const fetchAppointments = async () => {
    setAppointments([]);
    try {
      const { accessToken, decodedToken } = useAccessToken();
      if (accessToken && accessToken !== "") {
        const doctorId = decodedToken.UserInfo.id;
        const response = await axios.get(`/appointments/doctor/${doctorId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}` // Attach the token to the Authorization header
          }
        });
        const appointmentsData = await Promise.all(
          response.data.map(async (appointment) => {
            const patient = await fetchPatient(appointment.userId);
            return { ...appointment, patient };
          })
        );
        setAppointments(appointmentsData);
        setInitialAppts(appointmentsData);
        setApptsNumber(appointmentsData.length);
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

  // Load the appointments on component mount

  useEffect(() => {
    if (effectRan.current === false) {
      fetchAppointments();
    }
    return () => {
      effectRan.current = true;
    };
  }, []);

  // Verify or reject appointment

  const handleVerify = async (id, action) => {
    const endpoint = action === "approve" ? "modify" : "cancel";
    const status = action === "approve" ? "approved" : "cancelled";
    const alert = action === "approve" ? "verifié" : "rejeté";
    if (window.confirm(`Vous êtes sûr de vouloir ${alert} cette demande ?`)) {
      try {
        const { accessToken } = useAccessToken();
        if (accessToken && accessToken !== "") {
          const response = await axios.put(
            `/appointments/${endpoint}/${id}`,
            { status },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            }
          );
          if (response.status === 200) {
            fetchAppointments();
            window.alert(`Appointment ${status} successfully`);
            setShowModal(false);
          } else {
            window.alert(
              `An error occurred while ${
                action == "approve" ? "approving" : "rejecting"
              } the appointment`
            );
          }
        } else {
          console.log("No access token found");
        }
      } catch (err) {
        console.log(
          `An error occurred while ${
            action == "approve" ? "approving" : "rejecting"
          } the appointment`,
          err.message
        );
      }
    }
  };

  // Delete Doctors

  const handleDelete = async (id) => {
    if (window.confirm("Vous êtes sûr de vouloir supprimer cette demande ?")) {
      try {
        const { accessToken } = useAccessToken();
        if (accessToken && accessToken !== "") {
          const response = await axios.delete(`/appointments/${id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          if (response.status === 200) {
            setAppointments(
              appointments.filter((appointment) => appointment._id !== id)
            );
            window.alert("Demande supprimer avec succés");
          }
        } else {
          console.log("No access token found");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log("Unauthorized: You need to log in or refresh your token");
        } else {
          console.log(
            "An error occurred while deleting the appointment",
            error.message
          );
        }
      }
    }
  };

  // Patient Search

  const handleSearch = (e) => {
    const searchString = e.target.value.toLowerCase(); // Convert the search string to lowercase
    setSearch(searchString); // Update the search state

    if (searchString === "") {
      setAppointments(initialAppts);
    } else {
      setAppointments(
        initialAppts.filter(
          (appointment) =>
            appointment.patient.firstName
              .toLowerCase()
              .includes(searchString) ||
            appointment.patient.lastName.toLowerCase().includes(searchString) ||
            appointment.patient.email.toLowerCase().includes(searchString)
        )
      );
    }
  };

  // Handle the view appointment details popup

  const handleViewDetails = (appointment) => {
    setSelectedAppt(appointment);
    setShowModal(true);
  };

  // Handle the close view appointment details popup

  const handleCloseModal = () => {
    setSelectedAppt(null);
    setShowModal(false);
  };

  // Add table sorting
  const handleFilter = async (filter) => {
    await fetchAppointments();
    setFilterOpen(false);

    if (filter === "all") {
      return; // No need to further filter for "all" option
    }

    setAppointments((filteredAppts) =>
      filteredAppts.filter((appointment) => appointment.status === filter)
    );
  };

  return (
    <section className="admin-manage-appointments w-full h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] overflow-scroll overflow-y-scroll">
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-1xl font-bold text-[#1E1E1E] text-center my-3">
          Gestion des demandes
        </h1>
        <div className="flex flex-col justify-center items-center bg-white rounded-lg shadow-lg p-4 m-4 ">
          <h2 className="text-1xl font-bold">Nombre de demandes</h2>
          <p className="text-1xl font-bold">{apptsNumber}</p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center w-full">
          <div className="flex flex-col justify-center items-center bg-white rounded-lg shadow-lg p-4 m-4 ">
            <h2 className="text-1xl font-bold">Demandes Terminée</h2>
            <p className="text-1xl font-bold text-green-500">
              {
                appointments.filter(
                  (appointment) => appointment.status === "completed"
                ).length
              }
            </p>
          </div>

          <div className="flex flex-col justify-center items-center bg-white rounded-lg shadow-lg p-4 m-4 ">
            <h2 className="text-1xl font-bold">Demandes Approuvé</h2>
            <p className="text-1xl font-bold text-green-500">
              {
                appointments.filter(
                  (appointment) => appointment.status === "approved"
                ).length
              }
            </p>
          </div>

          <div className="flex flex-col justify-center items-center bg-white rounded-lg shadow-lg p-4 m-4 ">
            <h2 className="text-1xl font-bold">Demandes Rejetée</h2>
            <p className="text-1xl font-bold text-red-500">
              {
                appointments.filter(
                  (appointment) => appointment.status === "cancelled"
                ).length
              }
            </p>
          </div>

          <div className="flex flex-col justify-center items-center bg-white rounded-lg shadow-lg p-4 m-4 ">
            <h2 className="text-1xl font-bold">Demandes en attente</h2>
            <p className="text-1xl font-bold text-orange-500">
              {
                appointments.filter(
                  (appointment) => appointment.status === "pending"
                ).length
              }
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-full">
        <div className="flex flex-row justify-center items-center w-full">
          <div className="flex flex-col bg-white rounded-lg shadow-lg p-4 m-4 overflow-x-scroll lg:overflow-x-hidden overflow-y-auto min-h-[250px]">
            <div className="flex w-full justify-end gap-5 md:gap-10 mb-5 items-center">
              {/* Filter By Status */}

              <div className="icons flex flex-row gap-5">
                <div className="relative inline-block text-left">
                  <FaFilter
                    className="cursor-pointer"
                    onClick={() => setFilterOpen(!filterOpen)}
                  />
                  {filterOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-white ring-opacity-5">
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
                          onClick={() => handleFilter("completed")}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                        >
                          Completed
                        </div>
                        <div
                          onClick={() => handleFilter("cancelled")}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                        >
                          Rejected
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <FaSync
                  className="cursor-pointer"
                  onClick={fetchAppointments}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-center">
                <thead className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                  <tr>
                    <th className="px-4 py-2">Patient</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Etat</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.length === 0 && (
                    <tr className="text-gray-700 border-b border-gray-200">
                      <td
                        colSpan="6"
                        className="px-4 py-3 text-ms font-semibold border text-center"
                      >
                        Aucun demande trouvé
                      </td>
                    </tr>
                  )}
                  {appointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td className="border px-2 py-2">
                        {appointment.patient.firstName}{" "}
                        {appointment.patient.lastName}
                      </td>
                      <td className="border px-2 py-2">
                        {appointment.patient.email}
                      </td>
                      <td className="border px-2 py-2">{appointment.date}</td>
                      <td
                        className={`border px-2 py-2 ${
                          appointment.status === "pending"
                            ? "text-orange-500"
                            : appointment.status === "Approved"
                            ? "text-blue-500"
                            : appointment.status === "Cancelled"
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {capitalize(appointment.status)}
                      </td>
                      <td className="border flex flex-row gap-3 px-2 py-2">
                        <Link to={`/appointment/${appointment._id}`}>
                          <FaEye className="cursor-pointer text-blue-500" />
                        </Link>
                        <FaTrashAlt
                          className="cursor-pointer text-red-500"
                          onClick={() => handleDelete(appointment._id)}
                        />
                        {appointment.status === "pending" ? (
                          <FaCheck
                            className="cursor-pointer text-green-500"
                            onClick={() => handleViewDetails(appointment)}
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
                title={"Détails du demande"}
                firstAction={handleVerify}
                secondAction={handleVerify}
                firstActionArgs={[selectedAppt._id, "approve"]}
                secondActionArgs={[selectedAppt._id, "reject"]}
                firstButton={"Approve"}
                secondButton={"Reject"}
                showModal={showModal}
                setShowModal={setShowModal}
              >
                {/* Modal Content */}

                <div className="flex flex-col md:flex-row gap-2">
                  <div className="w-full">
                    <div className="flex flex-col md:flex-row justify-center items-center md:justify-around py-3">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-row gap-2">
                          <p className="font-bold">Nom:</p>
                          <p>
                            {selectedAppt.patient.firstName}{" "}
                            {selectedAppt.patient.lastName}
                          </p>
                        </div>

                        <div className="flex flex-row gap-2">
                          <p className="font-bold">Date du Naissance:</p>
                          <p>
                            {new Date(
                              selectedAppt.patient.dateOfBirth
                            ).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex flex-row gap-2">
                          <p className="font-bold">Email:</p>
                          <p>{selectedAppt.patient.email} </p>
                        </div>

                        <div className="flex flex-row gap-2">
                          <p className="font-bold">Etat:</p>
                          <p
                            className={`${
                              selectedAppt.status === "pending"
                                ? "text-orange-500"
                                : selectedAppt.status === "approved"
                                ? "text-blue-500"
                                : selectedAppt.status === "rejected"
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {capitalize(selectedAppt.status)}
                          </p>
                        </div>

                        <div className="flex flex-row gap-2">
                          <p className="font-bold">Date:</p>
                          <p>{capitalize(selectedAppt.date)}</p>
                        </div>

                        <div className="flex flex-row gap-2">
                          <p className="font-bold">Motif:</p>
                          <p>{capitalize(selectedAppt.reason)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demandes;

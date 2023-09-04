import { useState, useEffect, useRef } from "react";
import { FaTrashAlt, FaEye, FaEdit, FaSync } from "react-icons/fa";

import axios from "../../../../api/axios";
import useAccessToken from "../../../../hooks/useAccessToken";

import Modal from "../../UI/Modal";

const ManagePatients = () => {
  const effectRan = useRef(false);
  const [patients, setPatients] = useState([]);
  const [initialPatients, setInitialPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const { accessToken } = useAccessToken();

  const fetchPatients = async () => {
    try {
      if (accessToken && accessToken !== "") {
        const response = await axios.get("/admin/patients", {
          headers: {
            Authorization: `Bearer ${accessToken}` // Attach the token to the Authorization header
          }
        });
        const fetchedPatients = response.data.filter(
          (patient) => patient.role === "user"
        );
        setInitialPatients(fetchedPatients);
        setPatients(fetchedPatients);
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

  useEffect(() => {
    if (effectRan.current === false) {
      fetchPatients();
    }

    return () => {
      effectRan.current = true;
    };
  }, []);

  // Handle Patient Delete

  const handleDelete = async (id) => {
    try {
      const { accessToken } = useAccessToken();
      if (accessToken) {
        const response = await axios.delete(`/admin/patient/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        if (response.status === 200) {
          setPatients(patients.filter((patient) => patient._id !== id));
        }
      } else {
        console.log("No access token found");
      }
    } catch {
      console.log("An error occurred while deleting the patient");
    }
  };

  // Handle user search

  const handleSearch = (e) => {
    const searchString = e.target.value.toLowerCase(); // Convert the search string to lowercase
    setSearch(searchString); // Update the search state

    if (searchString === "") {
      setPatients(initialPatients);
    } else {
      setPatients(
        initialPatients.filter(
          (patient) =>
            patient.firstName.toLowerCase().includes(searchString) ||
            patient.lastName.toLowerCase().includes(searchString) ||
            patient.email.toLowerCase().includes(searchString)
        )
      );
    }
  };

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const handleViewEdit = (patient) => {
    setSelectedPatient(patient);
    setEditModal(true);
  };

  const editPatient = async (patient) => {
    const id = patient._id;
    if (accessToken && accessToken !== "") {
      try {
        const response = await axios.put(`/admin/patient/${id}`, patient, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        });
        if (response.status === 200) {
          setEditModal(false);
          window.alert("Patient modifié avec succès");
          fetchPatients();
        }
      } catch {
        window.alert("Une erreur s'est produite lors de la modification");
        console.log("An error occurred while updating the patient");
      }
    }
  };

  return (
    <section className="admin-patients w-full h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] overflow-scroll overflow-y-hidden">
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-1xl font-bold text-[#1E1E1E] text-center my-3">
          Gestion des patients
        </h1>

        <div className="flex flex-row justify-center items-center w-full">
          <div className="flex flex-col justify-center items-center bg-white rounded-lg shadow-lg p-4 m-4">
            <h2 className="text-1xl font-bold">Nombre de patients</h2>
            <p className="text-1xl font-bold">{patients.length}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full">
        <div className="flex flex-row justify-center items-center w-full">
          <div className="flex flex-col bg-white rounded-lg shadow-lg p-4 m-4 overflow-x-scroll lg:overflow-x-hidden">
            <div className="flex w-full justify-between mb-5 gap-5 items-center">
              {/* Add a search field  */}
              <input
                type="text"
                placeholder="Rechercher un patient"
                className="border border-gray-300 rounded-lg py-1 px-2 w-full md:w-1/2"
                onChange={(e) => handleSearch(e)}
              />

              <FaSync className="cursor-pointer" onClick={fetchPatients} />
            </div>
            {/* Create a table with the patients in it and action buttons */}
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-center">
                <thead className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                  <tr>
                    <th className="px-4 py-2">Nom</th>
                    <th className="px-4 py-2">Prénom</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.length === 0 && (
                    <tr className="text-gray-700 border-b border-gray-200">
                      <td
                        colSpan="4"
                        className="px-4 py-3 text-ms font-semibold border text-center"
                      >
                        Aucun patient trouvé
                      </td>
                    </tr>
                  )}
                  {patients.map((patient, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{patient.lastName}</td>
                      <td className="border px-4 py-2">{patient.firstName}</td>
                      <td className="border px-4 py-2">{patient.email}</td>
                      <td className="border px-4 py-2 flex flex-row gap-3">
                        <FaEye
                          className="cursor-pointer text-blue-500 hover:text-blue-400"
                          onClick={() => handleViewDetails(patient)}
                        />
                        <FaEdit
                          className="cursor-pointer text-orange-500 hover:text-orange-400"
                          onClick={() => handleViewEdit(patient)}
                        />
                        <FaTrashAlt
                          className="cursor-pointer text-red-500 hover:text-red-400"
                          onClick={() => handleDelete(patient._id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {showModal && (
                <Modal
                  title="Détails du patient"
                  showModal={showModal}
                  setShowModal={setShowModal}
                  secondAction={() => setShowModal(false)}
                  secondButton={"Fermer"}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-row gap-3">
                      <p className="font-bold">Nom:</p>
                      <p>
                        {selectedPatient.lastName} {selectedPatient.firstName}
                      </p>
                    </div>
                    <div className="flex flex-row gap-3">
                      <p className="font-bold">Date du Naissance:</p>
                      <p>{selectedPatient.dateOfBirth}</p>
                    </div>
                    <div className="flex flex-row gap-3">
                      <p className="font-bold">Email:</p>
                      <p>{selectedPatient.email}</p>
                    </div>
                    <div className="flex flex-row gap-3">
                      <p className="font-bold">Téléphone:</p>
                      <p>
                        {selectedPatient.phoneNumber.length > 0
                          ? selectedPatient.phoneNumber
                          : "-"}
                      </p>
                    </div>
                    <div className="flex flex-row gap-3">
                      <p className="font-bold">Allergies:</p>
                      <p>
                        {selectedPatient.allergies.length > 0
                          ? selectedPatient.allergies
                          : "-"}
                      </p>
                    </div>
                    <div className="flex flex-row gap-3">
                      <p className="font-bold">Medical History:</p>
                      <p>
                        {selectedPatient.medicalHistory.length > 0
                          ? selectedPatient.medicalHistory
                          : "-"}
                      </p>
                    </div>
                  </div>
                </Modal>
              )}
              {editModal && (
                <Modal
                  title="Modifier le patient"
                  showModal={editModal}
                  setShowModal={setEditModal}
                  firstAction={editPatient}
                  firstActionArgs={[selectedPatient]}
                  firstButton={"Modifier"}
                  secondAction={() => setEditModal(false)}
                  secondButton={"Fermer"}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-row gap-3">
                      <p className="font-bold">Nom:</p>
                      <input
                        type="text"
                        className="border border-gray-300 rounded-lg py-1 px-2 w-full md:w-1/2"
                        value={selectedPatient.lastName}
                        onChange={(e) =>
                          setSelectedPatient({
                            ...selectedPatient,
                            lastName: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className="flex flex-row gap-3">
                      <p className="font-bold">Prénom:</p>
                      <input
                        type="text"
                        className="border border-gray-300 rounded-lg py-1 px-2 w-full md:w-1/2"
                        value={selectedPatient.firstName}
                        onChange={(e) =>
                          setSelectedPatient({
                            ...selectedPatient,
                            firstName: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className="flex flex-row gap-3">
                      <p className="font-bold">Date du Naissance:</p>
                      <input
                        type="date"
                        className="border border-gray-300 rounded-lg py-1 px-2 w-full md:w-1/2"
                        value={selectedPatient.dateOfBirth.substring(0, 10)}
                        onChange={(e) =>
                          setSelectedPatient({
                            ...selectedPatient,
                            dateOfBirth: e.target.value.substring(0, 10)
                          })
                        }
                      />
                    </div>
                    <div className="flex flex-row gap-3">
                      <p className="font-bold">Email:</p>
                      <input
                        type="email"
                        className="border border-gray-300 rounded-lg py-1 px-2 w-full md:w-1/2"
                        value={selectedPatient.email}
                        onChange={(e) =>
                          setSelectedPatient({
                            ...selectedPatient,
                            email: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className="flex flex-row gap-3">
                      <p className="font-bold">Téléphone:</p>
                      <input
                        type="text"
                        className="border border-gray-300 rounded-lg py-1 px-2 w-full md:w-1/2"
                        value={selectedPatient.phoneNumber}
                        onChange={(e) =>
                          setSelectedPatient({
                            ...selectedPatient,
                            phoneNumber: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className="flex flex-row gap-3">
                      <p className="font-bold">Mot de passe:</p>
                      <input
                        type="password"
                        className="border border-gray-300 rounded-lg py-1 px-2 w-full md:w-1/2"
                        value={selectedPatient.password}
                        onChange={(e) =>
                          setSelectedPatient({
                            ...selectedPatient,
                            password: e.target.value
                          })
                        }
                      />
                    </div>
                  </div>
                </Modal>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManagePatients;

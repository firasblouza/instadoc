import { useState, useEffect, useRef } from "react";
import { FaTrashAlt, FaEye, FaEdit, FaSync } from "react-icons/fa";

import axios from "../../../../api/axios";
import useAccessToken from "../../../../hooks/useAccessToken";

const ManagePatients = () => {
  const effectRan = useRef(false);
  const [patients, setPatients] = useState([]);
  const [initialPatients, setInitialPatients] = useState([]);
  const [search, setSearch] = useState("");

  const fetchPatients = async () => {
    try {
      const { accessToken } = useAccessToken();

      if (accessToken) {
        const response = await axios.get("/admin/patients", {
          headers: {
            Authorization: `Bearer ${accessToken}` // Attach the token to the Authorization header
          }
        });
        setInitialPatients(response.data);
        setPatients(response.data);
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
            <div className="flex w-full justify-between mb-5">
              {/* Add a search field  */}
              <input
                type="text"
                placeholder="Rechercher un patient"
                className="border border-gray-300 rounded-lg py-1 px-2 w-1/2"
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
                        <FaEye className="cursor-pointer text-blue-500 hover:text-blue-400" />
                        <FaEdit className="cursor-pointer text-orange-500 hover:text-orange-400" />
                        <FaTrashAlt
                          className="cursor-pointer text-red-500 hover:text-red-400"
                          onClick={() => handleDelete(patient._id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManagePatients;

import { useState, useEffect, useRef } from "react";
import { FaTrashAlt, FaEye, FaEdit, FaSync } from "react-icons/fa";
import axios from "../../../../api/axios";

const ManagePatients = () => {
  const effectRan = useRef(false);
  const [patients, setPatients] = useState([]);

  const fetchPatients = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken) {
        const response = await axios.get("/admin/patients", {
          headers: {
            Authorization: `Bearer ${accessToken}` // Attach the token to the Authorization header
          }
        });
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

  const handleDelete = async (id) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
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
            <div className="flex w-full justify-end mb-5">
              <FaSync className="cursor-pointer" onClick={fetchPatients} />
            </div>
            {/* Create a table with the patients in it and action buttons */}
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-center">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Nom</th>
                    <th className="px-4 py-2">Prénom</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">{patient.lastName}</td>
                      <td className="px-4 py-2">{patient.firstName}</td>
                      <td className="px-4 py-2">{patient.email}</td>
                      <td className="px-4 py-2 flex flex-row gap-3">
                        <FaEye className="cursor-pointer hover:text-gray-300" />
                        <FaEdit className="cursor-pointer hover:text-gray-300" />
                        <FaTrashAlt
                          className="cursor-pointer hover:text-gray-300"
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

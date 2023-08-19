import { useState, useEffect, useRef } from "react";
import { FaTrashAlt, FaSync, FaFilter } from "react-icons/fa";
import axios from "../../../../api/axios";

const ManageDoctors = () => {
  const effectRan = useRef(false);
  const [doctors, setDoctors] = useState([]);

  const fetchDoctors = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        const response = await axios.get("/admin/doctors", {
          headers: {
            Authorization: `Bearer ${accessToken}` // Attach the token to the Authorization header
          }
        });
        setDoctors(response.data);
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
      fetchDoctors();
    }
    return () => {
      effectRan.current = true;
    };
  }, []);

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

  // Add table sorting

  const handleFilter = () => {
    setDoctors(doctors.filter((doctor) => doctor.verifiedStatus === "pending"));
  };

  return (
    <section className="admin-manage-doctors w-full h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] overflow-scroll overflow-y-hidden">
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-1xl font-bold text-[#1E1E1E] text-center my-3">
          Gestion des médecins
        </h1>

        <div className="flex flex-row justify-center items-center w-full">
          <div className="flex flex-col justify-center items-center bg-white rounded-lg shadow-lg p-4 m-4">
            <h2 className="text-1xl font-bold">Nombre de médecins</h2>
            <p className="text-1xl font-bold">{doctors.length}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full">
        <div className="flex flex-row justify-center items-center w-full">
          <div className="flex flex-col bg-white rounded-lg shadow-lg p-4 m-4 overflow-x-scroll lg:overflow-x-hidden">
            <div className="flex w-full justify-end gap-10 mb-5">
              <FaFilter className="cursor-pointer" onClick={handleFilter} />
              <FaSync className="cursor-pointer" onClick={fetchDoctors} />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-center">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Nom</th>
                    <th className="px-4 py-2">Prénom</th>
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
                      <td className="border px-2 py-2">{doctor.lastName}</td>
                      <td className="border px-2 py-2">{doctor.firstName}</td>
                      <td className="border px-2 py-2">{doctor.email}</td>
                      <td className="border px-2 py-2">{doctor.idNumber}</td>
                      <td className="border px-2 py-2">{doctor.speciality}</td>

                      <td
                        className={`border px-2 py-2 ${
                          doctor.verifiedStatus == "pending"
                            ? "text-orange-400"
                            : "text-green-400"
                        }`}
                      >
                        {doctor.verifiedStatus}
                      </td>
                      <td className="border px-2 py-2">
                        <FaTrashAlt
                          className="cursor-pointer"
                          onClick={() => handleDelete(doctor._id)}
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

export default ManageDoctors;

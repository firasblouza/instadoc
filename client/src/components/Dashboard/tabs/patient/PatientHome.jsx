import { useState, useEffect, useRef } from "react";

import axios from "../../../../api/axios";
import useAccessToken from "../../../../hooks/useAccessToken";

const PatientHome = () => {
  const effectRan = useRef(false);
  const [statistics, setStatistics] = useState({
    pending: 0,
    approved: 0,
    cancelled: 0,
    rejected: 0,
    completed: 0
  });

  const { accessToken, decodedToken } = useAccessToken();

  useEffect(() => {
    if (effectRan.current === false) {
      const fetchStatistics = async () => {
        try {
          if (accessToken && accessToken !== "") {
            const response = await axios.get(
              `/appointments/user/${decodedToken.UserInfo.id}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}` // Attach the token to the Authorization header
                }
              }
            );
            const appts = response.data;
            const fetchedStats = {
              pending: appts.filter((appt) => appt.status === "pending").length,
              rejected: appts.filter((appt) => appt.status === "rejected")
                .length,
              cancelled: appts.filter((appt) => appt.status === "cancelled")
                .length,
              completed: appts.filter((appt) => appt.status === "completed")
                .length,
              approved: appts.filter((appt) => appt.status === "approved")
                .length
            };
            setStatistics(fetchedStats);
          } else {
            console.log("No access token found");
          }
        } catch (error) {
          if (error.response && error.response.status === 401) {
            console.log(
              "Unauthorized: You need to log in or refresh your token"
            );
          } else {
            console.log(
              "An error occurred while fetching data:",
              error.message
            );
          }
        }
      };

      fetchStatistics();
      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  return (
    <section className="AdminHome w-full h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] overflow-scroll overflow-y-scroll">
      <h1 className="text-1xl font-bold text-[#1E1E1E] text-center my-3">
        Bienvenue sur votre espace patient
      </h1>

      <section className="statistics flex flex-row flex-wrap justify-around">
        <div className="statistic-card flex flex-col justify-center items-center bg-white rounded-lg shadow-lg p-4 m-4 shadow-blue-300">
          <h2 className="text-1xl font-bold">Consultations En cours</h2>
          <p className="text-1xl font-bold text-blue-500">
            {statistics.approved}
          </p>
        </div>

        <div className="statistic-card flex flex-col justify-center items-center bg-white rounded-lg shadow-lg p-4 m-4 shadow-green-300">
          <h2 className="text-1xl font-bold">Consultations Terminé</h2>
          <p className="text-1xl font-bold text-green-500">
            {statistics.completed}
          </p>
        </div>

        <div className="statistic-card flex flex-col justify-center items-center bg-white rounded-lg shadow-lg p-4 m-4 shadow-orange-300">
          <h2 className="text-1xl font-bold">Consultations en attente</h2>
          <p className="text-1xl font-bold text-orange-500">
            {statistics.pending}
          </p>
        </div>
        <div className="statistic-card flex flex-col justify-center items-center bg-white rounded-lg shadow-lg p-4 m-4 shadow-red-300">
          <h2 className="text-1xl font-bold">Consultations rejetée</h2>
          <p className="text-1xl font-bold text-red-500">
            {statistics.rejected}
          </p>
        </div>

        <div className="statistic-card flex flex-col justify-center items-center bg-white rounded-lg shadow-lg p-4 m-4 shadow-red-300">
          <h2 className="text-1xl font-bold">Consultations Annulée</h2>
          <p className="text-1xl font-bold text-red-500">
            {statistics.cancelled}
          </p>
        </div>
      </section>
    </section>
  );
};

export default PatientHome;

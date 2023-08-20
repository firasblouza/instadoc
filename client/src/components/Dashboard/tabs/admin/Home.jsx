import { useState, useEffect, useRef } from "react";
import axios from "../../../../api/axios";

const Home = () => {
  const effectRan = useRef(false);
  const [statistics, setStatistics] = useState({
    patients: 0,
    consultations: 0,
    doctors: 0,
    labs: 0
  });

  useEffect(() => {
    if (effectRan.current === false) {
      const fetchStatistics = async () => {
        try {
          const accessToken = localStorage.getItem("accessToken");

          if (accessToken) {
            const response = await axios.get("/admin/statistics", {
              headers: {
                Authorization: `Bearer ${accessToken}` // Attach the token to the Authorization header
              }
            });

            setStatistics(response.data);
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
    <section className="admin-home w-full h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] overflow-scroll overflow-y-scroll">
      <h1 className="text-1xl font-bold text-[#1E1E1E] text-center my-3">
        Bienvenue sur votre espace administrateur
      </h1>
      <section className="statistics flex flex-row flex-wrap justify-around">
        <div className="statistic-card flex flex-col justify-center items-center bg-white rounded-lg shadow-lg p-4 m-4">
          <h2 className="text-1xl font-bold">Nombre de patients</h2>
          <p className="text-1xl font-bold">{statistics.patients}</p>
        </div>
        <div className="statistic-card flex flex-col justify-center items-center bg-white rounded-lg shadow-lg p-4 m-4">
          <h2 className="text-1xl font-bold">Nombre de consultations</h2>
          <p className="text-1xl font-bold">{statistics.consultations}</p>
        </div>
        <div className="statistic-card flex flex-col justify-center items-center bg-white rounded-lg shadow-lg p-4 m-4">
          <h2 className="text-1xl font-bold">Nombre de médecins</h2>
          <p className="text-1xl font-bold">{statistics.doctors}</p>
        </div>
        <div className="statistic-card flex flex-col justify-center items-center bg-white rounded-lg shadow-lg p-4 m-4">
          <h2 className="text-1xl font-bold">Nombre de laboratoires</h2>
          <p className="text-1xl font-bold">{statistics.labs}</p>
        </div>
      </section>
    </section>
  );
};

export default Home;

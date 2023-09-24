import { useEffect, useState, useRef } from "react";
import { FaSync } from "react-icons/fa";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { doctorSpecialties } from "../data/data";
import { capitalize } from "../utils/Capitalize";
import { useNavigate } from "react-router-dom";

import axios from "../api/axios";

import AvgRating from "./Profiles/AvgRating";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [initialDoctors, setInitialDoctors] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [star, setStar] = useState(0);
  const [avgRating, setAvgRating] = useState(0);

  // const IMG_URL = "http://localhost:3500/uploads/";
  const IMG_URL = "https://instadoc-server.vercel.app/uploads/";

  const effectRan = useRef(false);
  const navigate = useNavigate();

  const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) {
      return 0; // Handle the case where there are no ratings.
    }

    const sumOfRatings = ratings.reduce(
      (total, rating) => total + rating.rating,
      0
    );
    return sumOfRatings / ratings.length;
  };

  // Function to fetch the doctors

  const fetchDoctors = async () => {
    setDoctors([]);
    try {
      const response = await axios.get("/doctors");
      const approvedDoctors = response.data.filter(
        (doctor) => doctor.verifiedStatus === "approved"
      );

      // Create an array to store promises for fetching ratings for each doctor
      const fetchRatingsPromises = approvedDoctors.map(async (doctor) => {
        const docRatings = await axios.get(`/ratings/doctor/${doctor._id}`);
        const avgRating = calculateAverageRating(docRatings.data);
        return {
          ...doctor,
          rating: avgRating // Add the ratings to the doctor object
        };
      });

      // Wait for all promises to resolve
      const doctorsWithRatings = await Promise.all(fetchRatingsPromises);

      setDoctors(doctorsWithRatings);
      setInitialDoctors(response.data);
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

  const handleSearch = (e) => {
    const searchString = e.target.value.toLowerCase().trim(); // Convert the search string to lowercase and remove trailing spaces
    setSearch(searchString); // Update the search state

    if (searchString === "") {
      setDoctors(initialDoctors);
    } else {
      setDoctors(
        initialDoctors.filter(
          (doctor) =>
            doctor.firstName.toLowerCase().includes(searchString) ||
            doctor.lastName.toLowerCase().includes(searchString) ||
            `${doctor.firstName} ${doctor.lastName}`
              .toLowerCase()
              .includes(searchString)
        )
      );
    }
  };

  const handleReset = () => {
    setSearch("");
    setDoctors(initialDoctors);
    const searchField = document.getElementById("searchMedecin");
    searchField.value = "";
    const specialityField = document.getElementById("speciality");
    specialityField.value = "all";
  };

  const handleFilter = async (e) => {
    await fetchDoctors();

    if (e.target.value === "all") {
      return; // No need to further filter for "all" option
    }

    setDoctors(
      initialDoctors.filter((doctor) => doctor.speciality === e.target.value)
    );
  };

  const fetchRatings = async (doctorId) => {
    try {
      if (docRatings && docRatings.data.length > 0) {
        const docAvgRating = calculateAverageRating(docRatings.data);
        setAvgRating(docAvgRating);
        return docAvgRating;
      } else {
        return 0;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="consultDoctor w-full min-h-screen flex flex-col items-center pt-10">
      <div className="w-full h-auto flex flex-col justify-start items-center gap-5">
        <h1 className="text-2xl font-bold text-center md:text-left">
          Consulter un médecin
        </h1>
        <div className="flex flex-col items-center justify-center w-full">
          <div className="flex flex-row justify-center items-center w-full md:px-16 mb-5">
            {/* Main Container */}
            <div className="mainContainer border w-full flex flex-col bg-white rounded-lg shadow-lg p-4 m-4 overflow-x-scroll lg:overflow-x-hidden overflow-y-auto min-h-screen">
              <div className="flex flex-col md:flex-row w-full justify-between items-center gap-10 mb-5">
                {/* Search Field */}

                <input
                  type="text"
                  id="searchMedecin"
                  name="searchMedecin"
                  placeholder="Rechercher un médecin"
                  className="border border-gray-300 rounded-lg py-1 px-2 w-full md:w-1/2 outline-none"
                  onChange={(e) => handleSearch(e)}
                />

                {/* Filter By Speciality Select */}

                <select
                  name="speciality"
                  id="speciality"
                  className="border border-gray-300 rounded-lg py-1 px-2 w-full md:w-1/2"
                  onChange={(e) => handleFilter(e)}
                >
                  <option value="all">Toutes les spécialités</option>
                  {doctorSpecialties.map((speciality, index) => (
                    <option key={index} value={speciality.value}>
                      {speciality.name}
                    </option>
                  ))}
                </select>

                {/* Reset Button */}
                <FaSync
                  className="cursor-pointer text-xl text-blue-500"
                  onClick={handleReset}
                />
              </div>
              {/* Doctors Area Made with Grids*/}
              <div className="doctorsArea grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {doctors.map((doctor, index) => (
                  <div
                    key={index}
                    className="doctorCard   rounded-lg p-2 flex flex-col justify-center items-center shadow-lg py-3"
                  >
                    <img
                      src={`${IMG_URL}${doctor.profileImage}`}
                      alt={`${doctor.firstName} ${doctor.lastName}`}
                      className="max-w-5/6 h-[270px] rounded-lg "
                    />
                    <h1 className="text-xl font-bold my-1 text-[#1E1E1E]">
                      {doctor.firstName} {doctor.lastName}
                    </h1>
                    <h2 className="text-lg font-semibold">
                      {capitalize(doctor.speciality)}
                    </h2>
                    {/* Add 5 rating stars  */}

                    <div className="flex flex-row justify-center items-center my-2 gap-1">
                      <AvgRating rating={doctor.rating} />
                    </div>
                    <button
                      className="bg-blue-500 w-5/6 text-white rounded-lg px-2 py-1 mt-2"
                      onClick={() => navigate(`/doctor/${doctor._id}`)}
                    >
                      Voir le profile
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Doctors;

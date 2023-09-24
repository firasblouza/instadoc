import { useState, useEffect, useRef, useContext } from "react";
import {
  FaTrashAlt,
  FaEye,
  FaEdit,
  FaSync,
  FaFilter,
  FaPlus
} from "react-icons/fa";

import Modal from "./Dashboard/UI/Modal";
import Input from "./Input";

import axios from "../api/axios";
import jwt_decode from "jwt-decode";
import AuthContext from "../context/AuthContext";

const Labs = () => {
  const [labs, setLabs] = useState([]);
  const [initialLabs, setInitialLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const { API_URL } = useContext(AuthContext);
  const IMG_URL = `${API_URL}/uploads/`;

  const effectRan = useRef(false);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showModal]);
  // Function to fetch the labs.

  const fetchLabs = async () => {
    setLabs([]); // Empty the labs array
    try {
      const response = await axios.get("/labs/");
      if (response.status === 200) {
        setLabs(response.data);
        setInitialLabs(response.data);
        setLabsNumber(response.data.length);
      }
    } catch (err) {
      if (err?.response) {
        console.log(err.response.data);
      }
    }
  };

  const handleSearch = (e) => {
    const searchString = e.target.value.toLowerCase(); // Convert the search string to lowercase
    setSearch(searchString); // Update the search state

    if (searchString === "") {
      setLabs(initialLabs);
    } else {
      setLabs(
        initialLabs.filter(
          (lab) =>
            lab.name.toLowerCase().includes(searchString) ||
            lab.address.location.toLowerCase().includes(searchString) ||
            lab.contact.email.toLowerCase().includes(searchString) ||
            lab.contact.phoneNumber.includes(searchString)
        )
      );
    }
  };

  const handleFilter = (e) => {
    const city = e.target.value;
    if (city === "all") {
      if (search === "") {
        setLabs(initialLabs); // No search input, show all labs
      } else {
        // Apply search filter on the initialLabs and then filter by city
        const searchFilteredLabs = initialLabs.filter(
          (lab) =>
            lab.name.toLowerCase().includes(search) ||
            lab.address.location.toLowerCase().includes(search) ||
            lab.contact.email.toLowerCase().includes(search) ||
            lab.contact.phoneNumber.includes(search)
        );
        setLabs(searchFilteredLabs);
      }
    } else {
      // Filter by city, but only within the current labs state (search-filtered)
      setLabs(labs.filter((lab) => lab.address.city === city));
    }
  };

  const handleReset = () => {
    fetchLabs();
    setSearch("");
  };

  useEffect(() => {
    if (effectRan.current === false) {
      fetchLabs();
    }
    return () => {
      effectRan.current = true;
    };
  }, []);

  return (
    <section className="consultLabs w-full min-h-screen flex flex-col items-center pt-10">
      <div className="w-full h-auto flex flex-col justify-start items-center gap-5">
        <h1 className="text-2xl font-bold text-center md:text-left">
          Laboratoires
        </h1>
        <div className="flex flex-col items-center justify-center w-full">
          <div className="flex flex-row justify-center items-center w-full md:px-16 mb-5">
            {/* Main Container */}
            <div className="mainContainer  w-full flex flex-col bg-white rounded-lg shadow-lg p-4 m-4 overflow-x-scroll lg:overflow-x-hidden overflow-y-auto min-h-screen ">
              <div className="flex flex-col md:flex-row w-full justify-between items-center gap-10 mb-5 ">
                {/* Search Field */}

                <input
                  type="text"
                  id="searchMedecin"
                  name="searchMedecin"
                  value={search}
                  placeholder="Rechercher un laboratoire"
                  className="border border-gray-300 rounded-lg py-1 px-2 w-full md:w-1/2 outline-none"
                  onChange={(e) => handleSearch(e)}
                />

                {/* Filter By City Select */}

                <select
                  name="city"
                  id="city"
                  className="border border-gray-300 rounded-lg py-1 px-2 w-full md:w-1/2"
                  onChange={(e) => handleFilter(e)}
                >
                  <option value="all">Toutes les villes</option>
                  {[...new Set(labs.map((lab) => lab.address.city))].map(
                    (city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    )
                  )}
                </select>

                {/* Reset Button */}
                <FaSync
                  className="cursor-pointer text-xl text-blue-500"
                  onClick={handleReset}
                />
              </div>
              <div className="overflow-x-auto">
                <table className="table-auto border-collapse w-full rounded-lg">
                  <thead className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                    <tr className="text-center">
                      <th className=" px-4 py-2">Nom</th>
                      <th className=" px-4 py-2">Adresse</th>
                      <th className=" px-4 py-2">Ville</th>
                      <th className=" px-4 py-2">Téléphone</th>
                      <th className=" px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labs.length === 0 && (
                      <tr className="text-gray-700 border-b border-gray-200">
                        <td
                          colSpan="5"
                          className="px-4 py-3 text-ms font-semibold border text-center"
                        >
                          Aucun laboratoire trouvé
                        </td>
                      </tr>
                    )}
                    {labs.map((lab, index) => (
                      <tr
                        className="text-center text-gray-700 border-b border-gray-200"
                        key={index}
                      >
                        <td className="border px-4 py-2">{lab.name}</td>
                        <td className="border px-4 py-2">
                          {lab.address.location}
                        </td>
                        <td className="border px-4 py-2">{lab.address.city}</td>
                        <td className="border px-4 py-2">
                          {lab.contact.phoneNumber}
                        </td>
                        <td className="border text-center  px-4 py-2 w-1/12 ">
                          <FaEye
                            className="cursor-pointer text-xl text-blue-500 inline-block"
                            onClick={() => {
                              setSelectedLab(lab);
                              setShowModal(true);
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {showModal && (
                  <Modal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    title={"Laboratoire"}
                    secondAction={() => setShowModal(false)}
                    secondButton="Fermer"
                  >
                    <div className="flex flex-col md:flex-row justify-center md:justify-between items-center md:items-start  gap-7 ">
                      <div className="flex flex-col w-full justify-center items-center md:w-1/3">
                        <img
                          src={`${IMG_URL}${selectedLab.labImage}`}
                          alt={`${selectedLab.name}`}
                          className="max-w-[200px] rounded-lg "
                        />
                      </div>
                      <div className="flex flex-col justify-center items-start w-2/3">
                        <h1 className="text-xl font-bold my-1 text-[#1E1E1E]">
                          Nom :{" "}
                          <span className="font-normal">
                            {selectedLab.name}
                          </span>
                        </h1>
                        <h2 className="text-lg font-semibold">
                          Address :{" "}
                          <span className="font-normal">
                            {selectedLab.address.location}
                          </span>
                        </h2>
                        <h2 className="text-lg font-semibold">
                          Ville :{" "}
                          <span className="font-normal">
                            {selectedLab.address.city}
                          </span>
                        </h2>
                        <h2 className="text-lg font-semibold">
                          Téléphone :{" "}
                          <span className="font-normal">
                            {selectedLab.contact.phoneNumber}
                          </span>
                        </h2>
                        <h2 className="text-lg font-semibold">
                          Email :{" "}
                          <span className="font-normal">
                            {selectedLab.contact.email}
                          </span>
                        </h2>
                      </div>
                    </div>
                  </Modal>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Labs;

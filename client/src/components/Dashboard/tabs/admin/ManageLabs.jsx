import { useState, useEffect, useRef } from "react";
import {
  FaTrashAlt,
  FaEye,
  FaEdit,
  FaSync,
  FaFilter,
  FaPlus,
  FaUpload
} from "react-icons/fa";

import Modal from "../../UI/Modal";
import Input from "../../../Input";

import axios from "../../../../api/axios";
import jwt_decode from "jwt-decode";

import useAccessToken from "../../../../hooks/useAccessToken";

const ManageLabs = () => {
  const [labs, setLabs] = useState([]);
  const [initialLabs, setInitialLabs] = useState([]);
  const [labsNumber, setLabsNumber] = useState([]);
  const [selectedLab, setSelectedLab] = useState({});
  const [newLab, setNewLab] = useState({
    name: "",
    contact: {
      email: "",
      phoneNumber: ""
    },
    address: {
      location: "",
      city: ""
    }
  });

  const [addFile, setAddFile] = useState(null);
  const [editFile, setEditFile] = useState(null);

  const [search, setSearch] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [modifyStatus, setModifyStatus] = useState({
    message: "",
    error: false
  });

  useEffect(() => {
    if (showAddModal || showEditModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showAddModal, showEditModal]);

  // const IMG_URL = "http://localhost:3500/uploads/";
  const IMG_URL = "https://instadoc-server.vercel.app/uploads/";
  const IMG_Placeholder = "imagePlaceholder.png";

  const effectRan = useRef(false);

  // Function to fetch the labs.

  const fetchLabs = async () => {
    setLabs([]); // Empty the labs array
    try {
      const { accessToken } = useAccessToken();
      if (accessToken && accessToken !== "") {
        const response = await axios.get("/labs/", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        if (response.status === 200) {
          setLabs(response.data);
          setInitialLabs(response.data);
          setLabsNumber(response.data.length);
        }
      }
    } catch (err) {
      if (err?.response) {
        console.log(err.response.data);
      }
    }
  };

  useEffect(() => {
    if (effectRan.current === false) {
      fetchLabs();
    }
    return () => {
      effectRan.current = true;
    };
  }, []);

  // Lab Search
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

  const addLab = async () => {
    try {
      const { accessToken } = useAccessToken();
      if (accessToken && accessToken !== "") {
        const formData = new FormData();
        formData.append("lab", JSON.stringify(newLab));
        if (addFile) {
          formData.append("labImage", addFile);
        }
        const response = await axios.post("/labs/add", formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          "Content-Type": "multipart/form-data"
        });
        if (response.status === 200) {
          fetchLabs();
          setShowAddModal(false);
          window.alert("Labo ajouté avec succès");
          setNewLab({
            name: "",
            contact: {
              email: "",
              phoneNumber: ""
            },
            address: {
              location: "",
              city: ""
            }
          });
        }
      }
    } catch (err) {
      if (err?.response) {
        window.alert(err.response.data.message);
      }
    }
  };

  const deleteLab = async (id) => {
    try {
      const { accessToken } = useAccessToken();
      if (accessToken && accessToken !== "") {
        const response = await axios.delete(`/labs/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        if (response.status === 200) {
          fetchLabs();
          window.alert("Labo supprimé avec succès");
        }
      }
    } catch (err) {
      if (err?.response) {
        window.alert(err.response.data.message);
      }
    }
  };

  // View and Modify Lab

  const handleShowLab = (lab) => {
    setSelectedLab(lab);
    setEditFile(null);
    setModifyStatus({
      message: "",
      error: false
    });
    setShowEditModal(true);
  };

  // Edit Lab

  const editLab = async () => {
    try {
      if (
        !selectedLab.name ||
        !selectedLab.contact.email ||
        !selectedLab.contact.phoneNumber ||
        !selectedLab.address.location ||
        !selectedLab.address.city
      ) {
        setModifyStatus({
          message: "Tous les champs sont obligatoires",
          error: true
        });
        return;
      }

      const { accessToken } = useAccessToken();
      if (accessToken && accessToken !== "") {
        const formData = new FormData();
        formData.append("lab", JSON.stringify(selectedLab));
        if (editFile) {
          formData.append("labImage", editFile);
        }
        const response = await axios.put(
          `/labs/edit/${selectedLab._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "multipart/form-data"
            }
          }
        );
        if (response.status === 200) {
          fetchLabs();
          setShowEditModal(false);
          setModifyStatus({
            message: "Labo modifié avec succès",
            error: false
          });
          window.alert("Labo modifié avec succès");
        }
      } else {
        setModifyStatus({
          message: "Vous n'êtes pas autorisé à effectuer cette action",
          error: true
        });
      }
    } catch (err) {
      if (err?.response) {
        window.alert(err.response.data.message);
      }
    }
  };

  return (
    <section className="admin-manage-labs  w-full h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] overflow-scroll overflow-y-scroll">
      <div className="flex flex-row justify-center items-center w-full px-4 py-2">
        <div className="flex flex-col w-full items-center">
          <h1 className="text-1xl font-bold text-[#1E1E1E] text-center my-3">
            Gestion des Laboratoires
          </h1>
          <div className="flex flex-col justify-center items-center bg-white rounded-lg w-1/3 shadow-lg p-4 m-4 ">
            <h2 className="text-1xl font-bold">Nombre de Laboratoires</h2>
            <p className="text-1xl font-bold">{labsNumber}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center w-full px-4 py-2">
        <div className="flex flex-row justify-center items-center w-full">
          <div className="flex flex-col bg-white rounded-lg shadow-lg p-4 m-4 overflow-x-scroll lg:overflow-x-hidden">
            <div className="flex w-full justify-between gap-10 mb-5">
              {/* Search Field */}

              <input
                type="text"
                placeholder="Rechercher un médecin"
                className="border border-gray-300 rounded-lg py-1 px-2 w-1/2"
                onChange={(e) => handleSearch(e)}
              />

              {/* Filter By Speciality Select */}

              <div className="actions flex flex-row gap-10">
                <FaPlus
                  className="text-green-500 cursor-pointer"
                  onClick={() => setShowAddModal(true)}
                />

                {/* Add a Lab Modal */}

                {showAddModal && (
                  <Modal
                    showModal={showAddModal}
                    setShowModal={setShowAddModal}
                    title={"Ajouter un laboratoire"}
                    firstAction={addLab}
                    firstButton={"Ajouter"}
                    secondAction={() => setShowAddModal(false)}
                    secondButton={"Annuler"}
                  >
                    <div className="flex flex-col justify-center">
                      <div className="flex flex-col md:flex-row md:items-start items-center">
                        <div className="flex flex-col gap-5 items-center md:items-start md:w-1/2">
                          <label
                            htmlFor="labName"
                            className="text-base font-semi text-[#1E1E1E] -mb-5 px-3"
                          >
                            Nom du laboratoire
                          </label>
                          <Input
                            type="text"
                            name="labName"
                            id="labName"
                            placeholder="Nom du laboratoire"
                            value={newLab.name}
                            onChange={(e) =>
                              setNewLab({ ...newLab, name: e.target.value })
                            }
                            required={true}
                          />
                          <label
                            htmlFor="labEmail"
                            className="text-base font-semi text-[#1E1E1E] -mb-5 px-3"
                          >
                            Email du laboratoire
                          </label>
                          <Input
                            type="email"
                            name="labEmail"
                            id="labEmail"
                            placeholder="Email du laboratoire"
                            value={newLab.contact.email}
                            onChange={(e) =>
                              setNewLab({
                                ...newLab,
                                contact: {
                                  ...newLab.contact,
                                  email: e.target.value
                                }
                              })
                            }
                            required={true}
                          />
                          <label
                            htmlFor="labPhoneNumber"
                            className="text-base font-semi text-[#1E1E1E] -mb-5 px-3"
                          >
                            Numéro de téléphone du laboratoire
                          </label>
                          <Input
                            type="text"
                            name="labPhoneNumber"
                            id="labPhoneNumber"
                            placeholder="Téléphone"
                            value={newLab.contact.phoneNumber}
                            onChange={(e) =>
                              setNewLab({
                                ...newLab,
                                contact: {
                                  ...newLab.contact,
                                  phoneNumber: e.target.value
                                }
                              })
                            }
                            required={true}
                          />
                          <label
                            htmlFor="labLocation"
                            className="text-base font-semi text-[#1E1E1E] -mb-5 px-3"
                          >
                            Adresse du laboratoire
                          </label>
                          {/* City & Location Inputs */}
                          <div className="flex flex-col md:flex-row gap-3">
                            <Input
                              type="text"
                              name="labCity"
                              id="labCity"
                              placeholder="Ville"
                              value={newLab.address.city}
                              onChange={(e) =>
                                setNewLab({
                                  ...newLab,
                                  address: {
                                    ...newLab.address,
                                    city: e.target.value
                                  }
                                })
                              }
                              required={true}
                              size={"w-full md:w-1/2"}
                            />
                            <Input
                              type="text"
                              name="labLocation"
                              id="labLocation"
                              placeholder="Adresse"
                              value={newLab.address.location}
                              onChange={(e) =>
                                setNewLab({
                                  ...newLab,
                                  address: {
                                    ...newLab.address,
                                    location: e.target.value
                                  }
                                })
                              }
                              required={true}
                              size={"w-full"}
                            />
                          </div>
                        </div>

                        {/* Add Lab Image */}

                        <div className="flex flex-col justify-start items-center w-full md:w-1/2 mt-3 md:mt-0">
                          <img
                            src={
                              addFile
                                ? URL.createObjectURL(addFile)
                                : `${IMG_URL}${IMG_Placeholder}`
                            }
                            alt="Labo"
                            className="w-60 h-60 object-cover"
                          />

                          {/* Upload Button */}

                          <div className="labUpload bg-transparent  h-8 rounded-full my-3 flex justify-center items-center  gap-6 px-3 flex-row w-full">
                            <button
                              type="button"
                              className="relative overflow-hidden bg-blue-400 hover:bg-blue-300 cursor-pointer max-w-[120px] w-full h-8 text-white font-bold text-[16px] px-1 rounded-md my-3 flex justify-center items-center"
                            >
                              <FaUpload className="mr-2 cursor-pointer" />
                              Upload
                              <input
                                type="file"
                                accept="image/*"
                                name="labImage"
                                className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer transform scale-[3]"
                                placeholder="Lab Image"
                                onChange={(e) => setAddFile(e.target.files[0])}
                              />
                            </button>

                            <p className="text-[12px] text-gray-400">
                              {addFile ? addFile.name : "No file chosen"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Modal>
                )}

                <FaSync className="cursor-pointer" onClick={fetchLabs} />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead>
                  <tr className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                    <th className="px-4 py-3">Nom</th>
                    <th className="px-4 py-3">Adresse</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Téléphone</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
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
                      key={index}
                      className="text-gray-700 border-b border-gray-200"
                    >
                      <td className="px-4 py-3 text-ms font-semibold border">
                        {lab.name}
                      </td>
                      <td className="px-4 py-3 text-ms font-semibold border">
                        {lab.address.location}
                      </td>
                      <td className="px-4 py-3 text-ms font-semibold border">
                        {lab.contact.email}
                      </td>
                      <td className="px-4 py-3 text-ms font-semibold border">
                        {lab.contact.phoneNumber}
                      </td>
                      <td className="px-4 py-3 text-ms font-semibold border">
                        <div className="flex flex-row justify-center items-center">
                          <FaEye
                            className="text-blue-500 cursor-pointer mx-2"
                            onClick={() => handleShowLab(lab)}
                          />
                          <FaEdit
                            className="text-green-500 cursor-pointer mx-2"
                            onClick={() => handleShowLab(lab)}
                          />
                          <FaTrashAlt
                            className="text-red-500 cursor-pointer mx-2"
                            onClick={() => deleteLab(lab._id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Edit Lab Modal */}

              {showEditModal && (
                <Modal
                  title={"Modifier le laboratoire"}
                  showModal={showEditModal}
                  setShowModal={setShowEditModal}
                  firstAction={() => editLab()}
                  firstButton={"Modifier"}
                  secondAction={() => setShowEditModal(false)}
                  secondButton={"Annuler"}
                >
                  <div className="flex flex-row w-full justify-center py-3 ">
                    <p
                      className={`${
                        modifyStatus.error ? "text-red-500" : "text-green-500"
                      } text-center`}
                    >
                      {modifyStatus.message}
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-start items-center  w-full">
                    <div className="flex flex-col gap-3 w-full md:w-1/2 ">
                      <label
                        htmlFor="labName"
                        className="text-base font-semi text-[#1E1E1E] -mb-5 px-3"
                      >
                        Nom du laboratoire
                      </label>
                      <Input
                        type="text"
                        name="labName"
                        id="labName"
                        placeholder="Nom du laboratoire"
                        value={selectedLab.name}
                        onChange={(e) =>
                          setSelectedLab({
                            ...selectedLab,
                            name: e.target.value
                          })
                        }
                        required={true}
                      />
                      <label
                        htmlFor="labEmail"
                        className="text-base font-semi text-[#1E1E1E] -mb-5 px-3"
                      >
                        Email du laboratoire
                      </label>
                      <Input
                        type="email"
                        name="labEmail"
                        id="labEmail"
                        placeholder="Email"
                        value={selectedLab.contact.email}
                        onChange={(e) =>
                          setSelectedLab({
                            ...selectedLab,
                            contact: {
                              ...selectedLab.contact,
                              email: e.target.value
                            }
                          })
                        }
                        required={true}
                      />
                      <label
                        htmlFor="labPhoneNumber"
                        className="text-base font-semi text-[#1E1E1E] -mb-5 px-3"
                      >
                        Téléphone du laboratoire
                      </label>
                      <Input
                        type="text"
                        name="labPhoneNumber"
                        id="labPhoneNumber"
                        placeholder="Téléphone"
                        value={selectedLab.contact.phoneNumber}
                        onChange={(e) =>
                          setSelectedLab({
                            ...selectedLab,
                            contact: {
                              ...selectedLab.contact,
                              phoneNumber: e.target.value
                            }
                          })
                        }
                        required={true}
                      />
                      <label
                        htmlFor="labCity"
                        className="text-base font-semi text-[#1E1E1E] -mb-5 px-3"
                      >
                        Ville du laboratoire
                      </label>
                      <Input
                        type="text"
                        name="labCity"
                        id="labCity"
                        placeholder="Ville"
                        value={selectedLab.address.city}
                        onChange={(e) =>
                          setSelectedLab({
                            ...selectedLab,
                            address: {
                              ...selectedLab.address,
                              city: e.target.value
                            }
                          })
                        }
                        required={true}
                      />
                      <label
                        htmlFor="labLocation"
                        className="text-base font-semi text-[#1E1E1E] -mb-5 px-3"
                      >
                        Adresse du laboratoire
                      </label>
                      <Input
                        type="text"
                        name="labLocation"
                        id="labLocation"
                        placeholder="Adresse"
                        value={selectedLab.address.location}
                        onChange={(e) =>
                          setSelectedLab({
                            ...selectedLab,
                            address: {
                              ...selectedLab.address,
                              location: e.target.value
                            }
                          })
                        }
                        required={true}
                      />
                    </div>

                    {/* Edit Lab Image */}

                    <div className="flex flex-col justify-start items-center w-full md:w-1/2 mt-3 md:mt-0">
                      <img
                        src={
                          editFile
                            ? URL.createObjectURL(editFile)
                            : selectedLab.labImage
                            ? `${IMG_URL}${selectedLab.labImage}`
                            : `${IMG_URL}${IMG_Placeholder}`
                        }
                        alt="Labo"
                        className="w-60 h-60 object-cover"
                      />

                      {/* Upload Button */}

                      <div className="labUpload bg-transparent  h-8 rounded-full my-3 flex justify-center items-center  gap-6 px-3 flex-row w-full">
                        <button
                          type="button"
                          className="relative overflow-hidden bg-blue-400 hover:bg-blue-300 cursor-pointer max-w-[120px] w-full h-8 text-white font-bold text-[16px] px-1 rounded-md my-3 flex justify-center items-center"
                        >
                          <FaUpload className="mr-2 cursor-pointer" />
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            name="labImage"
                            className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer transform scale-[3]"
                            placeholder="Lab Image"
                            onChange={(e) => {
                              setEditFile(e.target.files[0]);
                              console.log(editFile);
                            }}
                          />
                        </button>

                        <p className="text-[12px] text-gray-400">
                          {editFile ? editFile.name : "No file chosen"}
                        </p>
                      </div>
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

export default ManageLabs;

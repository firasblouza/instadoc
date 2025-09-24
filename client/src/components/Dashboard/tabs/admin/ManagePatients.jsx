import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { FaTrashAlt, FaEye, FaEdit, FaSync, FaUser, FaSearch, FaEnvelope, FaPhone, FaCalendarAlt, FaUpload } from "react-icons/fa";
import axios from "../../../../api/axios";
import useAccessToken from "../../../../hooks/useAccessToken";
import AuthContext from "../../../../context/AuthContext";
import MedicalLoader from "../../../MedicalLoader";
import LoadingButton from "../../../LoadingButton";

const ManagePatients = () => {
  const effectRan = useRef(false);
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [uploadedProfile, setUploadedProfile] = useState(null);

  const { accessToken } = useAccessToken();
  const { API_URL } = useContext(AuthContext);
  const IMG_URL = `${API_URL}/uploads/`;

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      if (accessToken) {
        const response = await axios.get("/admin/patients", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        const fetchedPatients = response.data.filter(
          (patient) => patient.role === "user"
        );
        setPatients(fetchedPatients);
        setFilteredPatients(fetchedPatients);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (effectRan.current === false) {
      fetchPatients();
    }
    return () => {
      effectRan.current = true;
    };
  }, [fetchPatients]);

  // Search functionality
  useEffect(() => {
    const filtered = patients.filter(patient =>
      patient.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [patients, searchTerm]);

  const formatDate = (dateString) => {
    if (!dateString) return "Non définie";
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setShowDetailsModal(true);
  };

  const handleEdit = (patient) => {
    setSelectedPatient({...patient});
    setUploadedProfile(null);
    setShowEditModal(true);
  };

  const handleDeleteClick = (patient) => {
    setSelectedPatient(patient);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPatient) return;
    
    try {
      setActionLoading(true);
      await axios.delete(`/admin/patient/${selectedPatient._id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      await fetchPatients();
      setShowDeleteModal(false);
      setSelectedPatient(null);
    } catch (error) {
      console.error("Error deleting patient:", error);
      alert("Erreur lors de la suppression du patient");
    } finally {
      setActionLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedProfile(file);
    }
  };

  const handleEditSave = async () => {
    if (!selectedPatient) return;
    
    try {
      setActionLoading(true);
      
      const patientData = {
        firstName: selectedPatient.firstName,
        lastName: selectedPatient.lastName,
        email: selectedPatient.email,
        phoneNumber: selectedPatient.phoneNumber,
        dateOfBirth: selectedPatient.dateOfBirth
      };

      console.log("Patient data to update:", patientData);
      console.log("Uploaded profile file:", uploadedProfile);

      // Always use FormData to match backend expectations
      const formData = new FormData();
      formData.append("user", JSON.stringify(patientData));
      
      if (uploadedProfile) {
        formData.append("profileImage", uploadedProfile);
        console.log("Profile image added to FormData");
      }

      console.log("Sending request to:", `/admin/patient/${selectedPatient._id}`);

      const response = await axios.put(`/admin/patient/${selectedPatient._id}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data"
        }
      });

      console.log("Update response:", response.data);
      
      await fetchPatients();
      setShowEditModal(false);
      setSelectedPatient(null);
      setUploadedProfile(null);
    } catch (error) {
      console.error("Error updating patient:", error);
      console.error("Error response:", error.response?.data);
      alert("Erreur lors de la modification du patient");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-60px)] flex items-center justify-center">
        <MedicalLoader type="heartbeat" />
      </div>
    );
  }

  return (
    <section className="w-full bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sky-600 text-sm font-medium mb-4">
            <FaUser className="mr-2" />
            Gestion des Patients
          </div>
          <h1 className="heading-1 text-neutral-900 mb-2">
            Gestion des{' '}
            <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
              patients
            </span>
          </h1>
          <p className="body-large text-neutral-600 max-w-2xl mx-auto">
            Gérez les informations et profils des patients
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card-hover border-l-4 border-sky-500">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Total Patients</p>
                  <p className="text-2xl font-bold text-neutral-900">{patients.length}</p>
                </div>
                <FaUser className="text-sky-500 text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="card-hover border-l-4 border-green-500">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Patients Actifs</p>
                  <p className="text-2xl font-bold text-neutral-900">{patients.length}</p>
                </div>
                <FaUser className="text-green-500 text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="card-hover border-l-4 border-blue-500">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Nouveaux ce mois</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {patients.filter(p => {
                      const createdAt = new Date(p.createdAt);
                      const now = new Date();
                      return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
                <FaCalendarAlt className="text-blue-500 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="card mb-6">
          <div className="card-body">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un patient..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                </div>
              </div>
              
              <button
                onClick={fetchPatients}
                className="btn-primary px-6 py-3 flex items-center gap-2"
              >
                <FaSync />
                Actualiser
              </button>
            </div>
          </div>
        </div>

        {/* Patients List */}
        <div className="card overflow-hidden">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-12">
              <FaUser className="text-neutral-300 text-6xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-600 mb-2">
                {patients.length === 0 ? "Aucun patient trouvé" : "Aucun résultat"}
              </h3>
              <p className="text-neutral-500">
                {patients.length === 0 
                  ? "Aucun patient n&apos;est encore inscrit" 
                  : "Essayez de modifier votre recherche"
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {filteredPatients.map((patient) => (
                <div key={patient._id} className="p-6 hover:bg-neutral-50 transition-all duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-neutral-200 flex-shrink-0">
                        {patient.profileImage ? (
                          <img
                            src={`${IMG_URL}${patient.profileImage}`}
                            alt={`${patient.firstName} ${patient.lastName}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div
                          className="w-full h-full bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center"
                          style={{ display: patient.profileImage ? 'none' : 'flex' }}
                        >
                          <FaUser className="text-sky-600 text-xl" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-neutral-900 truncate">
                            {patient.firstName} {patient.lastName}
                          </h3>
                          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Patient
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-neutral-600 mb-2">
                          <div className="flex items-center gap-2">
                            <FaEnvelope className="text-sky-500 flex-shrink-0" />
                            <span className="truncate">{patient.email}</span>
                          </div>
                          
                          {patient.phoneNumber && (
                            <div className="flex items-center gap-2">
                              <FaPhone className="text-sky-500 flex-shrink-0" />
                              <span>{patient.phoneNumber}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-sky-500 flex-shrink-0" />
                            <span>Inscrit: {formatDate(patient.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                      <button
                        onClick={() => handleViewDetails(patient)}
                        className="btn-secondary px-4 py-2 font-medium flex items-center justify-center gap-2"
                      >
                        <FaEye />
                        <span className="hidden sm:inline">Voir détails</span>
                        <span className="sm:hidden">Détails</span>
                      </button>

                      <button
                        onClick={() => handleEdit(patient)}
                        className="btn-primary px-4 py-2 font-medium flex items-center justify-center gap-2"
                      >
                        <FaEdit />
                        <span className="hidden sm:inline">Modifier</span>
                        <span className="sm:hidden">Modifier</span>
                      </button>
                      
                      <button
                        onClick={() => handleDeleteClick(patient)}
                        className="btn bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 px-4 py-2 font-medium flex items-center justify-center gap-2"
                      >
                        <FaTrashAlt />
                        <span className="hidden sm:inline">Supprimer</span>
                        <span className="sm:hidden">Supprimer</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Patient Details Modal */}
      {showDetailsModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Détails du Patient</h2>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedPatient(null);
                  }}
                  className="text-white/80 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 rounded-xl overflow-hidden border border-neutral-200 flex-shrink-0">
                  {selectedPatient.profileImage ? (
                    <img
                      src={`${IMG_URL}${selectedPatient.profileImage}`}
                      alt={`${selectedPatient.firstName} ${selectedPatient.lastName}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className="w-full h-full bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center"
                    style={{ display: selectedPatient.profileImage ? 'none' : 'flex' }}
                  >
                    <FaUser className="text-sky-600 text-3xl" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                    {selectedPatient.firstName} {selectedPatient.lastName}
                  </h3>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Patient
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                    <p className="text-neutral-900">{selectedPatient.email}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Téléphone</label>
                    <p className="text-neutral-900">{selectedPatient.phoneNumber || "Non renseigné"}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Date de naissance</label>
                    <p className="text-neutral-900">{formatDate(selectedPatient.dateOfBirth)}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Date d&apos;inscription</label>
                    <p className="text-neutral-900">{formatDate(selectedPatient.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Patient Modal */}
      {showEditModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Modifier le Patient</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedPatient(null);
                  }}
                  className="text-white/80 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Prénom</label>
                  <input
                    type="text"
                    value={selectedPatient.firstName || ''}
                    onChange={(e) => setSelectedPatient({...selectedPatient, firstName: e.target.value})}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Nom</label>
                  <input
                    type="text"
                    value={selectedPatient.lastName || ''}
                    onChange={(e) => setSelectedPatient({...selectedPatient, lastName: e.target.value})}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={selectedPatient.email || ''}
                    onChange={(e) => setSelectedPatient({...selectedPatient, email: e.target.value})}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={selectedPatient.phoneNumber || ''}
                    onChange={(e) => setSelectedPatient({...selectedPatient, phoneNumber: e.target.value})}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Date de naissance</label>
                  <input
                    type="date"
                    value={selectedPatient.dateOfBirth ? selectedPatient.dateOfBirth.substring(0, 10) : ''}
                    onChange={(e) => setSelectedPatient({...selectedPatient, dateOfBirth: e.target.value})}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                </div>
              </div>

              {/* Profile Image Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Photo de profil</label>
                <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center hover:border-sky-400 transition-colors">
                  {selectedPatient.profileImage || uploadedProfile ? (
                    <div className="space-y-3">
                      <img
                        src={
                          uploadedProfile
                            ? URL.createObjectURL(uploadedProfile)
                            : selectedPatient.profileImage
                            ? `${IMG_URL}${selectedPatient.profileImage}`
                            : `${IMG_URL}imagePlaceholder.png`
                        }
                        alt="Photo de profil"
                        className="mx-auto max-h-40 rounded-lg shadow-md"
                      />
                      <label className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 cursor-pointer transition-colors">
                        <FaUpload className="mr-2" />
                        Changer l&apos;image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="space-y-2">
                        <FaUpload className="mx-auto text-3xl text-neutral-400" />
                        <p className="text-neutral-600">Cliquez pour télécharger une photo</p>
                        <p className="text-sm text-neutral-400">PNG, JPG jusqu&apos;à 10MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-200">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedPatient(null);
                  }}
                  className="btn-secondary flex-1"
                  disabled={actionLoading}
                >
                  Annuler
                </button>
                <LoadingButton
                  onClick={handleEditSave}
                  isLoading={actionLoading}
                  className="btn-primary flex-1"
                >
                  {actionLoading ? "Enregistrement..." : "Enregistrer"}
                </LoadingButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">Confirmer la suppression</h3>
            <p className="text-neutral-600 mb-6">
              Êtes-vous sûr de vouloir supprimer le patient{' '}
              <strong>{selectedPatient.firstName} {selectedPatient.lastName}</strong> ?
              Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedPatient(null);
                }}
                className="flex-1 btn-secondary"
                disabled={actionLoading}
              >
                Annuler
              </button>
              <LoadingButton
                onClick={handleDeleteConfirm}
                isLoading={actionLoading}
                className="flex-1 btn bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
              >
                {actionLoading ? "Suppression..." : "Supprimer"}
              </LoadingButton>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ManagePatients;
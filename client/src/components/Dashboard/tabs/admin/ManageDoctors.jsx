import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { FaTrashAlt, FaEye, FaEdit, FaSync, FaUserMd, FaSearch, FaFilter, FaEnvelope, FaPhone, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";
import axios from "../../../../api/axios";
import useAccessToken from "../../../../hooks/useAccessToken";
import AuthContext from "../../../../context/AuthContext";
import MedicalLoader from "../../../MedicalLoader";
import LoadingButton from "../../../LoadingButton";

const ManageDoctors = () => {
  const effectRan = useRef(false);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(""); // "approve" or "reject"
  const [actionLoading, setActionLoading] = useState(false);

  const { accessToken } = useAccessToken();
  const { API_URL } = useContext(AuthContext);
  const IMG_URL = `${API_URL}/uploads/`;

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      if (accessToken) {
        const response = await axios.get("/admin/doctors", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setDoctors(response.data);
        setFilteredDoctors(response.data);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (effectRan.current === false) {
      fetchDoctors();
    }
    return () => {
      effectRan.current = true;
    };
  }, [fetchDoctors]);

  // Filter functionality
  useEffect(() => {
    let filtered = doctors;
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(doctor => doctor.verifiedStatus === statusFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredDoctors(filtered);
  }, [doctors, searchTerm, statusFilter]);

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-orange-100 text-orange-800 border-orange-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200"
    };
    return colors[status] || "bg-neutral-100 text-neutral-800 border-neutral-200";
  };

  const getStatusText = (status) => {
    const texts = {
      pending: "En attente",
      approved: "Approuvé",
      rejected: "Rejeté"
    };
    return texts[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Non définie";
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const handleViewDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDetailsModal(true);
  };

  const handleActionClick = (doctor, action) => {
    setSelectedDoctor(doctor);
    setActionType(action);
    setShowActionModal(true);
  };

  const handleActionConfirm = async () => {
    if (!selectedDoctor || !actionType) return;
    
    try {
      setActionLoading(true);
      const status = actionType === "approve" ? "approved" : "rejected";
      
      await axios.put(
        `/admin/doctor/${selectedDoctor._id}`,
        { verifiedStatus: status },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      await fetchDoctors();
      setShowActionModal(false);
      setSelectedDoctor(null);
      setActionType("");
    } catch (error) {
      console.error(`Error ${actionType}ing doctor:`, error);
    } finally {
      setActionLoading(false);
    }
  };

  // Calculate statistics
  const statistics = {
    total: doctors.length,
    pending: doctors.filter(doc => doc.verifiedStatus === "pending").length,
    approved: doctors.filter(doc => doc.verifiedStatus === "approved").length,
    rejected: doctors.filter(doc => doc.verifiedStatus === "rejected").length
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
            <FaUserMd className="mr-2" />
            Gestion des Médecins
          </div>
          <h1 className="heading-1 text-neutral-900 mb-2">
            Gestion des{' '}
            <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
              médecins
            </span>
          </h1>
          <p className="body-large text-neutral-600 max-w-2xl mx-auto">
            Approuvez et gérez les médecins de la plateforme
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card-hover border-l-4 border-sky-500">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Total</p>
                  <p className="text-2xl font-bold text-neutral-900">{statistics.total}</p>
                </div>
                <FaUserMd className="text-sky-500 text-2xl" />
              </div>
            </div>
          </div>

          <div className="card-hover border-l-4 border-orange-500">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">En attente</p>
                  <p className="text-2xl font-bold text-neutral-900">{statistics.pending}</p>
                </div>
                <FaHourglassHalf className="text-orange-500 text-2xl" />
              </div>
            </div>
          </div>

          <div className="card-hover border-l-4 border-green-500">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Approuvés</p>
                  <p className="text-2xl font-bold text-neutral-900">{statistics.approved}</p>
                </div>
                <FaCheckCircle className="text-green-500 text-2xl" />
              </div>
            </div>
          </div>

          <div className="card-hover border-l-4 border-red-500">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Rejetés</p>
                  <p className="text-2xl font-bold text-neutral-900">{statistics.rejected}</p>
                </div>
                <FaTimesCircle className="text-red-500 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card mb-6">
          <div className="card-body">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Rechercher un médecin..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
              </div>

              <div className="flex items-center gap-3">
                <FaFilter className="text-neutral-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-white"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="approved">Approuvés</option>
                  <option value="rejected">Rejetés</option>
                </select>
                
                <button
                  onClick={fetchDoctors}
                  className="btn-secondary flex items-center gap-2"
                >
                  <FaSync />
                  Actualiser
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Doctors List */}
        <div className="card overflow-hidden">
          {filteredDoctors.length === 0 ? (
            <div className="text-center py-12">
              <FaUserMd className="text-neutral-300 text-6xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-600 mb-2">
                {doctors.length === 0 ? "Aucun médecin trouvé" : "Aucun résultat"}
              </h3>
              <p className="text-neutral-500">
                {doctors.length === 0 
                  ? "Aucun médecin n'est encore inscrit sur la plateforme" 
                  : "Essayez de modifier vos filtres"
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {filteredDoctors.map((doctor) => (
                <div key={doctor._id} className="p-6 hover:bg-neutral-50 transition-all duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-neutral-200 flex-shrink-0">
                        <img
                          src={doctor.profileImage ? `${IMG_URL}${doctor.profileImage}` : `${API_URL}/imagePlaceholder.png`}
                          alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-neutral-900 truncate">
                            Dr. {doctor.firstName} {doctor.lastName}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(doctor.verifiedStatus)} w-fit`}>
                            {getStatusText(doctor.verifiedStatus)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-neutral-600 mb-2">
                          <div className="flex items-center gap-2">
                            <FaUserMd className="text-sky-500 flex-shrink-0" />
                            <span className="truncate">{doctor.specialty || 'Médecin généraliste'}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <FaEnvelope className="text-sky-500 flex-shrink-0" />
                            <span className="truncate">{doctor.email}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-sky-500 flex-shrink-0" />
                            <span>Inscrit: {formatDate(doctor.createdAt)}</span>
                          </div>
                        </div>
                        
                        {doctor.licenseNumber && (
                          <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg">
                            <strong className="text-neutral-800">Licence:</strong> {doctor.licenseNumber}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                      <button
                        onClick={() => handleViewDetails(doctor)}
                        className="btn-secondary px-4 py-2 font-medium flex items-center justify-center gap-2"
                      >
                        <FaEye />
                        <span className="hidden sm:inline">Voir détails</span>
                        <span className="sm:hidden">Détails</span>
                      </button>

                      {doctor.verifiedStatus === "pending" && (
                        <>
                          <button
                            onClick={() => handleActionClick(doctor, "approve")}
                            className="btn bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 px-4 py-2 font-medium flex items-center justify-center gap-2"
                          >
                            <FaCheckCircle />
                            <span className="hidden sm:inline">Approuver</span>
                            <span className="sm:hidden">Approuver</span>
                          </button>
                          <button
                            onClick={() => handleActionClick(doctor, "reject")}
                            className="btn bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 px-4 py-2 font-medium flex items-center justify-center gap-2"
                          >
                            <FaTimesCircle />
                            <span className="hidden sm:inline">Rejeter</span>
                            <span className="sm:hidden">Rejeter</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Doctor Details Modal */}
      {showDetailsModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Détails du Médecin</h2>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedDoctor(null);
                  }}
                  className="text-white/80 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Doctor Information */}
              <div className="flex items-center space-x-4 p-4 bg-sky-50 rounded-xl">
                <div className="w-20 h-20 rounded-xl overflow-hidden border border-neutral-200">
                  <img
                    src={selectedDoctor.profileImage ? `${IMG_URL}${selectedDoctor.profileImage}` : `${API_URL}/imagePlaceholder.png`}
                    alt={`Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900">
                    Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                  </h3>
                  <p className="text-neutral-600">{selectedDoctor.specialty || 'Médecin généraliste'}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedDoctor.verifiedStatus)} mt-2`}>
                    {getStatusText(selectedDoctor.verifiedStatus)}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="text-sky-600" />
                    <div>
                      <p className="text-sm text-neutral-500">Email</p>
                      <p className="font-semibold">{selectedDoctor.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaPhone className="text-sky-600" />
                    <div>
                      <p className="text-sm text-neutral-500">Téléphone</p>
                      <p className="font-semibold">{selectedDoctor.phoneNumber || "Non renseigné"}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaCalendarAlt className="text-sky-600" />
                    <div>
                      <p className="text-sm text-neutral-500">Date d&apos;inscription</p>
                      <p className="font-semibold">{formatDate(selectedDoctor.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedDoctor.licenseNumber && (
                    <div>
                      <p className="text-sm text-neutral-500 mb-2">Numéro de licence</p>
                      <p className="font-semibold bg-neutral-50 p-3 rounded-lg">{selectedDoctor.licenseNumber}</p>
                    </div>
                  )}

                  {selectedDoctor.idNumber && (
                    <div>
                      <p className="text-sm text-neutral-500 mb-2">Numéro d&apos;identité</p>
                      <p className="font-semibold bg-neutral-50 p-3 rounded-lg">{selectedDoctor.idNumber}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Documents */}
              {(selectedDoctor.idImage || selectedDoctor.licenseImage || selectedDoctor.cvImage) && (
                <div>
                  <h4 className="text-lg font-semibold text-neutral-900 mb-4">Documents</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedDoctor.idImage && (
                      <div className="text-center">
                        <img
                          src={`${IMG_URL}${selectedDoctor.idImage}`}
                          alt="Pièce d'identité"
                          className="w-full h-32 object-cover rounded-lg border border-neutral-200 mb-2"
                        />
                        <p className="text-sm text-neutral-600">Pièce d&apos;identité</p>
                      </div>
                    )}
                    
                    {selectedDoctor.licenseImage && (
                      <div className="text-center">
                        <img
                          src={`${IMG_URL}${selectedDoctor.licenseImage}`}
                          alt="Licence médicale"
                          className="w-full h-32 object-cover rounded-lg border border-neutral-200 mb-2"
                        />
                        <p className="text-sm text-neutral-600">Licence médicale</p>
                      </div>
                    )}
                    
                    {selectedDoctor.cvImage && (
                      <div className="text-center">
                        <img
                          src={`${IMG_URL}${selectedDoctor.cvImage}`}
                          alt="CV"
                          className="w-full h-32 object-cover rounded-lg border border-neutral-200 mb-2"
                        />
                        <p className="text-sm text-neutral-600">Curriculum Vitae</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-200">
                {selectedDoctor.verifiedStatus === "pending" && (
                  <>
                    <LoadingButton
                      onClick={() => {
                        setShowDetailsModal(false);
                        handleActionClick(selectedDoctor, "approve");
                      }}
                      className="btn bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 btn-lg flex items-center justify-center"
                    >
                      <FaCheckCircle className="mr-2" />
                      Approuver le médecin
                    </LoadingButton>
                    <LoadingButton
                      onClick={() => {
                        setShowDetailsModal(false);
                        handleActionClick(selectedDoctor, "reject");
                      }}
                      className="btn bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 btn-lg flex items-center justify-center"
                    >
                      <FaTimesCircle className="mr-2" />
                      Rejeter le médecin
                    </LoadingButton>
                  </>
                )}
                
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedDoctor(null);
                  }}
                  className="btn-secondary btn-lg"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Confirmation Modal */}
      {showActionModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">
              {actionType === "approve" ? "Confirmer l'approbation" : "Confirmer le rejet"}
            </h3>
            <p className="text-neutral-600 mb-6">
              Êtes-vous sûr de vouloir {actionType === "approve" ? "approuver" : "rejeter"} le médecin{' '}
              Dr. {selectedDoctor.firstName} {selectedDoctor.lastName} ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowActionModal(false);
                  setSelectedDoctor(null);
                  setActionType("");
                }}
                className="flex-1 btn-secondary"
                disabled={actionLoading}
              >
                Annuler
              </button>
              <LoadingButton
                onClick={handleActionConfirm}
                isLoading={actionLoading}
                className={`flex-1 btn ${actionType === "approve" ? "bg-green-500 hover:bg-green-600 focus:ring-green-500" : "bg-red-500 hover:bg-red-600 focus:ring-red-500"} text-white`}
              >
                {actionLoading ? 
                  (actionType === "approve" ? "Approbation..." : "Rejet...") : 
                  (actionType === "approve" ? "Approuver" : "Rejeter")
                }
              </LoadingButton>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ManageDoctors;
import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaTrashAlt, FaCheck, FaTimes, FaCalendarAlt, FaUser, FaClock, FaFilter, FaSearch, FaEnvelope, FaUserMd, FaHourglassHalf, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import axios from "../../../../api/axios";
import useAccessToken from "../../../../hooks/useAccessToken";
import MedicalLoader from "../../../MedicalLoader";
import LoadingButton from "../../../LoadingButton";
import { useToast } from "../../../Notifications/ToastContainer";
import NotificationContext from "../../../../context/NotificationContext";

const DoctorDemandes = () => {
  const effectRan = useRef(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(""); // "approve" or "reject"
  const [actionLoading, setActionLoading] = useState(false);

  const { accessToken, decodedToken } = useAccessToken();
  const { showSuccess, showError } = useToast();

  // Fetch appointments with patient details
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      console.log("DoctorDemandes: Fetching appointments...");
      
      if (accessToken && decodedToken?.UserInfo?.id) {
        const response = await axios.get(
          `/appointments/doctor/${decodedToken.UserInfo.id}`,
          {
          headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        
        const appointmentsData = response.data || [];
        console.log("DoctorDemandes: Raw appointments data:", appointmentsData);
        
        // Fetch patient details for each appointment
        const appointmentsWithPatients = await Promise.all(
          appointmentsData.map(async (appointment) => {
            try {
              const patientRes = await axios.get(`/users/${appointment.userId}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
              });
              return { ...appointment, patient: patientRes.data };
            } catch (err) {
              console.error("Error fetching patient details:", err);
              return { 
                ...appointment, 
                patient: { 
                  firstName: "Patient", 
                  lastName: "Inconnu",
                  email: "email@inconnu.com"
                } 
              };
            }
          })
        );
        
        console.log("DoctorDemandes: Appointments with patients:", appointmentsWithPatients);
        setAppointments(appointmentsWithPatients);
        setFilteredAppointments(appointmentsWithPatients);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  }, [accessToken, decodedToken]);

  useEffect(() => {
    if (effectRan.current === false) {
      fetchAppointments();
    }
    return () => {
      effectRan.current = true;
    };
  }, [accessToken, decodedToken, fetchAppointments]);

  // Filter appointments
  useEffect(() => {
    let filtered = appointments;
    
    if (filter !== "all") {
      filtered = filtered.filter(apt => apt.status === filter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(apt => 
        apt.patient?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.patient?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.patient?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.reason?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredAppointments(filtered);
  }, [appointments, filter, searchTerm]);

  // Helper functions
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-orange-100 text-orange-800 border-orange-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      completed: "bg-blue-100 text-blue-800 border-blue-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
      cancelled: "bg-gray-100 text-gray-800 border-gray-200"
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusText = (status) => {
    const texts = {
      pending: "En attente",
      approved: "Approuvée",
      completed: "Terminée",
      rejected: "Rejetée",
      cancelled: "Annulée"
    };
    return texts[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date non définie";
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handleJoinConsultation = (appointmentId) => {
    navigate(`/appointment/${appointmentId}`);
  };

  const handleActionClick = (appointment, action) => {
    setSelectedAppointment(appointment);
    setActionType(action);
    setShowActionModal(true);
  };

  const handleActionConfirm = async () => {
    if (!selectedAppointment || !actionType) return;
    
    try {
      setActionLoading(true);
      const endpoint = actionType === "approve" ? "modify" : "reject";
      const status = actionType === "approve" ? "approved" : "rejected";
      
      await axios.put(
        `/appointments/${endpoint}/${selectedAppointment._id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      // Notification will be created automatically by the server

      // Show toast notification
      if (actionType === "approve") {
        showSuccess("Rendez-vous approuvé avec succès!");
      } else {
        showSuccess("Rendez-vous rejeté.");
      }
      
      // Refresh appointments
      await fetchAppointments();
      setShowActionModal(false);
      setSelectedAppointment(null);
      setActionType("");
    } catch (error) {
      console.error(`Error ${actionType}ing appointment:`, error);
      showError(`Erreur lors de l'${actionType === "approve" ? "approbation" : "rejet"} du rendez-vous`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      await axios.delete(`/appointments/${appointmentId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
      
      // Refresh appointments
      await fetchAppointments();
      } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  // Calculate statistics
  const statistics = {
    total: appointments.length,
    pending: appointments.filter(apt => apt.status === "pending").length,
    approved: appointments.filter(apt => apt.status === "approved").length,
    completed: appointments.filter(apt => apt.status === "completed").length,
    rejected: appointments.filter(apt => apt.status === "rejected").length
  };

  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-60px)] flex items-center justify-center">
        <MedicalLoader type="heartbeat" />
      </div>
    );
  }

  return (
    <section className="w-full bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto px-2 sm:px-4">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center px-3 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sky-600 text-xs font-medium mb-3">
            <FaUserMd className="mr-2 text-sm" />
            Mes Demandes
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-2">
            Gestion des{' '}
            <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
              demandes
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto px-2">
            Gérez les demandes de consultation de vos patients
          </p>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="card-hover border-l-4 border-orange-500">
            <div className="card-body p-2 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-neutral-600">En attente</p>
                  <p className="text-lg sm:text-2xl font-bold text-neutral-900">
                    {statistics.pending}
                  </p>
                </div>
                <FaHourglassHalf className="text-orange-500 text-lg sm:text-2xl flex-shrink-0" />
              </div>
            </div>
          </div>

          <div className="card-hover border-l-4 border-green-500">
            <div className="card-body p-2 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-neutral-600">Approuvées</p>
                  <p className="text-lg sm:text-2xl font-bold text-neutral-900">
                    {statistics.approved}
                  </p>
                </div>
                <FaCheckCircle className="text-green-500 text-lg sm:text-2xl flex-shrink-0" />
              </div>
            </div>
          </div>

          <div className="card-hover border-l-4 border-sky-500">
            <div className="card-body p-2 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-neutral-600">Terminées</p>
                  <p className="text-lg sm:text-2xl font-bold text-neutral-900">
                    {statistics.completed}
                  </p>
                </div>
                <FaCheckCircle className="text-sky-500 text-lg sm:text-2xl flex-shrink-0" />
              </div>
            </div>
          </div>

          <div className="card-hover border-l-4 border-red-500">
            <div className="card-body p-2 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-neutral-600">Rejetées</p>
                  <p className="text-lg sm:text-2xl font-bold text-neutral-900">
                    {statistics.rejected}
                  </p>
                </div>
                <FaTimesCircle className="text-red-500 text-lg sm:text-2xl flex-shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card mb-4 sm:mb-6">
          <div className="card-body p-2 sm:p-4">
            <div className="flex flex-col gap-3 sm:gap-4">
              {/* Search */}
              <div className="relative w-full">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 flex-1">
                <FaFilter className="text-neutral-500" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="flex-1 px-3 sm:px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-white text-sm"
                >
                  <option value="all">Tous</option>
                  <option value="pending">En attente</option>
                  <option value="approved">Approuvées</option>
                  <option value="completed">Terminées</option>
                  <option value="rejected">Rejetées</option>
                  <option value="cancelled">Annulées</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="card overflow-hidden">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <FaCalendarAlt className="text-gray-300 text-6xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {appointments.length === 0 ? "Aucune demande trouvée" : "Aucun résultat"}
              </h3>
              <p className="text-gray-500">
                {appointments.length === 0 
                  ? "Vous n'avez pas encore reçu de demandes de consultation" 
                  : "Essayez de modifier vos filtres de recherche"
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {filteredAppointments.map((appointment) => (
                <div key={appointment._id} className="p-3 sm:p-6 hover:bg-neutral-50 transition-all duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      {/* Patient Avatar */}
                      <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FaUser className="text-sky-600 text-lg sm:text-xl" />
                      </div>
                      
                      {/* Appointment Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                            {appointment.patient?.firstName} {appointment.patient?.lastName}
                          </h3>
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)} w-fit`}>
                            {getStatusText(appointment.status)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-2">
                            <FaEnvelope className="text-sky-500 flex-shrink-0" />
                            <span className="truncate">{appointment.patient?.email}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-sky-500 flex-shrink-0" />
                            <span>{formatDate(appointment.startDateTime || appointment.date)}</span>
                          </div>
                          
                          {appointment.startDateTime && (
                            <div className="flex items-center gap-2">
                              <FaClock className="text-sky-500 flex-shrink-0" />
                              <span>{formatTime(appointment.startDateTime)}</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 bg-neutral-50 p-3 rounded-lg">
                          <strong className="text-gray-800">Motif:</strong> {appointment.reason}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                      <button
                        onClick={() => handleViewDetails(appointment)}
                        className="btn-secondary text-sm flex items-center justify-center gap-2"
                      >
                        <FaEye />
                        <span className="hidden sm:inline">Voir</span>
                        <span className="sm:hidden">Détails</span>
                      </button>

                      {appointment.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleActionClick(appointment, "approve")}
                            className="btn bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 text-sm flex items-center justify-center gap-2"
                          >
                            <FaCheck />
                            <span className="hidden sm:inline">Approuver</span>
                            <span className="sm:hidden">Approuver</span>
                          </button>
                          <button
                            onClick={() => handleActionClick(appointment, "reject")}
                            className="btn bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 text-sm flex items-center justify-center gap-2"
                          >
                            <FaTimes />
                            <span className="hidden sm:inline">Rejeter</span>
                            <span className="sm:hidden">Rejeter</span>
                          </button>
                        </>
                      )}

                      {(appointment.status === "approved" || appointment.status === "completed") && (
                        <button
                          onClick={() => handleJoinConsultation(appointment._id)}
                          className="btn-primary text-sm flex items-center justify-center gap-2"
                        >
                          <FaEye />
                          <span className="hidden sm:inline">Consultation</span>
                          <span className="sm:hidden">Chat</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteAppointment(appointment._id)}
                        className="btn bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 text-sm flex items-center justify-center gap-2"
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

      {/* Appointment Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Détails de la Demande</h2>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedAppointment(null);
                  }}
                  className="text-white/80 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

                {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Patient Information */}
              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-blue-600 text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {selectedAppointment.patient?.firstName} {selectedAppointment.patient?.lastName}
                  </h3>
                  <p className="text-gray-600">{selectedAppointment.patient?.email}</p>
                  {selectedAppointment.patient?.phoneNumber && (
                    <p className="text-sm text-gray-500">{selectedAppointment.patient?.phoneNumber}</p>
                  )}
                </div>
                        </div>

              {/* Appointment Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FaCalendarAlt className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-semibold">{formatDate(selectedAppointment.startDateTime || selectedAppointment.date)}</p>
                    </div>
                        </div>

                  {selectedAppointment.startDateTime && (
                    <div className="flex items-center space-x-3">
                      <FaClock className="text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Heure</p>
                        <p className="font-semibold">{formatTime(selectedAppointment.startDateTime)}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <FaEye className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Statut</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedAppointment.status)}`}>
                        {getStatusText(selectedAppointment.status)}
                      </span>
                    </div>
                  </div>
                        </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Motif de consultation</p>
                    <p className="font-semibold bg-gray-50 p-3 rounded-lg">{selectedAppointment.reason}</p>
                        </div>

                  {selectedAppointment.notes && selectedAppointment.notes.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Notes</p>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        {selectedAppointment.notes.map((note, index) => (
                          <p key={index} className="text-sm text-gray-700">{note}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                        </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                {selectedAppointment.status === "pending" && (
                  <>
                    <LoadingButton
                      onClick={() => {
                        setShowDetailsModal(false);
                        handleActionClick(selectedAppointment, "approve");
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                    >
                      <FaCheck className="mr-2" />
                      Approuver la demande
                    </LoadingButton>
                    <LoadingButton
                      onClick={() => {
                        setShowDetailsModal(false);
                        handleActionClick(selectedAppointment, "reject");
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                    >
                      <FaTimes className="mr-2" />
                      Rejeter la demande
                    </LoadingButton>
                  </>
                )}

                {(selectedAppointment.status === "approved" || selectedAppointment.status === "completed") && (
                  <LoadingButton
                    onClick={() => {
                      handleJoinConsultation(selectedAppointment._id);
                      setShowDetailsModal(false);
                    }}
                    className="btn-primary btn-lg flex items-center justify-center"
                  >
                    <FaEye className="mr-2" />
                    Accéder à la consultation
                  </LoadingButton>
                )}
                
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedAppointment(null);
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Fermer
                </button>
                        </div>
                      </div>
                    </div>
                  </div>
      )}

      {/* Action Confirmation Modal */}
      {showActionModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {actionType === "approve" ? "Confirmer l'approbation" : "Confirmer le rejet"}
            </h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir {actionType === "approve" ? "approuver" : "rejeter"} la demande de consultation de{" "}
              {selectedAppointment.patient?.firstName} {selectedAppointment.patient?.lastName} ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowActionModal(false);
                  setSelectedAppointment(null);
                  setActionType("");
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-colors"
                disabled={actionLoading}
              >
                Annuler
              </button>
              <LoadingButton
                onClick={handleActionConfirm}
                isLoading={actionLoading}
                className={`flex-1 ${actionType === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} text-white py-3 rounded-lg font-semibold transition-colors`}
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

export default DoctorDemandes;
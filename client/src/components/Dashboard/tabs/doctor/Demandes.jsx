import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaTrashAlt, FaCheck, FaTimes, FaCalendarAlt, FaUser, FaClock, FaFilter, FaSearch, FaEnvelope, FaUserMd } from "react-icons/fa";
import axios from "../../../../api/axios";
import useAccessToken from "../../../../hooks/useAccessToken";
import MedicalLoader from "../../../MedicalLoader";
import LoadingButton from "../../../LoadingButton";

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
      
      // Refresh appointments
      await fetchAppointments();
      setShowActionModal(false);
      setSelectedAppointment(null);
      setActionType("");
    } catch (error) {
      console.error(`Error ${actionType}ing appointment:`, error);
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
    <section className="w-full bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sky-600 text-sm font-medium mb-4">
            <FaUserMd className="mr-2" />
            Mes Demandes
          </div>
          <h1 className="heading-1 text-neutral-900 mb-2">
            Gestion des{' '}
            <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
              demandes
            </span>
          </h1>
          <p className="body-large text-neutral-600 max-w-2xl mx-auto">
            Gérez les demandes de consultation de vos patients
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="card-hover border-l-4 border-sky-500">
            <div className="card-body text-center">
              <p className="text-2xl font-bold text-neutral-900">{statistics.total}</p>
              <p className="text-sm text-neutral-600">Total</p>
            </div>
          </div>
          <div className="card-hover border-l-4 border-orange-500">
            <div className="card-body text-center">
              <p className="text-2xl font-bold text-neutral-900">{statistics.pending}</p>
              <p className="text-sm text-neutral-600">En attente</p>
            </div>
          </div>
          <div className="card-hover border-l-4 border-green-500">
            <div className="card-body text-center">
              <p className="text-2xl font-bold text-neutral-900">{statistics.approved}</p>
              <p className="text-sm text-neutral-600">Approuvées</p>
            </div>
          </div>
          <div className="card-hover border-l-4 border-sky-500">
            <div className="card-body text-center">
              <p className="text-2xl font-bold text-neutral-900">{statistics.completed}</p>
              <p className="text-sm text-neutral-600">Terminées</p>
            </div>
          </div>
          <div className="card-hover border-l-4 border-red-500">
            <div className="card-body text-center">
              <p className="text-2xl font-bold text-neutral-900">{statistics.rejected}</p>
              <p className="text-sm text-neutral-600">Rejetées</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par patient ou motif..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="approved">Approuvées</option>
                <option value="completed">Terminées</option>
                <option value="rejected">Rejetées</option>
                <option value="cancelled">Annulées</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
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
            <div className="divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <div key={appointment._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Patient Avatar */}
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-blue-600 text-xl" />
                      </div>
                      
                      {/* Appointment Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {appointment.patient?.firstName} {appointment.patient?.lastName}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                            {getStatusText(appointment.status)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <FaEnvelope className="text-gray-400" />
                            <span>{appointment.patient?.email}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <FaCalendarAlt className="text-gray-400" />
                            <span>
                              {formatDate(appointment.startDateTime || appointment.date)}
                            </span>
                          </div>
                          
                          {appointment.startDateTime && (
                            <div className="flex items-center gap-1">
                              <FaClock className="text-gray-400" />
                              <span>{formatTime(appointment.startDateTime)}</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-500">
                          <strong>Motif:</strong> {appointment.reason}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleViewDetails(appointment)}
                        className="btn-secondary px-4 py-2 font-medium flex items-center gap-2"
                      >
                        <FaEye />
                        Détails
                      </button>

                      {appointment.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleActionClick(appointment, "approve")}
                            className="btn bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 px-4 py-2 font-medium flex items-center gap-2"
                          >
                            <FaCheck />
                            Approuver
                          </button>
                          <button
                            onClick={() => handleActionClick(appointment, "reject")}
                            className="btn bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 px-4 py-2 font-medium flex items-center gap-2"
                          >
                            <FaTimes />
                            Rejeter
                          </button>
                        </>
                      )}

                      {(appointment.status === "approved" || appointment.status === "completed") && (
                        <button
                          onClick={() => handleJoinConsultation(appointment._id)}
                          className="btn-primary px-4 py-2 font-medium flex items-center gap-2"
                        >
                          <FaEye />
                          Consultation
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteAppointment(appointment._id)}
                        className="btn-secondary px-4 py-2 font-medium flex items-center gap-2"
                      >
                        <FaTrashAlt />
                        Supprimer
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
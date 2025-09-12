import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaTrashAlt, FaCalendarAlt, FaUserMd, FaClock, FaFilter, FaSearch, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";
import axios from "../../../../api/axios";
import useAccessToken from "../../../../hooks/useAccessToken";
import MedicalLoader from "../../../MedicalLoader";
import LoadingButton from "../../../LoadingButton";

const PatientDemandes = () => {
  const effectRan = useRef(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { accessToken, decodedToken } = useAccessToken();

  // Fetch patient appointments with doctor details
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      
      if (accessToken && decodedToken?.UserInfo?.id) {
        const response = await axios.get(
          `/appointments/user/${decodedToken.UserInfo.id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        
        const appointmentsData = response.data || [];
        
        // Fetch doctor details for each appointment
        const appointmentsWithDoctors = await Promise.all(
          appointmentsData.map(async (appointment) => {
            try {
              const doctorRes = await axios.get(`/doctors/${appointment.doctorId}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
              });
              return { ...appointment, doctor: doctorRes.data };
            } catch (err) {
              return { 
                ...appointment, 
                doctor: { 
                  firstName: "Dr.", 
                  lastName: "Inconnu",
                  specialty: "Médecin généraliste"
                } 
              };
            }
          })
        );
        
        setAppointments(appointmentsWithDoctors);
        setFilteredAppointments(appointmentsWithDoctors);
      }
    } catch (error) {
      console.error("Error fetching patient appointments:", error);
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
        apt.doctor?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.doctor?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handleJoinConsultation = (appointmentId) => {
    navigate(`/appointment/${appointmentId}`);
  };

  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return;
    
    try {
      setDeleteLoading(true);
      await axios.put(
        `/appointments/cancel/${selectedAppointment._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      
      // Refresh appointments
      await fetchAppointments();
      setShowDeleteModal(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    } finally {
      setDeleteLoading(false);
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
            <FaUserMd className="mr-2" />
            Mes Consultations
          </div>
          <h1 className="heading-1 text-neutral-900 mb-2">
            Gérez vos{' '}
            <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
              consultations
            </span>
          </h1>
          <p className="body-large text-neutral-600 max-w-2xl mx-auto">
            Suivez l&apos;état de vos consultations médicales et accédez facilement à vos rendez-vous
          </p>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card-hover border-l-4 border-orange-500">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">En attente</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {appointments.filter(apt => apt.status === "pending").length}
                  </p>
                </div>
                <FaHourglassHalf className="text-orange-500 text-2xl" />
              </div>
            </div>
          </div>

          <div className="card-hover border-l-4 border-green-500">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Approuvées</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {appointments.filter(apt => apt.status === "approved").length}
                  </p>
                </div>
                <FaCheckCircle className="text-green-500 text-2xl" />
              </div>
            </div>
          </div>

          <div className="card-hover border-l-4 border-sky-500">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Terminées</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {appointments.filter(apt => apt.status === "completed").length}
                  </p>
                </div>
                <FaCheckCircle className="text-sky-500 text-2xl" />
              </div>
            </div>
          </div>

          <div className="card-hover border-l-4 border-red-500">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Autres</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {appointments.filter(apt => apt.status === "rejected" || apt.status === "cancelled").length}
                  </p>
                </div>
                <FaTimesCircle className="text-red-500 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card mb-6">
          <div className="card-body">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Rechercher par médecin ou motif..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-3">
                <FaFilter className="text-neutral-500" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-white"
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
        </div>

        {/* Appointments List */}
        <div className="card overflow-hidden">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <FaCalendarAlt className="text-gray-300 text-6xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {appointments.length === 0 ? "Aucune consultation trouvée" : "Aucun résultat"}
              </h3>
              <p className="text-gray-500">
                {appointments.length === 0 
                  ? "Vous n&apos;avez pas encore de consultations programmées" 
                  : "Essayez de modifier vos filtres de recherche"
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {filteredAppointments.map((appointment) => (
                <div key={appointment._id} className="p-6 hover:bg-neutral-50 transition-all duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      {/* Doctor Avatar */}
                      <div className="w-14 h-14 bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FaUserMd className="text-sky-600 text-xl" />
                      </div>
                      
                      {/* Appointment Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-800 truncate">
                            Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)} w-fit`}>
                            {getStatusText(appointment.status)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-2">
                            <FaUserMd className="text-sky-500 flex-shrink-0" />
                            <span className="truncate">{appointment.doctor?.specialty || 'Médecin généraliste'}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-sky-500 flex-shrink-0" />
                            <span className="truncate">
                              {formatDate(appointment.startDateTime || appointment.date)}
                            </span>
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
                        onClick={() => handleViewAppointment(appointment)}
                        className="btn-secondary text-sm flex items-center justify-center gap-2"
                      >
                        <FaEye />
                        <span className="hidden sm:inline">Voir détails</span>
                        <span className="sm:hidden">Détails</span>
                      </button>

                      {appointment.status === "approved" && (
                        <button
                          onClick={() => handleJoinConsultation(appointment._id)}
                          className="btn-primary text-sm flex items-center justify-center gap-2"
                        >
                          <FaEye />
                          <span className="hidden sm:inline">Rejoindre</span>
                          <span className="sm:hidden">Chat</span>
                        </button>
                      )}
                      
                      {appointment.status === "pending" && (
                        <button
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowDeleteModal(true);
                          }}
                          className="btn bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 text-sm flex items-center justify-center gap-2"
                        >
                          <FaTrashAlt />
                          <span className="hidden sm:inline">Annuler</span>
                          <span className="sm:hidden">Annuler</span>
                        </button>
                      )}
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
                <h2 className="text-2xl font-bold">Détails de la Consultation</h2>
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
              {/* Doctor Information */}
              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaUserMd className="text-blue-600 text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Dr. {selectedAppointment.doctor?.firstName} {selectedAppointment.doctor?.lastName}
                  </h3>
                  <p className="text-gray-600">{selectedAppointment.doctor?.specialty || 'Médecin généraliste'}</p>
                  <p className="text-sm text-gray-500">{selectedAppointment.doctor?.email}</p>
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
                      <p className="text-sm text-gray-500 mb-2">Notes du médecin</p>
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
                {selectedAppointment.status === "approved" && (
                  <LoadingButton
                    onClick={() => {
                      handleJoinConsultation(selectedAppointment._id);
                      setShowDetailsModal(false);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                  >
                    <FaEye className="mr-2" />
                    Rejoindre la consultation
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmer l&apos;annulation</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir annuler votre consultation avec{' '}
              Dr. {selectedAppointment.doctor?.firstName} {selectedAppointment.doctor?.lastName} ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedAppointment(null);
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-colors"
                disabled={deleteLoading}
              >
                Garder
              </button>
              <LoadingButton
                onClick={handleDeleteAppointment}
                isLoading={deleteLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {deleteLoading ? "Annulation..." : "Annuler"}
              </LoadingButton>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PatientDemandes;

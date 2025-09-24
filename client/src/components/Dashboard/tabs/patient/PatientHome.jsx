import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaUserMd, FaClipboardList, FaHeart, FaPlusCircle, FaEye, FaChartLine, FaClock } from "react-icons/fa";
import axios from "../../../../api/axios";
import useAccessToken from "../../../../hooks/useAccessToken";
import MedicalLoader from "../../../MedicalLoader";
import LoadingButton from "../../../LoadingButton";

const PatientHome = () => {
  const effectRan = useRef(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    pending: 0,
    approved: 0,
    cancelled: 0,
    rejected: 0,
    completed: 0
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const { accessToken, decodedToken } = useAccessToken();

  const fetchPatientData = useCallback(async () => {
    try {
      setLoading(true);
      console.log("PatientHome: Fetching appointments for user:", decodedToken?.UserInfo?.id);
      
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
        console.log("PatientHome: Raw appointments data:", appointmentsData);
        console.log("PatientHome: Number of appointments:", appointmentsData.length);
        
        if (Array.isArray(appointmentsData)) {
          const fetchedStats = {
            pending: appointmentsData.filter((appt) => appt.status === "pending").length,
            rejected: appointmentsData.filter((appt) => appt.status === "rejected").length,
            cancelled: appointmentsData.filter((appt) => appt.status === "cancelled").length,
            completed: appointmentsData.filter((appt) => appt.status === "completed").length,
            approved: appointmentsData.filter((appt) => appt.status === "approved").length
          };
          
          console.log("PatientHome: Calculated stats:", fetchedStats);
          setStatistics(fetchedStats);
          
          // Get upcoming appointments (approved ones with future dates)
          const now = new Date();
          const upcoming = appointmentsData
            .filter(appt => {
              if (appt.status !== "approved") return false;
              // Handle both new (startDateTime) and legacy (date) formats
              const appointmentDate = appt.startDateTime ? new Date(appt.startDateTime) : new Date(appt.date);
              return appointmentDate > now;
            })
            .sort((a, b) => {
              const dateA = new Date(a.startDateTime || a.date);
              const dateB = new Date(b.startDateTime || b.date);
              return dateA - dateB;
            })
            .slice(0, 3);
          
          // Fetch doctor details for upcoming appointments
          if (upcoming.length > 0) {
            const upcomingWithDoctors = await Promise.all(
              upcoming.map(async (appt) => {
                try {
                  const doctorRes = await axios.get(`/doctors/${appt.doctorId}`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                  });
                  return { ...appt, doctor: doctorRes.data };
                } catch (err) {
                  return { ...appt, doctor: { firstName: "Dr.", lastName: "Inconnu" } };
                }
              })
            );
            setUpcomingAppointments(upcomingWithDoctors);
          }
          
          // Set recent activity (last 5 appointments)
          const recent = appointmentsData
            .sort((a, b) => {
              const dateA = new Date(a.createdAt || a.startDateTime || a.date);
              const dateB = new Date(b.createdAt || b.startDateTime || b.date);
              return dateB - dateA;
            })
            .slice(0, 5);
          setRecentActivity(recent);
        }
      }
    } catch (error) {
      console.error("PatientHome: Error fetching appointments:", error);
      
      // Set empty data to prevent infinite loading
      setStatistics({
        pending: 0,
        approved: 0,
        cancelled: 0,
        rejected: 0,
        completed: 0
      });
      setUpcomingAppointments([]);
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken, decodedToken]);

  useEffect(() => {
    if (effectRan.current === false) {
      fetchPatientData();
    }
    return () => {
      effectRan.current = true;
    };
  }, [accessToken, decodedToken, fetchPatientData]);

  // Helper functions
  const getStatusColor = (status) => {
    const colors = {
      pending: "text-orange-600 bg-orange-100",
      approved: "text-green-600 bg-green-100", 
      completed: "text-blue-600 bg-blue-100",
      rejected: "text-red-600 bg-red-100",
      cancelled: "text-gray-600 bg-gray-100"
    };
    return colors[status] || "text-gray-600 bg-gray-100";
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

  // Quick action handlers
  const handleBookAppointment = () => {
    navigate('/doctors');
  };

  const handleViewConsultations = () => {
    navigate('/dashboard/consultations');
  };

  const handleViewProfile = () => {
    navigate('/dashboard/profile');
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handleJoinConsultation = (appointmentId) => {
    navigate(`/appointment/${appointmentId}`);
  };

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (loading) {
        console.log("Fallback: Force stopping loading after 3 seconds");
        setLoading(false);
        setStatistics({
          pending: 0,
          approved: 0,
          cancelled: 0,
          rejected: 0,
          completed: 0
        });
      }
    }, 3000);

    return () => clearTimeout(fallbackTimer);
  }, [loading]);

  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-60px)] flex items-center justify-center">
        <MedicalLoader type="heartbeat" />
      </div>
    );
  }

  const totalAppointments = Object.values(statistics).reduce((sum, val) => sum + val, 0);

  return (
    <section className="w-full bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sky-600 text-sm font-medium mb-4">
            <FaHeart className="mr-2" />
            Tableau de Bord Patient
          </div>
          <h1 className="heading-1 text-neutral-900 mb-2">
            Bonjour{' '}
            <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
              {decodedToken?.UserInfo?.lastName || 'Patient'}
            </span>{' '}
            👋
          </h1>
          <p className="body-large text-neutral-600 max-w-2xl mx-auto">
            Gérez vos consultations et suivez votre santé en toute simplicité
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {/* Total Appointments */}
          <div className="card-hover border-l-4 border-sky-500">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Total</p>
                  <p className="text-2xl font-bold text-neutral-900">{totalAppointments}</p>
                </div>
                <FaClipboardList className="text-sky-500 text-2xl" />
              </div>
            </div>
          </div>

          {/* Approved */}
          <div className="card-hover border-l-4 border-green-500">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">En cours</p>
                  <p className="text-2xl font-bold text-neutral-900">{statistics.approved}</p>
                </div>
                <FaHeart className="text-green-500 text-2xl" />
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="card-hover border-l-4 border-sky-500">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Terminées</p>
                  <p className="text-2xl font-bold text-neutral-900">{statistics.completed}</p>
                </div>
                <FaChartLine className="text-sky-500 text-2xl" />
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="card-hover border-l-4 border-orange-500">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">En attente</p>
                  <p className="text-2xl font-bold text-neutral-900">{statistics.pending}</p>
                </div>
                <FaClock className="text-orange-500 text-2xl" />
              </div>
            </div>
          </div>

          {/* Rejected/Cancelled */}
          <div className="card-hover border-l-4 border-red-500">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Autres</p>
                  <p className="text-2xl font-bold text-neutral-900">{statistics.rejected + statistics.cancelled}</p>
                </div>
                <FaEye className="text-red-500 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Upcoming Appointments */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-body">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                  <h2 className="heading-4 text-neutral-900 flex items-center">
                    <FaCalendarAlt className="text-sky-500 mr-3" />
                    Prochains Rendez-vous
                  </h2>
                  <LoadingButton
                    onClick={handleBookAppointment}
                    className="btn-primary btn-lg w-full sm:w-auto justify-center"
                  >
                    <FaPlusCircle className="mr-2" />
                    <span className="hidden sm:inline">Nouveau RDV</span>
                    <span className="sm:hidden">Prendre RDV</span>
                  </LoadingButton>
                </div>

                {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment._id} className="border border-neutral-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <FaUserMd className="text-sky-600" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-neutral-900 truncate">
                              Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                            </h3>
                            <p className="text-sm text-neutral-600 truncate">{appointment.doctor?.specialty || 'Médecin généraliste'}</p>
                            <p className="text-sm text-neutral-500">
                              {formatDate(appointment.startDateTime || appointment.date)}
                              {appointment.startDateTime && ` à ${formatTime(appointment.startDateTime)}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)} w-full sm:w-auto text-center`}>
                            {getStatusText(appointment.status)}
                          </span>
                          <button
                            onClick={() => handleViewAppointment(appointment)}
                            className="btn-secondary text-sm w-full sm:w-auto"
                          >
                            Voir détails
                          </button>
                          {appointment.status === "approved" && (
                            <button
                              onClick={() => handleJoinConsultation(appointment._id)}
                              className="btn-primary text-sm w-full sm:w-auto"
                            >
                              Rejoindre
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaCalendarAlt className="text-gray-300 text-6xl mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun rendez-vous programmé</h3>
                  <p className="text-gray-500 mb-4">Prenez rendez-vous avec un médecin dès maintenant</p>
                  <LoadingButton
                    onClick={handleBookAppointment}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors w-full sm:w-auto"
                  >
                    Prendre un rendez-vous
                  </LoadingButton>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Actions & Recent Activity */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card">
              <div className="card-body">
                <h2 className="heading-4 text-neutral-900 mb-4">Actions Rapides</h2>
                <div className="space-y-3">
                  <button
                    onClick={handleBookAppointment}
                    className="w-full btn-primary btn-lg justify-center"
                  >
                    <FaPlusCircle className="mr-2" />
                    Prendre RDV
                  </button>
                  <button
                    onClick={handleViewConsultations}
                    className="w-full btn-secondary btn-lg justify-center"
                  >
                    <FaClipboardList className="mr-2" />
                    Mes Consultations
                  </button>
                  <button
                    onClick={handleViewProfile}
                    className="w-full btn-secondary btn-lg justify-center"
                  >
                    <FaUserMd className="mr-2" />
                    Mon Profil
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <div className="card-body">
                <h2 className="heading-4 text-neutral-900 mb-4">Activité Récente</h2>
                {recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(activity.status).split(' ')[1]}`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-800">
                            Consultation {getStatusText(activity.status).toLowerCase()}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {formatDate(activity.createdAt || activity.date)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-500 text-center py-4">Aucune activité récente</p>
                )}
              </div>
            </div>
          </div>
        </div>
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
    </section>
  );
};

export default PatientHome;

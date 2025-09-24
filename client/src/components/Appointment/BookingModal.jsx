import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaMoneyBillWave, FaUserMd, FaTimes } from "react-icons/fa";
import axios from "../../api/axios";
import useAccessToken from "../../hooks/useAccessToken";
import AuthContext from "../../context/AuthContext";
import LoadingButton from "../LoadingButton";
import { useToast } from "../Notifications/ToastContainer";

const BookingModal = ({ isOpen, onClose, doctor }) => {
  const navigate = useNavigate();
  const { accessToken, decodedToken } = useAccessToken();
  const { API_URL } = useContext(AuthContext);
  const { showSuccess, showError } = useToast();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState({});
  const [doctorPricing, setDoctorPricing] = useState(null);
  
  const [bookingData, setBookingData] = useState({
    selectedDate: "",
    selectedTime: "",
    consultationType: "standardConsultation",
    reason: "",
    duration: 30
  });

  // Fetch doctor pricing and available slots
  useEffect(() => {
    if (isOpen && doctor?._id) {
      fetchDoctorPricing();
      fetchAvailableSlots();
    }
  }, [isOpen, doctor]);

  const fetchDoctorPricing = async () => {
    try {
      const response = await axios.get(`/appointments-v2/doctor/${doctor._id}/pricing`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setDoctorPricing(response.data);
    } catch (error) {
      console.error("Error fetching pricing:", error);
      // Set default pricing
      setDoctorPricing({
        consultationRates: {
          standardConsultation: { price: 50, duration: 30 },
          extendedConsultation: { price: 80, duration: 60 },
          followUpConsultation: { price: 30, duration: 20 }
        },
        platformFeePercentage: 10
      });
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      const start = new Date();
      const end = new Date();
      end.setDate(start.getDate() + 14); // Next 2 weeks

      const response = await axios.get(`/doctors/${doctor._id}/available-slots`, {
        params: {
          start: start.toISOString(),
          end: end.toISOString(),
          slotMinutes: bookingData.duration
        }
      });

      const slots = response.data?.slots || [];
      const grouped = slots.reduce((acc, slot) => {
        const date = new Date(slot.start).toLocaleDateString('en-CA');
        if (!acc[date]) acc[date] = [];
        acc[date].push(slot);
        return acc;
      }, {});

      setAvailableSlots(grouped);
    } catch (error) {
      console.error("Error fetching slots:", error);
      showError("Erreur lors du chargement des créneaux");
    } finally {
      setLoading(false);
    }
  };

  const handleConsultationTypeChange = (type) => {
    if (!doctorPricing) return;
    
    const newDuration = doctorPricing.consultationRates[type]?.duration || 30;
    setBookingData(prev => ({
      ...prev,
      consultationType: type,
      duration: newDuration,
      selectedTime: "" // Reset time selection when duration changes
    }));
    
    // Refetch slots with new duration
    setTimeout(fetchAvailableSlots, 100);
  };

  const calculateTotal = () => {
    if (!doctorPricing) return { consultation: 0, platform: 0, total: 0 };
    
    const consultation = doctorPricing.consultationRates[bookingData.consultationType]?.price || 50;
    const platform = Math.round(consultation * (doctorPricing.platformFeePercentage / 100));
    return {
      consultation,
      platform,
      total: consultation + platform
    };
  };

  const handleSubmit = async () => {
    if (!bookingData.selectedDate || !bookingData.selectedTime || !bookingData.reason.trim()) {
      showError("Veuillez remplir tous les champs requis");
      return;
    }

    try {
      setSubmitting(true);

      const startDateTime = new Date(`${bookingData.selectedDate}T${bookingData.selectedTime}`);
      
      const response = await axios.post("/appointments-v2", {
        userId: decodedToken.UserInfo.id,
        doctorId: doctor._id,
        reason: bookingData.reason,
        startDateTime: startDateTime.toISOString(),
        durationMinutes: bookingData.duration,
        consultationType: bookingData.consultationType
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (response.status === 201) {
        showSuccess("Demande de consultation envoyée avec succès!");
        onClose();
        
        // Redirect to payment if needed
        const appointmentId = response.data.appointment._id;
        navigate(`/payment/checkout/${appointmentId}`);
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      if (error.response?.status === 409) {
        showError("Ce créneau n'est plus disponible");
        fetchAvailableSlots(); // Refresh slots
      } else {
        showError("Erreur lors de la création de la consultation");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const pricing = calculateTotal();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Réserver une consultation</h2>
              <p className="text-primary-100">Dr. {doctor.firstName} {doctor.lastName} - {doctor.speciality}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Consultation Type */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Type de consultation
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {doctorPricing && Object.entries(doctorPricing.consultationRates).map(([type, details]) => (
                <button
                  key={type}
                  onClick={() => handleConsultationTypeChange(type)}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    bookingData.consultationType === type
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-primary-300'
                  }`}
                >
                  <div className="text-center">
                    <FaClock className="text-primary-500 text-xl mx-auto mb-2" />
                    <h4 className="font-medium text-neutral-800 capitalize">
                      {type.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </h4>
                    <p className="text-sm text-neutral-600">{details.duration} min</p>
                    <p className="text-lg font-bold text-primary-600">{details.price} TND</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Choisir une date
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.keys(availableSlots).slice(0, 8).map(date => (
                <button
                  key={date}
                  onClick={() => setBookingData(prev => ({ ...prev, selectedDate: date, selectedTime: "" }))}
                  className={`p-3 border-2 rounded-xl transition-all ${
                    bookingData.selectedDate === date
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-primary-300'
                  }`}
                >
                  <div className="text-center">
                    <p className="text-sm font-medium text-neutral-800">
                      {new Date(date).toLocaleDateString('fr-FR', { 
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-xs text-neutral-600">
                      {availableSlots[date]?.length || 0} créneaux
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          {bookingData.selectedDate && availableSlots[bookingData.selectedDate] && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Choisir une heure
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 max-h-32 overflow-y-auto">
                {availableSlots[bookingData.selectedDate].map(slot => {
                  const time = new Date(slot.start).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  });
                  return (
                    <button
                      key={slot.start}
                      onClick={() => setBookingData(prev => ({ ...prev, selectedTime: time }))}
                      className={`p-2 border-2 rounded-lg transition-all ${
                        bookingData.selectedTime === time
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-neutral-200 hover:border-primary-300'
                      }`}
                    >
                      <p className="text-sm font-medium">{time}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Motif de la consultation
            </label>
            <textarea
              value={bookingData.reason}
              onChange={(e) => setBookingData(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Décrivez brièvement votre problème de santé..."
              rows={3}
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>

          {/* Pricing Summary */}
          {doctorPricing && (
            <div className="bg-neutral-50 rounded-xl p-4">
              <h4 className="font-medium text-neutral-800 mb-3">Résumé des coûts</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Consultation ({bookingData.duration} min)</span>
                  <span className="font-medium">{pricing.consultation} TND</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Frais de plateforme</span>
                  <span className="font-medium">{pricing.platform} TND</span>
                </div>
                <div className="border-t border-neutral-200 pt-2 flex justify-between">
                  <span className="font-semibold text-neutral-800">Total</span>
                  <span className="font-bold text-primary-600">{pricing.total} TND</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200 bg-neutral-50 rounded-b-2xl">
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Annuler
            </button>
            <LoadingButton
              onClick={handleSubmit}
              isLoading={submitting}
              disabled={!bookingData.selectedDate || !bookingData.selectedTime || !bookingData.reason.trim()}
              className="flex-1 btn-primary"
            >
              {submitting ? "Création..." : "Continuer vers le paiement"}
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;


import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { 
  FaStar, 
  FaEye, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaUserMd, 
  FaCertificate,
  FaHeart,
  FaShare,
  FaClock,
  FaCheckCircle,
  FaArrowLeft
} from "react-icons/fa";
import { capitalize } from "../../utils/Capitalize";
import { useToast } from "../Notifications/ToastContainer";
import { getImageURL } from "../../lib/constants";
import usePageSEO from "../../hooks/usePageSEO";

import ImagePreview from "../Dashboard/UI/ImagePreview";
import Modal from "../Dashboard/UI/Modal";

import axios from "../../api/axios";
import useAccessToken from "../../hooks/useAccessToken";
import StarRating from "./StarRating";
import AvgRating from "./AvgRating";
import MedicalLoader from "../MedicalLoader";

const Doctor = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();

  const [doctor, setDoctor] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [imageModal, setImageModal] = useState({
    state: false,
    image: ""
  });

  const [appointment, setAppointment] = useState({
    date: "",
    reason: ""
  });

  // New time-slot booking state
  // flat array not needed separately; we keep grouped slots
  const [slotsByDate, setSlotsByDate] = useState({});
  const [slotDateLabels, setSlotDateLabels] = useState({}); // key (YYYY-MM-DD) -> localized label
  const [selectedDateKey, setSelectedDateKey] = useState(""); // YYYY-MM-DD
  const [selectedSlotStart, setSelectedSlotStart] = useState(""); // ISO string
  const [slotDurationMin, setSlotDurationMin] = useState(30);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [demandeStatus, setDemandeStatus] = useState({
    message: "",
    error: false
  });

  const [star, setStar] = useState(0);
  const [review, setReview] = useState("");
  const [avgRating, setAvgRating] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  const effectRan = useRef(false);

  const { accessToken, decodedToken } = useAccessToken();

  // Use centralized image URL helper
  const IMG_URL = (filename) => getImageURL(filename);
  const IMG_Placeholder = "/imagePlaceholder.png";

  // Set page SEO - will be updated when doctor data loads
  usePageSEO('doctors');

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

  useEffect(() => {
    if (imageModal.image !== "") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [imageModal]);

  const fetchDoctor = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/doctors/${doctorId}`, {
        // headers: {
        //   Authorization: `Bearer ${accessToken}`
        // }
      });

      if (response.status === 200) {
        const appointments = await axios.get(
          `/appointments/doctor/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        const doctorAppointments = appointments.data.filter(
          (appoint) =>
            appoint.doctorId === response.data._id &&
            appoint.status === "completed"
        );
        const docRatings = await axios.get(`/ratings/doctor/${doctorId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        
        if (doctorAppointments && docRatings) {
          setDoctor({
            ...response.data,
            dateOfBirth: response.data.dateOfBirth.substring(0, 10),
            speciality: capitalize(response.data.speciality),
            successfulAppointments: doctorAppointments.length,
            ratings: docRatings.data.length > 0 ? docRatings.data : []
          });
          const average = calculateAverageRating(docRatings.data);
          setAvgRating(average);
        }
      }
    } catch (err) {
      if (err?.response?.data?.message) {
        console.log(err.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  }, [doctorId, accessToken]);

  // Fetch Doctor Profile on Component load
  useEffect(() => {
    if (effectRan.current === false) {
      fetchDoctor();
    }
    return () => {
      effectRan.current = true;
    };
  }, [fetchDoctor]);

  const handleImagePreview = (image) => {
    setImageModal({ state: true, image: IMG_URL(image) });
  };

  const handleShowModal = () => {
    setShowModal(true);
    setDemandeStatus({ message: "", error: false });
  };

  // Fetch available slots when modal opens
  useEffect(() => {
    const fetchSlots = async () => {
      if (!showModal) return;
      try {
        setSlotsLoading(true);
        const start = new Date();
        const end = new Date();
        end.setDate(start.getDate() + 7);
        const res = await axios.get(`/doctors/${doctorId}/available-slots`, {
          params: {
            start: start.toISOString(),
            end: end.toISOString(),
            slotMinutes: slotDurationMin
          }
        });
        const slots = res.data?.slots || [];
        // Filter out past times for today
        const now = new Date();
        const filtered = slots.filter((s) => new Date(s.start) > now);
        const grouped = filtered.reduce((acc, s) => {
          const startDt = new Date(s.start);
          const key = startDt.toLocaleDateString('en-CA'); // YYYY-MM-DD in local tz
          if (!acc[key]) acc[key] = [];
          acc[key].push(s);
          return acc;
        }, {});
        // Sort slots per date by start time and sort date keys
        Object.keys(grouped).forEach((k) => grouped[k].sort((a, b) => new Date(a.start) - new Date(b.start)));
        const sortedKeys = Object.keys(grouped).sort();
        setSlotsByDate(grouped);
        // Build stable localized labels for options to avoid UTC parsing shifts
        const labels = sortedKeys.reduce((map, k) => {
          const [yyyy, mm, dd] = k.split('-').map((n) => parseInt(n, 10));
          const localDate = new Date(yyyy, mm - 1, dd);
          map[k] = localDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
          return map;
        }, {});
        setSlotDateLabels(labels);
        const firstDate = sortedKeys[0] || "";
        setSelectedDateKey(firstDate);
        setSelectedSlotStart("");
      } catch (e) {
        console.error(e);
        setDemandeStatus({ message: "Impossible de récupérer les créneaux disponibles.", error: true });
      } finally {
        setSlotsLoading(false);
      }
    };
    fetchSlots();
  }, [showModal, doctorId, slotDurationMin]);

  const validateDemande = () => {
    if (!selectedDateKey || !selectedSlotStart) {
      setDemandeStatus({
        message: "Vous devez choisir une date et une heure",
        error: true
      });
      return false;
    }
    if (appointment.reason === "") {
      setDemandeStatus({
        message: "Vous devez entrer un motif",
        error: true
      });
      return false;
    }
    return true;
  };

  // A function to check if the user already has a "pending" appointment with this doctor.

  const getPendingAppointments = async () => {
    if (accessToken && accessToken !== "") {
      if (
        decodedToken.UserInfo.role === "user" ||
        decodedToken.UserInfo.role === "admin"
      ) {
        try {
          const userAppointments = await axios.get(
            `/appointments/user/${decodedToken.UserInfo.id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            }
          );
          if (userAppointments.status === 200) {
            const pendingAppointments = userAppointments.data.filter(
              (apt) =>
                apt.status === "pending" &&
                apt.doctorId === doctor._id
            );
            if (pendingAppointments.length > 0) {
              setDemandeStatus({
                message:
                  "Vous avez déjà une demande en attente avec ce médecin",
                error: true
              });
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        } catch (err) {
          if (err?.response?.data?.message) {
            console.log(err.response.data.message);
          }
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const sendAppointment = async () => {
    if (accessToken && accessToken !== "") {
      if (
        decodedToken.UserInfo.role === "user" ||
        decodedToken.UserInfo.role === "admin"
      ) {
        if (validateDemande()) {
          const pendingAppointment = await getPendingAppointments();
          if (!pendingAppointment) {
            try {
              const response = await axios.post(
                "/appointments",
                {
                  userId: decodedToken.UserInfo.id,
                  doctorId: doctor._id,
                  reason: appointment.reason,
                  startDateTime: selectedSlotStart,
                  durationMin: slotDurationMin
                },
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`
                  }
                }
              );
              if (response.status === 201) {
                // Show success toast
                showSuccess("Votre demande a été envoyée avec succès!");
                
                setDemandeStatus({
                  message: "Votre demande à été envoyée avec succès",
                  error: false
                });
                setShowModal(false);
              }
            } catch (err) {
              const msg = err?.response?.data?.message || "Une erreur s'est produite";
              setDemandeStatus({ message: msg, error: true });
              showError("Erreur lors de l'envoi de la demande");
            }
          }
        }
      } else {
        showError("Vous devez être connecté en tant que patient pour effectuer cette action");
        setShowModal(false);
        window.location.href = "/login";
      }
    } else {
      showError("Vous devez être connecté en tant que patient pour effectuer cette action");
      setShowModal(false);
      window.location.href = "/login";
    }
  };

  // Doctor Availability
  // Removed legacy day-of-week helper; slots come labeled via locale formatting

  // Removed old availability preview helpers (now handled via available-slots API)

  const sendRating = async () => {
    if (!review || review === "") {
      showError("Vous devez entrer un commentaire");
      return;
    }
    if (star === 0) {
      showError("Vous devez entrer une note");
      return;
    }

    try {
      const ratingData = {
        userId: decodedToken.UserInfo.id,
        doctorId,
        rating: star,
        review,
        patientName: decodedToken.UserInfo.fullName,
        doctorName: `${doctor.firstName} ${doctor.lastName}`
      };

      const response = await axios.post("/ratings", ratingData);
      if (response.status === 200) {
        showSuccess("Votre avis a été envoyé avec succès");
        setReview("");
        setStar(0);
        fetchDoctor();
      } else {
        showError("Une erreur s'est produite");
      }
    } catch (err) {
      if (err?.response?.data?.message) {
        console.log(err.response.data.message);
      }
    }
  };

  if (loading) {
    return <MedicalLoader type="doctor" message="Chargement du profil médical..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Back Button & Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-30">
        <div className="container py-4">
          <button
            onClick={() => navigate('/doctors')}
            className="flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors duration-200 mb-4"
          >
            <FaArrowLeft />
            <span>Retour aux médecins</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-12">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-4">
                <div className="w-32 h-32 lg:w-24 lg:h-24 rounded-full overflow-hidden border-4 border-white/20">
                  <img
                    src={doctor.profileImage ? IMG_URL(doctor.profileImage) : IMG_Placeholder}
                    alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center lg:text-left">
                  <h1 className="heading-2 text-white">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </h1>
                  <p className="text-xl text-white/90 font-medium">
                    {doctor.speciality}
                  </p>
                  <div className="flex items-center justify-center lg:justify-start gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <AvgRating rating={avgRating} />
                      <span className="text-white/80">({avgRating.toFixed(1)})</span>
                    </div>
                    <div className="w-px h-4 bg-white/30"></div>
                    <span className="text-white/80">{doctor.successfulAppointments} consultations</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <FaCheckCircle className="text-2xl text-green-300 mx-auto mb-2" />
                  <div className="text-lg font-bold">{doctor.successfulAppointments || 0}</div>
                  <div className="text-xs text-white/80">Consultations</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <FaStar className="text-2xl text-yellow-300 mx-auto mb-2" />
                  <div className="text-lg font-bold">{avgRating.toFixed(1)}</div>
                  <div className="text-xs text-white/80">Note moyenne</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <FaUserMd className="text-2xl text-blue-300 mx-auto mb-2" />
                  <div className="text-lg font-bold">{doctor.ratings?.length || 0}</div>
                  <div className="text-xs text-white/80">Avis</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <FaClock className="text-2xl text-purple-300 mx-auto mb-2" />
                  <div className="text-lg font-bold">24/7</div>
                  <div className="text-xs text-white/80">Disponible</div>
                </div>
              </div>
            </div>

            <div className="space-y-4 w-full max-w-sm mx-auto lg:max-w-none lg:mx-0">
          <button
            onClick={handleShowModal}
                className="btn btn-lg bg-white text-primary-600 hover:bg-gray-50 hover:scale-105 transform transition-all duration-300 shadow-xl hover:shadow-2xl font-semibold w-full"
          >
                <FaCalendarAlt className="mr-2" />
            Demander une consultation
          </button>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => {
                    console.log('Add to favorites feature - to implement');
                    showInfo('Fonctionnalité "Favoris" - À implémenter prochainement!');
                  }}
                  className="btn-secondary flex-1 p-3 min-w-0"
                  title="Ajouter aux favoris"
                >
                  <FaHeart />
                </button>
                <button 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `Dr. ${doctor.firstName} ${doctor.lastName}`,
                        text: `Consultez le profil du Dr. ${doctor.firstName} ${doctor.lastName}, ${doctor.speciality}`,
                        url: window.location.href
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      showSuccess('Lien copié dans le presse-papiers!');
                    }
                  }}
                  className="btn-secondary flex-1 p-3 min-w-0"
                  title="Partager le profil"
                >
                  <FaShare />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b border-neutral-200 sticky top-16 z-20">
        <div className="container">
          <div className="flex gap-8 overflow-x-auto scrollbar-hide">
            {[
              { id: "overview", label: "Aperçu", icon: FaUserMd },
              { id: "reviews", label: "Avis", icon: FaStar },
              { id: "contact", label: "Contact", icon: FaEnvelope }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-neutral-600 hover:text-primary-600"
                  }`}
                >
                  <IconComponent />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-12">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  <div className="card">
                    <div className="card-body">
                      <h3 className="heading-4 mb-4 flex items-center gap-2">
                        <FaUserMd className="text-primary-500" />
                        Informations Professionnelles
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-neutral-500">Spécialité</label>
                            <p className="text-neutral-800">{doctor.speciality}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-neutral-500">Date de naissance</label>
                            <p className="text-neutral-800">{doctor.dateOfBirth}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-neutral-500">Consultations réussies</label>
                            <p className="text-neutral-800">{doctor.successfulAppointments}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-neutral-500 mb-3 block">Curriculum Vitae</label>
                            <button
                              onClick={() => handleImagePreview(doctor.cvImage)}
                              className="btn-primary w-full group"
                            >
                              <FaEye className="mr-2 group-hover:scale-110 transition-transform duration-200" />
                              Consulter le CV complet
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === "reviews" && (
                <div className="space-y-6">
                  <div className="card">
                    <div className="card-body">
                      <h3 className="heading-4 mb-6">Avis des patients</h3>
                      
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {doctor.ratings && doctor.ratings.length > 0 ? (
                          [...doctor.ratings].reverse().map((rating, index) => (
                            <div key={index} className="border-b border-neutral-100 last:border-b-0 pb-4 last:pb-0">
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-medium">
                                  {rating.patientName.charAt(0)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="font-medium text-neutral-800">{rating.patientName}</h4>
                                    <div className="flex items-center gap-1">
                                      <AvgRating rating={rating.rating} />
                                      <span className="text-sm text-neutral-500">({rating.rating})</span>
                                    </div>
                                  </div>
                                  <p className="text-neutral-600 mb-2">{rating.review}</p>
                                  <p className="text-xs text-neutral-400">
                                    {new Date(rating.createdAt).toLocaleDateString("fr-FR", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric"
                                    })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <FaStar className="text-4xl text-neutral-300 mx-auto mb-4" />
                            <p className="text-neutral-500">Aucun avis pour le moment</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Leave Review */}
                  <div className="card">
                    <div className="card-body">
                      <h4 className="heading-4 mb-4">Laisser un avis</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-neutral-700 mb-2 block">Votre note</label>
              <StarRating star={star} setStar={setStar} />
            </div>
                        <div>
                          <label className="text-sm font-medium text-neutral-700 mb-2 block">Votre commentaire</label>
            <textarea
                            rows="4"
                            placeholder="Partagez votre expérience..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                          />
                        </div>
                        <button
                          onClick={sendRating}
                          className="btn-primary"
                        >
                          Publier l&apos;avis
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Tab */}
              {activeTab === "contact" && (
                <div className="card">
                  <div className="card-body">
                    <h3 className="heading-4 mb-6 flex items-center gap-2">
                      <FaEnvelope className="text-primary-500" />
                      Informations de Contact
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                        <FaEnvelope className="text-primary-500 text-xl" />
                        <div>
                          <label className="text-sm font-medium text-neutral-500">Email</label>
                          <p className="text-neutral-800">{doctor.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                        <FaPhone className="text-primary-500 text-xl" />
                        <div>
                          <label className="text-sm font-medium text-neutral-500">Téléphone</label>
                          <p className="text-neutral-800">{doctor.phoneNumber || 'Non renseigné'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                        <FaMapMarkerAlt className="text-primary-500 text-xl" />
                        <div>
                          <label className="text-sm font-medium text-neutral-500">Adresse</label>
                          <p className="text-neutral-800">Tunis, Tunisie</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="card">
                <div className="card-body">
                  <h4 className="heading-4 mb-4">Actions rapides</h4>
                  <div className="space-y-3">
                    <button
                      onClick={handleShowModal}
                      className="btn-primary w-full"
                    >
                      <FaCalendarAlt className="mr-2" />
                      Réserver consultation
                    </button>
                    <button 
                      onClick={() => window.open(`tel:${doctor.phoneNumber || '+21621745331'}`, '_self')}
                      className="btn-secondary w-full"
                    >
                      <FaPhone className="mr-2" />
                      Appeler
                    </button>
            <button
                      onClick={() => window.open(`mailto:${doctor.email}?subject=Demande d'information - InstaCure`, '_blank')}
                      className="btn-secondary w-full"
            >
                      <FaEnvelope className="mr-2" />
                      Envoyer email
            </button>
                  </div>
          </div>
        </div>

              <div className="card">
                <div className="card-body">
                  <h4 className="heading-4 mb-4">Certifications</h4>
                  <div className="flex items-center gap-3 text-green-600">
                    <FaCertificate className="text-xl" />
                    <span className="font-medium">Médecin Certifié</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Booking Modal */}
        {showModal && (
          <Modal
            showModal={showModal}
            setShowModal={setShowModal}
          title={"Réserver une consultation"}
          firstButton={"Confirmer la demande"}
            firstAction={sendAppointment}
            secondButton={"Annuler"}
            secondAction={"close"}
          size="lg"
        >
          <div className="space-y-6">
            {/* Doctor Info */}
            <div className="bg-primary-50 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  src={doctor.profileImage ? IMG_URL(doctor.profileImage) : IMG_Placeholder}
                  alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-neutral-800">
                  Dr. {doctor.firstName} {doctor.lastName}
                </h4>
                <p className="text-sm text-primary-600">{doctor.speciality}</p>
                <div className="flex items-center gap-2 mt-1">
                  <AvgRating rating={avgRating} />
                  <span className="text-xs text-neutral-500">({avgRating.toFixed(1)})</span>
                </div>
              </div>
            </div>

            {/* Status Message */}
            {demandeStatus.message && (
              <div className={`p-4 rounded-xl text-center font-medium ${
                demandeStatus.error 
                  ? "bg-red-50 text-red-700 border border-red-200" 
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}>
                  {demandeStatus.message}
              </div>
            )}
            
            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-3">
                  <FaCalendarAlt className="text-primary-500" />
                  Date de la consultation
                </label>
                {slotsLoading ? (
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-600 text-center">
                    Chargement des créneaux disponibles...
                  </div>
                ) : (
                  Object.keys(slotsByDate).length > 0 ? (
                    <div className="space-y-4">
                  <select
                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                        value={selectedDateKey}
                        onChange={(e) => {
                          setSelectedDateKey(e.target.value);
                          setSelectedSlotStart("");
                        }}
                      >
                        {Object.keys(slotsByDate).map((d) => (
                          <option key={d} value={d}>
                            {slotDateLabels[d] || d}
                          </option>
                        ))}
                      </select>

                      {/* Times */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {(slotsByDate[selectedDateKey] || []).map((s) => {
                          const label = new Date(s.start).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                          const isSelected = selectedSlotStart === s.start;
                        return (
                            <button
                              key={s.start}
                              type="button"
                              onClick={() => setSelectedSlotStart(s.start)}
                              className={`px-3 py-2 rounded-lg border text-sm ${isSelected ? 'bg-primary-600 text-white border-primary-600' : 'bg-white hover:bg-neutral-50 border-neutral-300 text-neutral-700'}`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Duration selector (optional) */}
                      <div className="flex items-center gap-3">
                        <label className="text-sm text-neutral-600">Durée:</label>
                        <select
                          className="px-3 py-2 border border-neutral-300 rounded-lg"
                          value={slotDurationMin}
                          onChange={(e) => setSlotDurationMin(parseInt(e.target.value, 10))}
                        >
                          <option value={15}>15 min</option>
                          <option value={30}>30 min</option>
                          <option value={45}>45 min</option>
                          <option value={60}>60 min</option>
                  </select>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 text-center">
                      <FaClock className="mx-auto mb-2 text-2xl" />
                      <p>Aucune disponibilité dans les 14 prochains jours</p>
                    </div>
                  )
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-3">
                  <FaUserMd className="text-primary-500" />
                  Motif de la consultation
                </label>
                <textarea
                  rows="4"
                  placeholder="Décrivez brièvement votre demande, vos symptômes ou questions..."
                  value={appointment.reason}
                  onChange={(e) => setAppointment({ ...appointment, reason: e.target.value })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-neutral-500 mt-2">
                  Ces informations aideront le médecin à mieux vous préparer pour la consultation.
                </p>
              </div>

              {/* Consultation Info */}
              <div className="bg-neutral-50 rounded-xl p-4">
                <h5 className="font-medium text-neutral-800 mb-3">À savoir sur votre consultation</h5>
                <div className="space-y-2 text-sm text-neutral-600">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-primary-500" />
                    <span>Durée estimée: 30-45 minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUserMd className="text-primary-500" />
                    <span>Consultation vidéo sécurisée</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-primary-500" />
                    <span>Confirmation par email sous 24h</span>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </Modal>
        )}

            {imageModal.state && (
              <ImagePreview
                imageModal={imageModal}
                setImageModal={setImageModal}
              />
            )}
      </div>
  );
};

export default Doctor;

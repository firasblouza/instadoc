import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from "../../../../api/axios";
import useAccessToken from "../../../../hooks/useAccessToken";
import { FaUserFriends, FaClock, FaCheckCircle, FaStar, FaCalendarAlt, FaEdit, FaUserMd, FaClipboardList, FaUser } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MedicalLoader from "../../../MedicalLoader";
import Modal from "../../UI/Modal";
import { startTime, endTime } from "../../../../data/data";
import jwt_decode from "jwt-decode";

const normalizeToMondayFirst = (input) => {
  const base = [0,1,2,3,4,5,6].map((i) => ({ dayOfWeek: i, isAvailable: false, startTime: startTime[0], endTime: endTime[endTime.length - 1] }));
  if (!Array.isArray(input)) return base;
  for (const e of input) {
    if (e == null || typeof e.dayOfWeek !== 'number') continue;
    // Two candidates: already Monday-first, or legacy Sunday-first
    const c1 = e.dayOfWeek;                 // Monday-first candidate
    const c2 = (e.dayOfWeek + 6) % 7;       // if legacy Sunday-first
    const idx = base[c1] && base[c1]._filled ? c2 : c1;
    base[idx] = { dayOfWeek: idx, isAvailable: !!e.isAvailable, startTime: e.startTime || startTime[0], endTime: e.endTime || endTime[endTime.length - 1], _filled: true };
  }
  return base.map((entry) => { const tmp = entry; delete tmp._filled; return tmp; });
};

const DoctorHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    upcoming: 0,
    pending: 0,
    completed: 0,
    avgRating: 0
  });
  const [doctor, setDoctor] = useState({});
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAccessToken();

  // State for availability modal
  const [showModal, setShowModal] = useState(false);
  const [newAvailability, setNewAvailability] = useState([]);
  const [previewSlots, setPreviewSlots] = useState({}); // { 'YYYY-MM-DD': [ {start, end} ] }
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewMinutes, setPreviewMinutes] = useState(30);

  useEffect(() => {
    const fetchDoctorData = async () => {
      setLoading(true);
      try {
        if (!accessToken) {
          setLoading(false);
          return;
        }

        let userId = null;
        try {
          const decoded = jwt_decode(accessToken);
          userId = decoded?.UserInfo?.id || null;
        } catch (err) {
          console.error("Invalid access token", err);
          setLoading(false);
          return;
        }

        if (!userId) {
          setLoading(false);
          return;
        }
        
        const [doctorRes, appointmentsRes, ratingsRes] = await Promise.all([
          axios.get(`/doctors/${userId}`, { headers: { Authorization: `Bearer ${accessToken}` } }),
          axios.get(`/appointments/doctor/${userId}`, { headers: { Authorization: `Bearer ${accessToken}` } }),
          axios.get(`/ratings/doctor/${userId}`, { headers: { Authorization: `Bearer ${accessToken}` } })
        ]).catch(err => {
          console.error("Error fetching doctor data:", err);
          throw err;
        });

        const doctorData = doctorRes.data;
        setDoctor(doctorData);
        const availabilitySource = normalizeToMondayFirst(doctorData.availability);
        setNewAvailability(JSON.parse(JSON.stringify(availabilitySource)));

        const appointments = appointmentsRes.data || [];
        const now = new Date();
        const upcoming = appointments
          .filter(a => a.status === 'approved' && (a.startDateTime ? new Date(a.startDateTime) >= now : new Date(a.date) >= now))
          .sort((a, b) => new Date(a.startDateTime || a.date) - new Date(b.startDateTime || b.date));

        // Fetch patient names for top 5 upcoming
        const topUpcoming = upcoming.slice(0, 5);
        const upcomingWithNames = await Promise.all(topUpcoming.map(async (appt) => {
          try {
            const userRes = await axios.get(`/users/${appt.userId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
            const user = userRes.data || {};
            return { ...appt, patientName: `${user.firstName || ''} ${user.lastName || ''}`.trim() };
          } catch {
            return appt;
          }
        }));

        const pending = appointments.filter(a => a.status === 'pending');
        const completed = appointments.filter(a => a.status === 'completed');

        const ratings = ratingsRes.data || [];
        const avgRating = ratings.length > 0 ? ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length : 0;
        
        setStats({
          upcoming: upcoming.length,
          pending: pending.length,
          completed: completed.length,
          avgRating: avgRating
        });
        setUpcomingAppointments(upcomingWithNames); // Show next 5 with names
      } catch (error) {
        console.error("Failed to fetch doctor data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Add longer delay to ensure token is fully ready
    const timer = setTimeout(() => {
      fetchDoctorData();
    }, 800);

    return () => clearTimeout(timer);
  }, [accessToken]);
  
  // Availability Modal Logic
  const getDayOfWeek = (day) => {
    // UI and DB use Monday = 0 .. Sunday = 6
    return ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"][day];
  };

  const upsertAvailabilityForDay = (dayOfWeek, patch) => {
    const idx = newAvailability.findIndex((d) => d.dayOfWeek === dayOfWeek);
    const base = idx >= 0
      ? newAvailability[idx]
      : {
          dayOfWeek,
          isAvailable: false,
          startTime: startTime[0],
          endTime: endTime[endTime.length - 1]
        };
    const updatedEntry = { ...base, ...patch };
    let next;
    if (idx >= 0) {
      next = [...newAvailability];
      next[idx] = updatedEntry;
    } else {
      next = [...newAvailability, updatedEntry];
    }
    next.sort((a, b) => a.dayOfWeek - b.dayOfWeek);
    setNewAvailability(next);
  };

  const saveAvailability = async () => {
    try {
      if (!accessToken) return;
      let userId = null;
      try {
        const decoded = jwt_decode(accessToken);
        userId = decoded?.UserInfo?.id || null;
      } catch (err) {
        console.error("Invalid access token", err);
        return;
      }
      if (!userId) return;

        // Build scheduleV2 from UI (single range per day if available)
        const scheduleV2 = Array.from({ length: 7 }).map((_, i) => ({ day: i, ranges: [] }));
        for (const d of newAvailability) {
          if (d && d.isAvailable) {
            scheduleV2[d.dayOfWeek] = {
              day: d.dayOfWeek,
              ranges: [{ start: d.startTime, end: d.endTime }]
            };
          }
        }

        const response = await axios.put(
          `/doctors/${userId}`,
          { availability: newAvailability, scheduleV2 },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (response.status === 200) {
          setShowModal(false);
        setDoctor(prev => ({ ...prev, availability: JSON.parse(JSON.stringify(newAvailability)), scheduleV2 }));
        alert("Disponibilité mise à jour avec succès.");
      }
    } catch (err) {
      console.error("Failed to save availability:", err);
      alert("Une erreur est survenue lors de la mise à jour.");
    }
  };

  const previewAgendaSlots = async () => {
    // Compute preview from CURRENT in-modal availability (unsaved), excluding approved appointments
    try {
      if (!accessToken) return;
      let userId = null;
      try {
        const decoded = jwt_decode(accessToken);
        userId = decoded?.UserInfo?.id || null;
      } catch {
        return;
      }
      if (!userId) return;
      setPreviewLoading(true);

      const startRange = new Date();
      startRange.setHours(0,0,0,0);
      const endRange = new Date(startRange);
      endRange.setDate(startRange.getDate() + 7);

      // Fetch approved appointments to exclude
      let approved = [];
      try {
        const apptRes = await axios.get(`/appointments/doctor/${userId}`, { headers: { Authorization: `Bearer ${accessToken}` }});
        approved = (apptRes.data || []).filter(a => a.status === 'approved' && a.startDateTime && new Date(a.startDateTime) < endRange);
      } catch {
        // ignore
      }

      const addMinutes = (d, m) => new Date(d.getTime() + m * 60000);
      const parseHHMM = (hhmm) => {
        const [h, m] = (hhmm || '00:00').split(':').map(v => parseInt(v,10));
        return { h: isNaN(h)?0:h, m: isNaN(m)?0:m };
      };
      const isOverlap = (s1, e1, s2, e2) => s1 < e2 && e1 > s2;

      const grouped = {};
      for (let d = new Date(startRange); d < endRange; d = new Date(d.getFullYear(), d.getMonth(), d.getDate()+1)) {
        const jsDow = d.getDay(); // 0 Sun..6 Sat
        const dbDow = (jsDow + 6) % 7; // convert to Monday=0..Sunday=6
        const slotDef = newAvailability.find(s => s.dayOfWeek === dbDow && s.isAvailable);
        if (!slotDef) continue;
        const { h: sh, m: sm } = parseHHMM(slotDef.startTime);
        const { h: eh, m: em } = parseHHMM(slotDef.endTime);
        const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), sh, sm);
        const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), eh, em);
        if (!(dayEnd > dayStart)) continue;

        for (let slotStart = new Date(dayStart); addMinutes(slotStart, previewMinutes) <= dayEnd; slotStart = addMinutes(slotStart, previewMinutes)) {
          const slotEnd = addMinutes(slotStart, previewMinutes);
          const conflict = approved.some(a => isOverlap(slotStart, slotEnd, new Date(a.startDateTime), new Date(a.endDateTime)));
          if (!conflict) {
            const key = d.toLocaleDateString('en-CA');
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push({ start: slotStart.toISOString(), end: slotEnd.toISOString(), date: key });
          }
        }
      }

      Object.keys(grouped).forEach((k) => grouped[k].sort((a,b) => new Date(a.start) - new Date(b.start)));
      setPreviewSlots(grouped);
    } catch (e) {
      console.error(e);
      setPreviewSlots({});
    } finally {
      setPreviewLoading(false);
    }
  };

  // Mock data for chart
  const weeklyConsultations = [
    { name: 'Lun', Consultations: 4 },
    { name: 'Mar', Consultations: 3 },
    { name: 'Mer', Consultations: 5 },
    { name: 'Jeu', Consultations: 2 },
    { name: 'Ven', Consultations: 6 },
    { name: 'Sam', Consultations: 1 },
    { name: 'Dim', Consultations: 0 },
  ];

  const StatCard = ({ icon, title, value, color }) => {
    const Icon = icon;
    return (
      <div className="card-hover bg-white p-6 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <p className="text-3xl font-bold text-neutral-800 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
          <Icon className="text-white text-xl" />
        </div>
      </div>
    );
  };

  StatCard.propTypes = {
    icon: PropTypes.any,
    title: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    color: PropTypes.string
  };

  if (loading) {
    return <MedicalLoader type="doctor" message="Chargement de votre espace..." />;
  }

  if (doctor.verifiedStatus === 'pending') {
  return (
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
            <FaClock className="text-5xl text-yellow-500 mx-auto mb-4" />
            <h1 className="heading-2 mb-4">Compte en attente d&apos;approbation</h1>
            <p className="body-large text-neutral-600 max-w-2xl mx-auto">
                Votre profil est en cours de vérification par notre équipe administrative. Vous serez notifié par email une fois votre compte approuvé. Merci pour votre patience.
          </p>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sky-600 text-sm font-medium mb-4">
          <FaUserMd className="mr-2" />
          Tableau de Bord Médecin
        </div>
        <h1 className="heading-1 text-neutral-900 mb-2">
          Bienvenue{' '}
          <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
            Dr. {doctor.lastName}
          </span>
        </h1>
        <p className="body-large text-neutral-600 max-w-2xl mx-auto">
          Voici un aperçu de votre journée sur InstaDoc
        </p>
        </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={FaCalendarAlt} title="Rendez-vous à venir" value={stats.upcoming} color="bg-sky-500" />
        <StatCard icon={FaClock} title="Demandes en attente" value={stats.pending} color="bg-orange-500" />
        <StatCard icon={FaCheckCircle} title="Consultations terminées" value={stats.completed} color="bg-green-500" />
        <StatCard icon={FaStar} title="Note moyenne" value={stats.avgRating.toFixed(1)} color="bg-sky-500" />
      </div>

      {/* Upcoming Appointments & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card bg-white p-6">
          <h3 className="heading-4 mb-4">Prochains rendez-vous</h3>
          <div className="space-y-4">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map(app => {
                const when = app.startDateTime ? new Date(app.startDateTime) : new Date(app.date);
                return (
                  <div key={app._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <FaUserFriends className="text-primary-500" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-800">{app.patientName || "Patient"}</p>
                        <p className="text-sm text-neutral-500">{when.toLocaleString('fr-FR', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    <button onClick={() => navigate(`/appointment/${app._id}`)} className="btn-secondary text-xs">Voir Détails</button>
                  </div>
                );
              })
            ) : (
              <p className="text-neutral-500 text-center py-8">Aucun rendez-vous à venir.</p>
            )}
          </div>
        </div>
        
        <div className="card bg-white p-6">
          <h3 className="heading-4 mb-4">Consultations / Semaine</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyConsultations}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="Consultations" fill="#14b8a6" />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>

      {/* Quick Actions */}
      <div className="card bg-white p-6">
        <h3 className="heading-4 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button onClick={() => setShowModal(true)} className="btn-primary p-4 flex flex-col items-center justify-center h-24">
            <FaEdit className="text-2xl mb-2" />
            <span>Gérer l&apos;agenda</span>
          </button>
          <button 
            onClick={() => navigate('/dashboard/consultations')}
            className="btn-secondary p-4 flex flex-col items-center justify-center h-24"
          >
            <FaClock className="text-2xl mb-2" />
            <span>Voir les demandes ({stats.pending})</span>
          </button>
          <button 
            onClick={() => navigate('/dashboard/profile')}
            className="btn-secondary p-4 flex flex-col items-center justify-center h-24"
          >
            <FaUser className="text-2xl mb-2" />
            <span>Mon Profil</span>
          </button>
          <button 
            onClick={() => navigate('/dashboard/consultations')}
            className="btn-secondary p-4 flex flex-col items-center justify-center h-24"
          >
            <FaClipboardList className="text-2xl mb-2" />
            <span>Historique ({stats.completed})</span>
          </button>
          </div>
        </div>

        {showModal && (
          <Modal
          title="Gérer mes disponibilités"
            showModal={showModal}
            setShowModal={setShowModal}
            firstAction={saveAvailability}
          firstButton="Enregistrer"
          secondAction={() => setNewAvailability(JSON.parse(JSON.stringify(doctor.availability)))}
          secondButton="Réinitialiser"
          size="xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[0,1,2,3,4,5,6].map((dow) => {
              const entry = newAvailability.find((d) => d.dayOfWeek === dow) || { dayOfWeek: dow, isAvailable: false, startTime: startTime[0], endTime: endTime[endTime.length - 1] };
              const enabled = !!entry.isAvailable;
              return (
                <div key={dow} className={`border rounded-xl p-4 ${enabled ? 'bg-white' : 'bg-neutral-50'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-neutral-800">{getDayOfWeek(dow)}</h4>
                    <label className="inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                        className="sr-only"
                        checked={enabled}
                        onChange={(e) => upsertAvailabilityForDay(dow, { isAvailable: e.target.checked })}
                      />
                      <span className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${enabled ? 'bg-primary-500' : 'bg-neutral-300'}`}>
                        <span className={`bg-white w-4 h-4 rounded-full transform transition-transform duration-200 ${enabled ? 'translate-x-4' : ''}`}></span>
                      </span>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                        <select
                      disabled={!enabled}
                      value={entry.startTime}
                      onChange={(e) => upsertAvailabilityForDay(dow, { startTime: e.target.value })}
                      className="w-full p-2 border border-neutral-300 rounded-lg disabled:opacity-50"
                    >
                      {startTime.map((t) => (
                        <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <select
                      disabled={!enabled}
                      value={entry.endTime}
                      onChange={(e) => upsertAvailabilityForDay(dow, { endTime: e.target.value })}
                      className="w-full p-2 border border-neutral-300 rounded-lg disabled:opacity-50"
                    >
                      {endTime.map((t) => (
                        <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                  </div>
                  {!enabled && (
                    <p className="text-xs text-neutral-500 mt-2">Non disponible</p>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-3">
              <label className="text-sm text-neutral-700">Prévisualiser les créneaux (7 jours):</label>
              <select
                className="px-3 py-2 border border-neutral-300 rounded-lg"
                value={previewMinutes}
                onChange={(e)=> setPreviewMinutes(parseInt(e.target.value, 10))}
              >
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
              </select>
              <button type="button" onClick={previewAgendaSlots} className="btn-secondary">Prévisualiser</button>
            </div>
            {previewLoading ? (
              <p className="text-sm text-neutral-500">Calcul des créneaux disponibles…</p>
            ) : (
              Object.keys(previewSlots).length > 0 ? (
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {Object.keys(previewSlots).map((d) => (
                    <div key={d}>
                      <p className="text-sm font-medium text-neutral-700 mb-2">{new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <div className="flex flex-wrap gap-2">
                        {previewSlots[d].map((s) => (
                          <span key={s.start} className="px-2 py-1 text-xs rounded-lg bg-neutral-100 border border-neutral-200">
                            {new Date(s.start).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-500">Aucun créneau à afficher</p>
              )
            )}
            </div>
          </Modal>
        )}
    </div>
  );
};

export default DoctorHome;

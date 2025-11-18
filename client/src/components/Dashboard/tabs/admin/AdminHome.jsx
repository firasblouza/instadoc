import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../../api/axios";
import useAccessToken from "../../../../hooks/useAccessToken";
import { FaUsers, FaUserMd, FaFileMedicalAlt, FaFileAlt, FaInfoCircle, FaCalendarAlt, FaUser, FaCog } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import MedicalLoader from "../../../MedicalLoader";

/* eslint-disable react/prop-types */
const AdminHome = () => {
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState({
    patients: 0,
    consultations: 0,
    doctors: 0,
    labs: 0,
    pendingDoctors: 0,
    articles: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const { accessToken } = useAccessToken();

  const fetchStatistics = useCallback(async () => {
    setLoading(true);
    try {
      if (accessToken) {
        // In a real app, you'd fetch this from a dedicated stats endpoint
        // For now, we'll simulate fetching and calculating
        const [patientsRes, doctorsRes, appointmentsRes, blogsRes] = await Promise.allSettled([
          axios.get("/admin/patients", { headers: { Authorization: `Bearer ${accessToken}` } }),
          axios.get("/admin/doctors", { headers: { Authorization: `Bearer ${accessToken}` } }),
          axios.get("/appointments", { headers: { Authorization: `Bearer ${accessToken}` } }),
          axios.get("/blogs/admin/all", { headers: { Authorization: `Bearer ${accessToken}` } }).catch(err => {
            console.warn('Blogs API call failed:', err);
            return { data: [] }; // Return empty array as fallback
          })
        ]);

        // Extract data from settled promises
        const patientsData = patientsRes.status === 'fulfilled' ? patientsRes.value.data : [];
        const doctorsData = doctorsRes.status === 'fulfilled' ? doctorsRes.value.data : [];
        const appointmentsData = appointmentsRes.status === 'fulfilled' ? appointmentsRes.value.data : [];
        const blogsData = blogsRes.status === 'fulfilled' ? blogsRes.value.data : [];
        
        // Debug logging for blogs data

        const pendingDoctors = doctorsData.filter(d => d.verifiedStatus === 'pending').length;
        
        // Generate recent activity from real data
        const recentActivityData = [];
        
        // Add recent patient signups
        const recentPatients = patientsData
          .filter(p => p.role === "user" && new Date(p.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
          .slice(0, 3)
          .map(p => ({
            id: p._id,
            type: "user_signup",
            message: `Nouveau patient: ${p.firstName} ${p.lastName}`,
            timestamp: p.createdAt,
            icon: "FaUser"
          }));

        // Add recent doctor approvals
        const recentDoctors = doctorsData
          .filter(d => d.verifiedStatus === "approved" && new Date(d.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
          .slice(0, 2)
          .map(d => ({
            id: d._id,
            type: "doctor_approved",
            message: `Médecin approuvé: Dr. ${d.firstName} ${d.lastName}`,
            timestamp: d.updatedAt,
            icon: "FaUserMd"
          }));

        // Add recent appointments
        const recentAppointments = appointmentsData
          .filter(a => new Date(a.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
          .slice(0, 2)
          .map(a => ({
            id: a._id,
            type: "appointment_created",
            message: `Nouvelle consultation programmée`,
            timestamp: a.createdAt,
            icon: "FaCalendarAlt"
          }));

        recentActivityData.push(...recentPatients, ...recentDoctors, ...recentAppointments);
        
        // Sort by timestamp and take latest 5
        setRecentActivity(
          recentActivityData
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 5)
        );
        
        // Calculate articles count with fallback
        let articlesCount = 0;
        if (blogsRes.status === 'fulfilled' && blogsData) {
          articlesCount = Array.isArray(blogsData) ? blogsData.length : 0;
        } else {
          console.warn('Blogs API failed, using fallback count');
          articlesCount = 3; // Temporary fallback value for testing
        }
        
        // Articles count calculated
        
        // Simulate some data
        setStatistics({
          patients: patientsData.filter(p => p.role === "user").length,
          doctors: doctorsData.length,
          consultations: appointmentsData.length,
          pendingDoctors: pendingDoctors,
          articles: articlesCount, // Count of blog articles with fallback
          labs: 10 // static for now
        });
      }
    } catch (error) {
      console.error("Failed to fetch admin statistics:", error);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  // Mock data for charts
  const monthlySignups = [
    { name: 'Jan', Patients: 4, Doctors: 1 },
    { name: 'Feb', Patients: 3, Doctors: 2 },
    { name: 'Mar', Patients: 5, Doctors: 1 },
    { name: 'Apr', Patients: 7, Doctors: 3 },
    { name: 'May', Patients: 6, Doctors: 2 },
    { name: 'Jun', Patients: 8, Doctors: 4 },
  ];

  const roleDistribution = [
    { name: 'Patients', value: statistics.patients },
    { name: 'Doctors', value: statistics.doctors },
  ];
  const COLORS = ['#0ea5e9', '#14b8a6'];

  // Helper function to format time ago
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 60) return `il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `il y a ${Math.floor(diffInMinutes / 60)} heure${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''}`;
    return `il y a ${Math.floor(diffInMinutes / 1440)} jour${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''}`;
  };
  
  const StatCard = ({ icon, title, value, trend, color }) => {
    const Icon = icon;
    // Ensure value is always displayed, even if undefined
    const displayValue = value !== undefined && value !== null ? value : 0;
    
    return (
      <div className="card-hover bg-white p-4 sm:p-6 flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-neutral-500 truncate">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-neutral-800 mt-1">{displayValue}</p>
          {trend && <p className="text-xs text-neutral-500 mt-1 sm:mt-2 truncate">{trend}</p>}
        </div>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${color} flex-shrink-0`}>
          <Icon className="text-white text-lg sm:text-xl" />
        </div>
      </div>
    );
  };
  
  if (loading) {
    return <MedicalLoader type="pulse" message="Chargement des statistiques..." />;
  }

  // Statistics loaded

  return (
    <section className="w-full bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sky-600 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            <FaCog className="mr-2 text-sm" />
            Administration
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-2">
            Tableau de{' '}
            <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
              bord Admin
            </span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto px-4">
            Vue d&apos;ensemble et gestion de la plateforme InstaCure
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard icon={FaUsers} title="Total Patients" value={statistics.patients} trend="+5.4% ce mois-ci" color="bg-sky-500" />
        <StatCard icon={FaUserMd} title="Total Médecins" value={statistics.doctors} trend="+2.1% ce mois-ci" color="bg-sky-500" />
        <StatCard icon={FaFileMedicalAlt} title="Total Consultations" value={statistics.consultations} trend="+10.2% ce mois-ci" color="bg-green-500" />
        <StatCard icon={FaFileAlt} title="Nombre d'Articles" value={statistics.articles} trend="+3.2% ce mois-ci" color="bg-orange-500" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 mt-6 sm:mt-8">
          <div className="lg:col-span-2 card bg-white p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Inscriptions Mensuelles</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlySignups}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="Patients" fill="#0ea5e9" name="Nouveaux Patients" />
                <Bar dataKey="Doctors" fill="#14b8a6" name="Nouveaux Médecins" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card bg-white p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Distribution des Rôles</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={roleDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      
        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 mt-6 sm:mt-8">
        <div className="lg:col-span-2 card bg-white p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Activité Récente</h3>
          <div className="space-y-3 sm:space-y-4">
            {recentActivity.length > 0 ? recentActivity.map((activity, index) => {
              let Icon, statusColor;
              
              // Map activity type to icon and color
              switch (activity.type) {
                case 'user_signup':
                  Icon = FaUser;
                  statusColor = 'text-green-500';
                  break;
                case 'doctor_approved':
                  Icon = FaUserMd;
                  statusColor = 'text-blue-500';
                  break;
                case 'appointment_created':
                  Icon = FaCalendarAlt;
                  statusColor = 'text-sky-500';
                  break;
                default:
                  Icon = FaInfoCircle;
                  statusColor = 'text-neutral-500';
              }
              
              return (
                <div key={activity.id || index} className="flex items-start gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg hover:bg-neutral-50">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 flex items-center justify-center ${statusColor}`}>
                    <Icon className="text-sm sm:text-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-neutral-700 truncate">{activity.message}</p>
                    <p className="text-xs text-neutral-500">{getTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-6 sm:py-8 text-neutral-500">
                <FaInfoCircle className="text-3xl sm:text-4xl mx-auto mb-2" />
                <p className="text-sm sm:text-base">Aucune activité récente</p>
              </div>
            )}
          </div>
        </div>
        </div>
        
        <div className="space-y-4 sm:space-y-6">
            <div className="card bg-white p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Actions Rapides</h3>
                <div className="space-y-2 sm:space-y-3">
                    <button 
                        onClick={() => navigate('/dashboard/admin/doctors?filter=pending')}
                        className="btn-primary w-full text-sm sm:text-base py-2 sm:py-3"
                    >
                        <FaUserMd className="mr-2 text-sm" /> Approuver Médecins ({statistics.pendingDoctors})
                    </button>
                    <button 
                        onClick={() => navigate('/dashboard/admin/patients')}
                        className="btn-secondary w-full text-sm sm:text-base py-2 sm:py-3"
                    >
                        <FaUsers className="mr-2 text-sm" /> Gérer les Patients
                    </button>
                    <button 
                        onClick={() => navigate('/dashboard/admin/reviews')}
                        className="btn-secondary w-full text-sm sm:text-base py-2 sm:py-3"
                    >
                        <FaFileMedicalAlt className="mr-2 text-sm" /> Voir Consultations
                    </button>
                    <button 
                        onClick={() => navigate('/dashboard/admin/blogs')}
                        className="btn-secondary w-full text-sm sm:text-base py-2 sm:py-3"
                    >
                        <FaFileAlt className="mr-2 text-sm" /> Gérer les Articles ({statistics.articles})
                    </button>
                </div>
            </div>
            <div className="card bg-gradient-to-br from-sky-500 to-blue-600 text-white p-4 sm:p-6 text-center">
              <h3 className="font-bold text-base sm:text-lg mb-2">Besoin d&apos;aide ?</h3>
              <p className="text-xs sm:text-sm text-white/90 mb-3 sm:mb-4">
                Consultez notre documentation ou contactez le support.
              </p>
              <button className="btn bg-white/20 text-white hover:bg-white/30 w-full text-sm sm:text-base py-2 sm:py-3">
                Contacter le Support
              </button>
            </div>
        </div>
      </div>
    </section>
  );
};

export default AdminHome;

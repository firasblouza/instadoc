import { useState, useEffect, useCallback } from "react";
import { FaMoneyBillWave, FaChartLine, FaUsers, FaUserMd, FaCalendarAlt, FaTrendingUp, FaDownload, FaEye } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import axios from "../../../../api/axios";
import useAccessToken from "../../../../hooks/useAccessToken";
import MedicalLoader from "../../../MedicalLoader";
import { useToast } from "../../../Notifications/ToastContainer";

const FinancialAnalytics = () => {
  const { accessToken } = useAccessToken();
  const { showSuccess, showError } = useToast();

  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState("month");
  const [payouts, setPayouts] = useState([]);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const [analyticsRes, payoutsRes] = await Promise.all([
        axios.get(`/appointments-v2/admin/analytics?period=${period}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        }),
        axios.get("/appointments-v2/admin/payouts", {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
      ]);

      setAnalytics(analyticsRes.data);
      setPayouts(payoutsRes.data.payouts || []);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      showError("Erreur lors du chargement des analytics");
    } finally {
      setLoading(false);
    }
  }, [accessToken, period, showError]);

  useEffect(() => {
    if (accessToken) {
      fetchAnalytics();
    }
  }, [fetchAnalytics]);

  const approvePayout = async (payoutId) => {
    try {
      await axios.put(`/appointments-v2/admin/payout/${payoutId}/approve`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      showSuccess("Paiement approuvé avec succès!");
      fetchAnalytics();
    } catch (error) {
      console.error("Error approving payout:", error);
      showError("Erreur lors de l'approbation du paiement");
    }
  };

  const COLORS = ['#0ea5e9', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6'];

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
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-primary-600 text-sm font-medium mb-4">
            <FaChartLine className="mr-2" />
            Analytics Financières
          </div>
          <h1 className="heading-1 text-neutral-900 mb-2">
            Tableau de bord{' '}
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              financier
            </span>
          </h1>
          <p className="body-large text-neutral-600 max-w-2xl mx-auto">
            Analysez les revenus, les consultations et les performances de la plateforme
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-2 shadow-md">
            {['week', 'month', 'year'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  period === p
                    ? 'bg-primary-500 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {p === 'week' ? 'Semaine' : p === 'month' ? 'Mois' : 'Année'}
              </button>
            ))}
          </div>
        </div>

        {analytics && (
          <>
            {/* Revenue Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="card-hover border-l-4 border-green-500">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Revenus Totaux</p>
                      <p className="text-2xl font-bold text-neutral-900">{analytics.totalRevenue} TND</p>
                    </div>
                    <FaMoneyBillWave className="text-green-500 text-2xl" />
                  </div>
                </div>
              </div>

              <div className="card-hover border-l-4 border-blue-500">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Revenus Plateforme</p>
                      <p className="text-2xl font-bold text-neutral-900">{analytics.platformRevenue} TND</p>
                    </div>
                    <FaTrendingUp className="text-blue-500 text-2xl" />
                  </div>
                </div>
              </div>

              <div className="card-hover border-l-4 border-purple-500">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Consultations</p>
                      <p className="text-2xl font-bold text-neutral-900">{analytics.totalConsultations}</p>
                    </div>
                    <FaCalendarAlt className="text-purple-500 text-2xl" />
                  </div>
                </div>
              </div>

              <div className="card-hover border-l-4 border-orange-500">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-600">Valeur Moyenne</p>
                      <p className="text-2xl font-bold text-neutral-900">{Math.round(analytics.averageConsultationValue)} TND</p>
                    </div>
                    <FaChartLine className="text-orange-500 text-2xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Daily Revenue Chart */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">Revenus quotidiens</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.dailyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id.day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalRevenue" fill="#0ea5e9" name="Revenus totaux" />
                    <Bar dataKey="platformRevenue" fill="#14b8a6" name="Revenus plateforme" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Top Doctors */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">Top médecins par revenus</h3>
                <div className="space-y-3">
                  {analytics.topDoctors.slice(0, 5).map((doctor, index) => (
                    <div key={doctor._id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-800">{doctor.doctorName}</p>
                          <p className="text-sm text-neutral-600">{doctor.speciality}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary-600">{doctor.totalEarnings} TND</p>
                        <p className="text-sm text-neutral-600">{doctor.consultationCount} consultations</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pending Payouts */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-neutral-800">Demandes de paiement</h3>
                <button
                  onClick={fetchAnalytics}
                  className="btn-secondary"
                >
                  Actualiser
                </button>
              </div>

              {payouts.length === 0 ? (
                <div className="text-center py-8">
                  <FaMoneyBillWave className="text-4xl text-neutral-300 mx-auto mb-2" />
                  <p className="text-neutral-500">Aucune demande de paiement en attente</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-200">
                        <th className="text-left py-3 px-4 font-medium text-neutral-700">Médecin</th>
                        <th className="text-left py-3 px-4 font-medium text-neutral-700">Montant</th>
                        <th className="text-left py-3 px-4 font-medium text-neutral-700">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-neutral-700">Statut</th>
                        <th className="text-left py-3 px-4 font-medium text-neutral-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payouts.map((payout) => (
                        <tr key={payout._id} className="border-b border-neutral-100 hover:bg-neutral-50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-neutral-800">
                                Dr. {payout.doctorId?.firstName} {payout.doctorId?.lastName}
                              </p>
                              <p className="text-sm text-neutral-600">{payout.doctorId?.speciality}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-primary-600">{payout.amount} TND</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-neutral-600">
                              {new Date(payout.requestedAt).toLocaleDateString('fr-FR')}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              payout.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              payout.status === 'approved' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {payout.status === 'pending' ? 'En attente' : 
                               payout.status === 'approved' ? 'Approuvé' : payout.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {payout.status === 'pending' && (
                              <button
                                onClick={() => approvePayout(payout._id)}
                                className="btn-primary text-sm"
                              >
                                Approuver
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FinancialAnalytics;


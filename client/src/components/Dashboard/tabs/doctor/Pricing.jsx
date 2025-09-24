import { useState, useEffect, useContext } from "react";
import { FaMoneyBillWave, FaClock, FaEdit, FaSave, FaBank, FaCreditCard, FaChartLine } from "react-icons/fa";
import axios from "../../../../api/axios";
import useAccessToken from "../../../../hooks/useAccessToken";
import AuthContext from "../../../../context/AuthContext";
import LoadingButton from "../../../LoadingButton";
import MedicalLoader from "../../../MedicalLoader";
import { useToast } from "../../../Notifications/ToastContainer";

const DoctorPricing = () => {
  const { accessToken, decodedToken } = useAccessToken();
  const { API_URL } = useContext(AuthContext);
  const { showSuccess, showError } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [pricing, setPricing] = useState(null);
  const [revenue, setRevenue] = useState(null);

  useEffect(() => {
    if (accessToken && decodedToken?.UserInfo?.id) {
      fetchPricing();
      fetchRevenue();
    }
  }, [accessToken, decodedToken]);

  const fetchPricing = async () => {
    try {
      const response = await axios.get(`/appointments-v2/doctor/${decodedToken.UserInfo.id}/pricing`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setPricing(response.data);
    } catch (error) {
      console.error("Error fetching pricing:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenue = async () => {
    try {
      const response = await axios.get(`/appointments-v2/doctor/${decodedToken.UserInfo.id}/revenue`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setRevenue(response.data);
    } catch (error) {
      console.error("Error fetching revenue:", error);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put(`/appointments-v2/doctor/${decodedToken.UserInfo.id}/pricing`, pricing, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      showSuccess("Tarifs mis à jour avec succès!");
      setEditing(false);
    } catch (error) {
      console.error("Error updating pricing:", error);
      showError("Erreur lors de la mise à jour des tarifs");
    } finally {
      setSaving(false);
    }
  };

  const updateConsultationRate = (type, field, value) => {
    setPricing(prev => ({
      ...prev,
      consultationRates: {
        ...prev.consultationRates,
        [type]: {
          ...prev.consultationRates[type],
          [field]: field === 'price' ? parseFloat(value) || 0 : parseInt(value) || 0
        }
      }
    }));
  };

  const updateBankAccount = (field, value) => {
    setPricing(prev => ({
      ...prev,
      payoutSettings: {
        ...prev.payoutSettings,
        bankAccount: {
          ...prev.payoutSettings.bankAccount,
          [field]: value
        }
      }
    }));
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-primary-600 text-sm font-medium mb-4">
            <FaMoneyBillWave className="mr-2" />
            Gestion des Tarifs
          </div>
          <h1 className="heading-1 text-neutral-900 mb-2">
            Vos{' '}
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              tarifs
            </span>
          </h1>
          <p className="body-large text-neutral-600 max-w-2xl mx-auto">
            Gérez vos tarifs de consultation et vos informations de paiement
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Revenue Overview */}
          <div className="lg:col-span-1 space-y-6">
            {revenue && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
                  <FaChartLine className="text-primary-500 mr-2" />
                  Revenus ce mois
                </h3>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-primary-50 rounded-xl">
                    <p className="text-3xl font-bold text-primary-600">
                      {revenue.totalRevenue} TND
                    </p>
                    <p className="text-sm text-neutral-600">Revenus totaux</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-xl font-bold text-neutral-800">{revenue.totalConsultations}</p>
                      <p className="text-xs text-neutral-600">Consultations</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-neutral-800">{Math.round(revenue.averagePerConsultation)}</p>
                      <p className="text-xs text-neutral-600">TND/consultation</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {pricing?.revenue && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
                  <FaBank className="text-primary-500 mr-2" />
                  Solde disponible
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Disponible</span>
                    <span className="font-bold text-green-600">{pricing.revenue.availableBalance} TND</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">En attente</span>
                    <span className="font-medium text-yellow-600">{pricing.revenue.pendingBalance} TND</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-neutral-600">Total gagné</span>
                    <span className="font-bold text-neutral-800">{pricing.revenue.totalEarnings} TND</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pricing Management */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-neutral-800">Tarifs de consultation</h3>
                <button
                  onClick={() => setEditing(!editing)}
                  className={`btn ${editing ? 'btn-secondary' : 'btn-primary'}`}
                >
                  <FaEdit className="mr-2" />
                  {editing ? 'Annuler' : 'Modifier'}
                </button>
              </div>

              {pricing && (
                <div className="space-y-6">
                  {Object.entries(pricing.consultationRates).map(([type, details]) => (
                    <div key={type} className="border border-neutral-200 rounded-xl p-4">
                      <h4 className="font-medium text-neutral-800 mb-3 capitalize">
                        {type.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-neutral-600 mb-1">Prix (TND)</label>
                          <input
                            type="number"
                            value={details.price}
                            onChange={(e) => updateConsultationRate(type, 'price', e.target.value)}
                            disabled={!editing}
                            className={`w-full px-3 py-2 border border-neutral-300 rounded-lg ${
                              editing ? 'bg-white' : 'bg-neutral-50'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-neutral-600 mb-1">Durée (min)</label>
                          <input
                            type="number"
                            value={details.duration}
                            onChange={(e) => updateConsultationRate(type, 'duration', e.target.value)}
                            disabled={!editing}
                            className={`w-full px-3 py-2 border border-neutral-300 rounded-lg ${
                              editing ? 'bg-white' : 'bg-neutral-50'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {editing && (
                <div className="flex gap-4 mt-6 pt-6 border-t border-neutral-200">
                  <button
                    onClick={() => setEditing(false)}
                    className="btn-secondary flex-1"
                  >
                    Annuler
                  </button>
                  <LoadingButton
                    onClick={handleSave}
                    isLoading={saving}
                    className="btn-primary flex-1"
                  >
                    <FaSave className="mr-2" />
                    {saving ? "Enregistrement..." : "Enregistrer"}
                  </LoadingButton>
                </div>
              )}
            </div>

            {/* Bank Account Settings */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-neutral-800 mb-6 flex items-center">
                <FaBank className="text-primary-500 mr-2" />
                Informations bancaires
              </h3>

              {pricing && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Nom du titulaire
                    </label>
                    <input
                      type="text"
                      value={pricing.payoutSettings?.bankAccount?.accountHolderName || ''}
                      onChange={(e) => updateBankAccount('accountHolderName', e.target.value)}
                      disabled={!editing}
                      className={`w-full px-4 py-3 border border-neutral-300 rounded-xl ${
                        editing ? 'bg-white' : 'bg-neutral-50'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Numéro de compte
                    </label>
                    <input
                      type="text"
                      value={pricing.payoutSettings?.bankAccount?.accountNumber || ''}
                      onChange={(e) => updateBankAccount('accountNumber', e.target.value)}
                      disabled={!editing}
                      className={`w-full px-4 py-3 border border-neutral-300 rounded-xl ${
                        editing ? 'bg-white' : 'bg-neutral-50'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Nom de la banque
                    </label>
                    <input
                      type="text"
                      value={pricing.payoutSettings?.bankAccount?.bankName || ''}
                      onChange={(e) => updateBankAccount('bankName', e.target.value)}
                      disabled={!editing}
                      className={`w-full px-4 py-3 border border-neutral-300 rounded-xl ${
                        editing ? 'bg-white' : 'bg-neutral-50'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      IBAN
                    </label>
                    <input
                      type="text"
                      value={pricing.payoutSettings?.bankAccount?.iban || ''}
                      onChange={(e) => updateBankAccount('iban', e.target.value)}
                      disabled={!editing}
                      className={`w-full px-4 py-3 border border-neutral-300 rounded-xl ${
                        editing ? 'bg-white' : 'bg-neutral-50'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorPricing;


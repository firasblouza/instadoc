import { useEffect, useState, useRef } from "react";
import { FaSave, FaEdit, FaTrashAlt, FaCog, FaLock, FaUser, FaBell, FaPalette, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { isValidPassword } from "../../../utils/Validation";
import axios from "../../../api/axios";
import useLogout from "../../../hooks/useLogout";
import useAccessToken from "../../../hooks/useAccessToken";
import LoadingButton from "../../LoadingButton";
import { useToast } from "../../Notifications/ToastContainer";

const Settings = () => {
  const [pwData, setPwData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const effectRan = useRef(null);
  const navigate = useNavigate();
  const logout = useLogout();
  const { accessToken, decodedToken } = useAccessToken();
  const { showSuccess, showError } = useToast();

  const [statusMessage, setStatusMessage] = useState({
    message: "",
    error: false
  });

  const [isModifying, setIsModifying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Validate inputs while user is typing
  useEffect(() => {
    if (!pwData.newPassword && !pwData.confirmPassword && !pwData.oldPassword) {
      return setStatusMessage({
        message: "",
        error: false
      });
    }
    if (isModifying && pwData.newPassword !== "") {
      if (!effectRan.current) {
        effectRan.current = true;
      } else {
        isValidPassword({
          from: "settings",
          password: pwData.newPassword,
          confirmPassword: pwData.confirmPassword,
          setMessage: setStatusMessage
        });
      }
    }
  }, [pwData, isModifying]);

  const handlePasswordChange = async () => {
    try {
      setSaving(true);
      if (accessToken && decodedToken) {
        const path = decodedToken.UserInfo.role === "doctor" ? "doctors" : "users";
        
        const response = await axios.put(
          `/${path}/password/${decodedToken.UserInfo.id}`,
          {
            oldPassword: pwData.oldPassword,
            newPassword: pwData.newPassword
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json"
            }
          }
        );

        if (response.status === 200) {
          setStatusMessage({
            message: "Mot de passe modifié avec succès",
            error: false
          });
          showSuccess("Mot de passe modifié avec succès!");
          setPwData({
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
          });
          setIsModifying(false);
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Erreur lors de la modification du mot de passe";
      setStatusMessage({
        message: errorMessage,
        error: true
      });
      showError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      if (accessToken && decodedToken) {
        const path = decodedToken.UserInfo.role === "doctor" ? "doctors" : "users";
        
        await axios.delete(`/${path}/${decodedToken.UserInfo.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        await logout();
        navigate("/");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="w-full bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sky-600 text-sm font-medium mb-4">
            <FaCog className="mr-2" />
            Paramètres
          </div>
          <h1 className="heading-1 text-neutral-900 mb-2">
            Paramètres du{' '}
            <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
              compte
            </span>
          </h1>
          <p className="body-large text-neutral-600 max-w-2xl mx-auto">
            Gérez vos préférences et paramètres de sécurité
          </p>
        </div>

        <div className="space-y-6">
          {/* Account Information */}
          <div className="card">
            <div className="card-body">
              <h2 className="heading-4 text-neutral-900 mb-4 flex items-center">
                <FaUser className="text-sky-500 mr-3" />
                Informations du Compte
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Nom complet</label>
                    <p className="px-4 py-3 bg-neutral-50 rounded-xl text-neutral-900 font-medium">
                      {decodedToken?.UserInfo?.fullName || "Non défini"}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
                    <p className="px-4 py-3 bg-neutral-50 rounded-xl text-neutral-900 font-medium">
                      {decodedToken?.UserInfo?.email || "Non défini"}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Rôle</label>
                    <p className="px-4 py-3 bg-neutral-50 rounded-xl text-neutral-900 font-medium capitalize">
                      {decodedToken?.UserInfo?.role === 'user' ? 'Patient' : 
                       decodedToken?.UserInfo?.role === 'doctor' ? 'Médecin' : 
                       decodedToken?.UserInfo?.role === 'admin' ? 'Administrateur' : 'Non défini'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Password Change */}
          <div className="card">
            <div className="card-body">
              <h2 className="heading-4 text-neutral-900 mb-4 flex items-center">
                <FaLock className="text-sky-500 mr-3" />
                Sécurité
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Ancien mot de passe
                  </label>
                  <input
                    type="password"
                    value={pwData.oldPassword}
                    disabled={!isModifying}
                    onChange={(e) => setPwData({ ...pwData, oldPassword: e.target.value })}
                    className={`w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all ${
                      !isModifying ? 'bg-neutral-50 text-neutral-500' : 'bg-white'
                    }`}
                    placeholder="Entrez votre ancien mot de passe"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      value={pwData.newPassword}
                      disabled={!isModifying}
                      onChange={(e) => setPwData({ ...pwData, newPassword: e.target.value })}
                      className={`w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all ${
                        !isModifying ? 'bg-neutral-50 text-neutral-500' : 'bg-white'
                      }`}
                      placeholder="Nouveau mot de passe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      value={pwData.confirmPassword}
                      disabled={!isModifying}
                      onChange={(e) => setPwData({ ...pwData, confirmPassword: e.target.value })}
                      className={`w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all ${
                        !isModifying ? 'bg-neutral-50 text-neutral-500' : 'bg-white'
                      }`}
                      placeholder="Confirmez le mot de passe"
                    />
                  </div>
                </div>

                {/* Status Message */}
                {statusMessage.message && (
                  <div className={`p-3 rounded-lg ${
                    statusMessage.error 
                      ? 'bg-red-50 text-red-800 border border-red-200' 
                      : 'bg-green-50 text-green-800 border border-green-200'
                  }`}>
                    {statusMessage.message}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={() => setIsModifying(!isModifying)}
                    className={`btn-lg flex items-center justify-center ${
                      !isModifying
                        ? 'btn-primary'
                        : 'btn-secondary'
                    }`}
                  >
                    <FaEdit className="mr-2" />
                    {isModifying ? 'Annuler' : 'Modifier le mot de passe'}
                  </button>
                  
                  {isModifying && (
                    <LoadingButton
                      onClick={handlePasswordChange}
                      isLoading={saving}
                      disabled={!pwData.oldPassword || !pwData.newPassword || !pwData.confirmPassword || statusMessage.error}
                      className="btn bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 btn-lg flex items-center justify-center"
                    >
                      <FaSave className="mr-2" />
                      {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </LoadingButton>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Notifications Settings */}
          <div className="card">
            <div className="card-body">
              <h2 className="heading-4 text-neutral-900 mb-4 flex items-center">
                <FaBell className="text-sky-500 mr-3" />
                Notifications
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                  <div>
                    <h3 className="font-semibold text-neutral-900">Notifications par email</h3>
                    <p className="text-sm text-neutral-600">Recevez des notifications importantes par email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                  <div>
                    <h3 className="font-semibold text-neutral-900">Rappels de rendez-vous</h3>
                    <p className="text-sm text-neutral-600">Recevez des rappels avant vos consultations</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="card">
            <div className="card-body">
              <h2 className="heading-4 text-neutral-900 mb-4 flex items-center">
                <FaPalette className="text-sky-500 mr-3" />
                Apparence
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">Thème</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center p-4 border border-neutral-300 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors">
                      <input type="radio" name="theme" value="light" className="sr-only peer" defaultChecked />
                      <div className="w-4 h-4 border-2 border-neutral-300 rounded-full peer-checked:border-sky-500 peer-checked:bg-sky-500 mr-3"></div>
                      <span className="font-medium text-neutral-900">Clair</span>
                    </label>
                    
                    <label className="flex items-center p-4 border border-neutral-300 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors">
                      <input type="radio" name="theme" value="dark" className="sr-only peer" />
                      <div className="w-4 h-4 border-2 border-neutral-300 rounded-full peer-checked:border-sky-500 peer-checked:bg-sky-500 mr-3"></div>
                      <span className="font-medium text-neutral-900">Sombre</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card border-red-200">
            <div className="card-body">
              <h2 className="heading-4 text-red-600 mb-4 flex items-center">
                <FaShieldAlt className="text-red-500 mr-3" />
                Zone de Danger
              </h2>
              
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <h3 className="font-semibold text-red-900 mb-2">Supprimer le compte</h3>
                <p className="text-sm text-red-700 mb-4">
                  Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="btn bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 flex items-center gap-2"
                >
                  <FaTrashAlt />
                  Supprimer mon compte
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-red-600 mb-4">Confirmer la suppression</h3>
            <p className="text-neutral-600 mb-6">
              Êtes-vous absolument sûr de vouloir supprimer votre compte ?
              Cette action est <strong>irréversible</strong> et toutes vos données seront perdues.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 btn-secondary"
                disabled={deleting}
              >
                Annuler
              </button>
              <LoadingButton
                onClick={handleDeleteAccount}
                isLoading={deleting}
                className="flex-1 btn bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
              >
                {deleting ? "Suppression..." : "Supprimer définitivement"}
              </LoadingButton>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Settings;
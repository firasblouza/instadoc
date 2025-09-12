import { useState, useEffect, useRef, useContext } from "react";
import { FaUpload, FaEdit, FaSave, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaFileAlt, FaCamera } from "react-icons/fa";
import axios from "../../../api/axios";
import useAccessToken from "../../../hooks/useAccessToken";
import AuthContext from "../../../context/AuthContext";
import LoadingButton from "../../LoadingButton";
import MedicalLoader from "../../MedicalLoader";

const Profile = () => {
  const effectRan = useRef(false);
  const { accessToken, decodedToken } = useAccessToken();

  const [isModifying, setIsModifying] = useState(false);
  const [uploadedProfile, setUploadedProfile] = useState(null);
  const [uploadedCV, setUploadedCV] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    phoneNumber: "",
    profileImage: null,
    role: ""
  });

  const { API_URL } = useContext(AuthContext);
  const IMG_URL = `${API_URL}/uploads/`;
  const imgPlaceholder = `${IMG_URL}imagePlaceholder.png`;

  // Save Changes
  const saveChanges = async () => {
    try {
      setSaving(true);
      if (accessToken && accessToken !== "" && decodedToken) {
        const formData = new FormData();
        formData.append("user", JSON.stringify(user));
        if (uploadedProfile) {
          formData.append("profileImage", uploadedProfile);
        }
        if (uploadedCV) {
          formData.append("cvImage", uploadedCV);
        }
        const path =
          decodedToken.UserInfo.role === "user" ||
          decodedToken.UserInfo.role === "admin"
            ? "users"
            : "doctors";
        const response = await axios.put(
          `/${path}/${decodedToken.UserInfo.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "multipart/form-data"
            }
          }
        );
        if (response.status === 200) {
          // Update user data with the response to get the new file paths
          setUser(prevUser => ({
            ...prevUser,
            ...response.data,
            role: prevUser.role // Preserve the role
          }));
          setIsModifying(false);
          // DON'T clear uploaded files - keep the preview showing until page refresh
          // This prevents the broken image issue and provides better UX
          // setUploadedProfile(null);
          // setUploadedCV(null);
          
          // Show success message with modern styling
          const successDiv = document.createElement('div');
          successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse';
          successDiv.textContent = 'Profil mis à jour avec succès!';
          document.body.appendChild(successDiv);
          setTimeout(() => document.body.removeChild(successDiv), 3000);
        }
      } else {
        console.log("No access token found");
      }
    } catch (error) {
      console.log("An error occurred while updating the user:", error);
      // Show error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorDiv.textContent = 'Erreur lors de la mise à jour du profil';
      document.body.appendChild(errorDiv);
      setTimeout(() => document.body.removeChild(errorDiv), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = (e) => {
    if (e.target.name === "profileImage") {
      setUploadedProfile(e.target.files[0]);
      setUser({ ...user, profileImage: e.target.files[0] });
    } else if (e.target.name === "cvImage") {
      setUploadedCV(e.target.files[0]);
      setUser({ ...user, cvImage: e.target.files[0] });
    }
  };

  useEffect(() => {
    if (effectRan.current === false) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          if (accessToken && accessToken !== "" && decodedToken) {
            const path =
              decodedToken.UserInfo.role === "user" ||
              decodedToken.UserInfo.role === "admin"
                ? "users"
                : "doctors";
            const response = await axios.get(
              `/${path}/${decodedToken.UserInfo.id}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`
                }
              }
            );
            setUser({...response.data, role: decodedToken.UserInfo.role});
          } else {
            console.log("No id found");
          }
        } catch (err) {
          if (err && err.response && err.response.status === 401) {
            console.log(
              "Unauthorized: You need to log in or refresh your token"
            );
          } else {
            console.log("An error occurred while fetching data:", err.message);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }

    return () => {
      effectRan.current = true;
    };
  }, [accessToken, decodedToken]);

  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-60px)] flex items-center justify-center">
        <MedicalLoader type="heartbeat" />
      </div>
    );
  }

  return (
    <section className="w-full bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sky-600 text-sm font-medium mb-4">
            <FaUser className="mr-2" />
            Mon Profil
          </div>
          <h1 className="heading-1 text-neutral-900 mb-2">
            Gérez votre{' '}
            <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
              profil
            </span>
          </h1>
          <p className="body-large text-neutral-600 max-w-2xl mx-auto">
            Gérez vos informations personnelles et préférences
          </p>
        </div>

        {/* Main Profile Card */}
        <div className="card overflow-hidden mb-6">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 px-8 py-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Image */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-lg">
                  <img
                    src={
                      uploadedProfile
                        ? URL.createObjectURL(uploadedProfile)
                        : user.profileImage
                        ? `${IMG_URL}${user.profileImage}`
                        : imgPlaceholder
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {isModifying && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaCamera className="text-white text-xl" />
                    <input
                      type="file"
                      accept="image/*"
                      name="profileImage"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                )}
              </div>

              {/* Profile Info */}
              <div className="text-center md:text-left text-white">
                <h2 className="text-3xl font-bold mb-2">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-blue-100 mb-1">{user.email}</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-sm">
                  {user.role === 'doctor' ? '👨‍⚕️ Médecin' : user.role === 'admin' ? '👨‍💼 Administrateur' : '👤 Patient'}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FaUser className="text-blue-600 mr-2" />
                  Informations Personnelles
                </h3>

                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={user.firstName || ''}
                    disabled={!isModifying}
                    onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      !isModifying ? 'bg-gray-50 text-gray-500' : 'bg-white'
                    }`}
                    placeholder="Votre prénom"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={user.lastName || ''}
                    disabled={!isModifying}
                    onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      !isModifying ? 'bg-gray-50 text-gray-500' : 'bg-white'
                    }`}
                    placeholder="Votre nom"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FaCalendarAlt className="text-blue-600 mr-2" />
                    Date de Naissance
                  </label>
                  <input
                    type="date"
                    value={user.dateOfBirth ? user.dateOfBirth.substring(0, 10) : ''}
                    disabled={!isModifying}
                    onChange={(e) => setUser({ ...user, dateOfBirth: e.target.value })}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      !isModifying ? 'bg-gray-50 text-gray-500' : 'bg-white'
                    }`}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FaEnvelope className="text-blue-600 mr-2" />
                  Contact
                </h3>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email || ''}
                    disabled={!isModifying}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      !isModifying ? 'bg-gray-50 text-gray-500' : 'bg-white'
                    }`}
                    placeholder="votre.email@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FaPhone className="text-blue-600 mr-2" />
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={user.phoneNumber || ''}
                    disabled={!isModifying}
                    onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      !isModifying ? 'bg-gray-50 text-gray-500' : 'bg-white'
                    }`}
                    placeholder="+216 XX XXX XXX"
                  />
                </div>

                {/* Doctor CV Section */}
                {user.role === "doctor" && (
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <FaFileAlt className="text-blue-600 mr-2" />
                      Curriculum Vitae
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      {user.cvImage || uploadedCV ? (
                        <div className="space-y-3">
                          <img
                            src={
                              uploadedCV
                                ? URL.createObjectURL(uploadedCV)
                                : user.cvImage
                                ? `${IMG_URL}${user.cvImage}`
                                : imgPlaceholder
                            }
                            alt="CV"
                            className="mx-auto max-h-40 rounded-lg shadow-md"
                          />
                          {isModifying && (
                            <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                              <FaUpload className="mr-2" />
                              Changer CV
                              <input
                                type="file"
                                accept="image/*"
                                name="cvImage"
                                className="hidden"
                                onChange={handleFileUpload}
                              />
                            </label>
                          )}
                        </div>
                      ) : (
                        isModifying && (
                          <label className="cursor-pointer">
                            <div className="space-y-2">
                              <FaUpload className="mx-auto text-3xl text-gray-400" />
                              <p className="text-gray-600">Cliquez pour télécharger votre CV</p>
                              <p className="text-sm text-gray-400">PNG, JPG jusqu&apos;à 10MB</p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              name="cvImage"
                              className="hidden"
                              onChange={handleFileUpload}
                            />
                          </label>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setIsModifying(!isModifying)}
                className={`flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all ${
                  !isModifying
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                <FaEdit className="mr-2" />
                {isModifying ? 'Annuler' : 'Modifier'}
              </button>
              
              <LoadingButton
                onClick={saveChanges}
                disabled={!isModifying}
                isLoading={saving}
                className={`flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all ${
                  !isModifying
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
                }`}
              >
                <FaSave className="mr-2" />
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;

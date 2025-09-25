import { useState } from "react";
import { FaLock, FaCalendarAlt, FaEye, FaEyeSlash, FaArrowRight, FaArrowLeft, FaUser, FaPhone, FaUpload, FaImage } from "react-icons/fa";
import { doctorSpecialties } from "../../data/data";
import LoadingButton from "../LoadingButton";

const SignupData = ({
  userData,
  setUserData,
  changeStep,
  handleUserSignup
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData({ ...userData, profileImage: file });
    }
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    try {
      if (userData.role === "patient") {
        await handleUserSignup(e);
      } else {
        changeStep(e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Password Fields */}
      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
            <FaLock className="text-primary-500" />
            Mot de passe
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              placeholder="Créez un mot de passe sécurisé"
              required
              className="w-full px-4 py-3 pr-12 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition-colors duration-200"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Minimum 8 caractères avec majuscules, minuscules et chiffres
          </p>
        </div>
        
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
            <FaLock className="text-primary-500" />
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={userData.confirmPassword}
              onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
              placeholder="Confirmez votre mot de passe"
              required
              className="w-full px-4 py-3 pr-12 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition-colors duration-200"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
      </div>

      {/* Phone Number and Date of Birth - 50/50 Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
            <FaPhone className="text-primary-500" />
            Numéro de téléphone
          </label>
          <input
            type="tel"
            value={userData.phoneNumber}
            onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
            placeholder="+216 XX XXX XXX"
            required
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
            <FaCalendarAlt className="text-primary-500" />
            Date de naissance
          </label>
          <input
            type="date"
            value={userData.dateOfBirth}
            onChange={(e) => setUserData({ ...userData, dateOfBirth: e.target.value })}
            required
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Profile Photo Upload for Patients */}
      {userData.role === "patient" && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
            <FaImage className="text-primary-500" />
            Photo de profil
          </label>
          <div className="border-2 border-dashed border-neutral-300 rounded-xl p-4 hover:border-primary-500 transition-colors duration-200">
            <div className="text-center">
              <div className="relative inline-block">
                <button
                  type="button"
                  className="btn-secondary group"
                >
                  <FaUpload className="mr-2 group-hover:scale-110 transition-transform duration-200" />
                  Choisir une photo
                </button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <p className="text-xs text-neutral-500 mt-2">Format: JPG, PNG (Max: 5MB)</p>
              {userData.profileImage && (
                <p className="text-xs text-green-600 mt-1 font-medium">
                  ✓ {userData.profileImage.name}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Specialty for Doctors */}
      {userData.role === "doctor" && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
            <FaUser className="text-primary-500" />
            Spécialité médicale
          </label>
          <select
            value={userData.speciality}
            onChange={(e) => setUserData({ ...userData, speciality: e.target.value })}
            required
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white transition-all duration-200"
          >
            <option value="">Sélectionnez votre spécialité</option>
            {doctorSpecialties.map((specialty, index) => (
              <option key={index} value={specialty.value}>
                {specialty.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 pt-4">
        <LoadingButton
          type="button"
          className="btn-secondary flex-1"
          onClick={changeStep}
          name="back"
        >
          <FaArrowLeft className="mr-2" />
          Retour
        </LoadingButton>
        
        <LoadingButton
          type={userData.role === "patient" ? "submit" : "button"}
          isLoading={isLoading}
          loadingText={userData.role === "patient" ? "Inscription..." : "Chargement..."}
          className="btn-primary flex-1 group"
          onClick={userData.role === "doctor" ? changeStep : (e) => handleSubmit(e)}
          name={userData.role === "patient" ? "userSubmit" : "doctor_next"}
        >
          <span>{userData.role === "patient" ? "Créer mon compte" : "Continuer"}</span>
          <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </LoadingButton>
      </div>
    </form>
  );
};

export default SignupData;

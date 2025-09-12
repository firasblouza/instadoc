import { useState } from "react";
import { FaLock, FaCalendarAlt, FaEye, FaEyeSlash, FaArrowRight, FaArrowLeft, FaUserMd } from "react-icons/fa";
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

      {/* Date of Birth */}
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

      {/* Specialty for Doctors */}
      {userData.role === "doctor" && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
            <FaUserMd className="text-primary-500" />
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

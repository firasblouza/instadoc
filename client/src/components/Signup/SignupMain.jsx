import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaCalendarAlt, FaEye, FaEyeSlash, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import LoadingButton from "../LoadingButton";

const SignupMain = ({
  changeStep,
  userData,
  setUserData,
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
      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
            <FaUser className="text-primary-500" />
            Prénom
          </label>
          <input
            type="text"
            value={userData.firstName}
            onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
            placeholder="Votre prénom"
            required
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
            <FaUser className="text-primary-500" />
            Nom
          </label>
          <input
            type="text"
            value={userData.lastName}
            onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
            placeholder="Votre nom"
            required
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Email Field */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
          <FaEnvelope className="text-primary-500" />
          Adresse email
        </label>
        <input
          type="email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          placeholder="votre@email.com"
          required
          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Role Selection */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
          <FaUser className="text-primary-500" />
          Je suis un(e)
        </label>
        <select
          value={userData.role}
          onChange={(e) => setUserData({ ...userData, role: e.target.value })}
          required
          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white transition-all duration-200"
        >
          <option value="">Sélectionnez votre rôle</option>
          <option value="patient">Patient</option>
          <option value="doctor">Médecin</option>
        </select>
      </div>

      {/* Submit Button */}
      <LoadingButton
        type="button"
        isLoading={isLoading}
        loadingText="Chargement..."
        className="btn-primary btn-lg w-full group"
        onClick={changeStep}
        name="next"
      >
        <span>Continuer</span>
        <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
      </LoadingButton>
    </form>
  );
};

export default SignupMain;
